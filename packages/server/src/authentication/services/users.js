/** @module src/authentication/services/users */


const { JWT } = require('../utils')
const events = require('../../core/events')
const { User, ProfileType, VisualizationType, APIAccessToken, Company } = require('../models')
const { UserAccessedBy, Group, Form, FieldType, Field } = require('../../formulary/models')
const PasswordService = require('./password')


/**
 * Service responsible for managing everything about users inside of reflow.
 */
class UserService {
    /**
     * @param {number} companyId - The companyId that the users is being created or updated for.
     * @param {number} userId - The user id that is managing the users
     */
    constructor(companyId, userId) {
        this.companyId = companyId
        this.userId = parseInt(userId)
    }

    /**
     * Validate if the user can create or update a user in reflow. We only let him update or create new users
     * we do not let him update himself because he can disable the admin profile for himself or disable a page,
     * and this would be bad.
     * 
     * @param {number} userId - user id to validate.
     * 
     * @returns {Promise<Array<boolean,string>>} - A promise that resolves to an array with the first element as a boolean
     * indicating if the user can be saved or not and the second element is the reason.
     */
     async canUserSaveAnotherUser(userId, userEmail) {
        const existsUser = await User.AUTHENTICATION.userExistsByEmail(userEmail)
        if (parseInt(userId) === parseInt(this.userId)) {
            return [false, 'cannot_edit_yourself']
        } else if (existsUser) {
            return [false, 'user_already_exists']
        } else {
            return [true, '']
        }
    }

    /**
     * Function used to update access token of the user, if hasAPIAccessKey is set to false
     * then we will delete any api key set for him, otherwise we update or create a new API key.
     * 
     * @param {object} transaction - The transaction to use in the query.
     * @param {number} userId - The id of the user to update the API access key for. 
     * @param {boolean} hasAPIAccessKey - Does the user have access to the API? Defaults to false.
     */
    async updateApiAccessKeyOfUser(transaction, userId, hasAPIAccessKey=false) {
        if (hasAPIAccessKey) {
            if (!await APIAccessToken.AUTHENTICATION.existsByCompanyIdAndUserId(this.companyId, userId)) {
                await APIAccessToken.AUTHENTICATION.create(this.companyId, userId, transaction)
            }
        } else {
            await APIAccessToken.AUTHENTICATION.delete(this.companyId, userId, transaction)
        }
    }

    /**
     * This creates the new user as option on every users of the company, this way when the admin creates a new user he doesn't need to manually
     * got for each user and add the access for this new user, the access is given by default.
     * 
     * @param {object} transaction - The transaction object to be used for creating the UserAccessedBy options for every user of the company.
     * @param {number} createdUserId - The created user id to add to the UserAccessedBy options of every user of the company.
     */
    async #createUserUserPemissionsWhenUserIsCreated(transaction, createdUserId) {
        const usersFromCompany = await User.AUTHENTICATION.activeUsersByCompanyId(this.companyId)
        const groupIds = ((await Group.AUTHENTICATION.groupIdsByCompanyId(this.companyId)) ?? []).map(group => group.id)
        const mainFormularyIds = ((await Form.AUTHENTICATION.mainFormIdsByGroupIds(groupIds)) ?? []).map(form => form.id)
        const sectionIds = ((await Form.AUTHENTICATION.sectionIdsByMainFormularyIds(mainFormularyIds)) ?? []).map(section => section.id)
        const userFieldTypeId = (await FieldType.AUTHENTICATION.userFieldTypeId())?.id
        
        if (sectionIds.length > 0 && ![null, undefined].includes(userFieldTypeId)) {
            const userFieldIds = await Field.AUTHENTICATION.fieldIdsBySectionIdsAndFieldTypeId(sectionIds, userFieldTypeId)
            for (const userFieldId of userFieldIds) {
                for (const user of usersFromCompany) {
                    await UserAccessedBy.AUTHENTICATION.createIfDoesntExist(
                        user.id, userFieldId, createdUserId, transaction
                    )
                }
            }
        }
    }

    /**
     * This function notifies a new user with an email with his new password but also creates the billing information of this user.
     * This also sets the kanban defaults for the user, this means we cop the kanban_defaults of a user and passes it to the newly created
     * user.
     * 
     * @param {object} transaction - The transaction to use when this function runs
     * @param {number} userId - The user instance id that was created.
     * @param {string} userEmail - The email of the user that was created.
     * @param {string} changePasswordUrl - The url the user should go to change his password.
     */
    async #createNewUserNotifyUpdateBillingAndAddKanbanDefaults(transaction, userId, userEmail, changePasswordUrl) {
        const companyName = (await Company.AUTHENTICATION.companyNameById(this.companyId))?.name
        if (companyName) {
            //BillingService(self.company.id, self.user_id).update_charge()
            await PasswordService.requestNewTemporaryPasswordForUser(transaction, userEmail, changePasswordUrl, companyName)
            //KanbanService.copy_defaults_to_company_user(self.company.id, self.user_id, instance.id)
        }
    }

    /**
     * Updates a user permissions to both formularies and options.
     * 
     * @param {object} transaction - The transaction to use when this function runs
     * @param {number} userId - The user instance id that was created or updated
     * @param {object[]} formAccessedBy - A list of form ids that the user has access to.
     * @param {object[]} optionsAccessedBy - An array of options that the user has access to in all of the formularies.
     */
    async #updateUserFormulariesAndOptionsPermissions(transaction, userId, formAccessedBy, optionsAccessedBy) {
        //FormularyService(user_id, self.company.id).update_formulary_ids_the_user_has_access_to(form_ids_accessed_by)
        //FieldOptionsService(self.company.id).update_fields_options_accessed_by_user(user_id, field_option_ids_accessed_by)
    }

    /**
     * Updates the user permissions, similar from filtering the data by the options we can filter the data by the user options
     * So let's for example imagine the following scenario: We have 'Lucas' and 'Nicolas' users. 
     * 
     * 'Lucas' can only see what is from Lucas and 'Nicolas' can only see what is from Nicolas. With this functionality we can filter
     * what the user can see.
     * 
     * But let's imagine the following scenario: 
     * The formulary has two user fields: 'Who created' and 'Responsible for Task'.
     * 
     * Who created can be anyone but the Responsible for Task should be only for the specific user.
     * In this scenario we filter just by the `Responsible for Task` value
     * 
     * @param {object} transaction - The transaction object to use.
     * @param {number} userId - The id of the user to update the permissions for.
     * @param {Array<object>} usersAccessedBy - The options that the user has access to. Defaults to []
     */
    async #updateUserUsersPermission(transaction, userId, usersAccessedBy) {
        let savedInstancesIds = []
        for (const userAccessedBy of usersAccessedBy){
            const instance = await UserAccessedBy.AUTHENTICATION.createIfDoesntExist(
                userId, userAccessedBy.fieldId, userAccessedBy.userId, transaction
            )
            savedInstancesIds.push(instance.id)
        }
        await UserAccessedBy.AUTHENTICATION.deleteByUserIdExcludingUserAccessedByIds(
            userId, savedInstancesIds, transaction
        )
    }

    /**
     * Create a new user outside of the onboarding process on the `users` settings page.
     * 
     * @param {object} attributes - The default attributes for creating a new user.
     * @param {number} attributes.profileId - The profile of the user. Is he an admin, is he a colaborator? What is him?
     * @param {string} attributes.email - The email of the user.
     * @param {string} attributes.firstName - The first name of the user.
     * @param {string} attributes.lastName - The last name of the user.
     * @param {boolean} attributes.hasAPIAccess - Does the user have access to the API?
     * @param {Array<object>} [attributes.optionsAccessedBy=[]] - The options that the user has access to. Defaults to [].
     * @param {Array<object>} [attributes.formAccessedBy=[]] - The forms that the user has access to. Defaults to []
     * @param {Array<object>} [attributes.userAccessedBy=[]] - The users that the user has access to. Defaults to [].
     * @param {string|null} [attributes.changePasswordUrl=null] - The url to change the password of the user. We will send this
     * by email.
     * @param {object} transaction - The transaction object.
     * 
     * @returns {Promise<User>} - The user object created.
     */
    async createUser({profileId, email, firstName, lastName, hasAPIAccess, optionsAccessedBy=[], 
        formAccessedBy=[], userAccessedBy=[], changePasswordUrl=null}={}, transaction) {
        const listingVisualizationTypeId = (await VisualizationType.AUTHENTICATION.visualizationTypeIdOfListing())?.id
        const user = await User.AUTHENTICATION.createUser({
            companyId: this.companyId, 
            profileId, 
            visualizationTypeId: listingVisualizationTypeId, 
            email, 
            firstName, 
            lastName
        }, transaction)
        await this.updateApiAccessKeyOfUser(transaction, user.id, hasAPIAccess)
        await this.#updateUserFormulariesAndOptionsPermissions(transaction, user.id, formAccessedBy, optionsAccessedBy)
        await this.#createNewUserNotifyUpdateBillingAndAddKanbanDefaults(transaction, user.id, email, changePasswordUrl)
        await this.#updateUserUsersPermission(transaction, user.id, userAccessedBy)
        await this.#createUserUserPemissionsWhenUserIsCreated(transaction, user.id)

        events.emit('userCreated', {
            companyId: this.companyId,
            userId: user.id
        })

        return user
    }

    /**
     * Deletes a user if the user being deleted is not the same as the user that is deleting the user.
     * 
     * @param {number} userId - The id of the user to delete.
     * @param {object} transaction - The transaction object to use in this deletion query.
     */
    async deleteUser(userId, transaction) {
        if (parseInt(userId) !== parseInt(this.userId)){
            await User.AUTHENTICATION.deleteByUserIdAndCompanyId(userId, this.companyId, transaction)
            // BillingService(self.company.id, self.user_id).update_charge()
        }
    }

    /**
     * Updates a user and it's permissions to both formularies and options.
     * 
     * @param {object} attributes - The default attributes for creating a new user.
     * @param {number} attributes.userId - The id of the user to update.
     * @param {number} attributes.profileId - The profile of the user. Is he an admin, is he a colaborator? What is him?
     * @param {string} attributes.email - The email of the user.
     * @param {string} attributes.firstName - The first name of the user.
     * @param {string} attributes.lastName - The last name of the user.
     * @param {boolean} attributes.hasAPIAccess - Does the user have access to the API?
     * @param {Array<object>} [attributes.optionsAccessedBy=[]] - The options that the user has access to. Defaults to [].
     * @param {Array<object>} [attributes.formAccessedBy=[]] - The forms that the user has access to. Defaults to []
     * @param {Array<object>} [attributes.userAccessedBy=[]] - The users that the user has access to. Defaults to [].

     * @param {object} transaction - The transaction object.
     * 
     * @returns {Promise<User>} - The user object created.
     */
    async updateUser({userId, profileId, email, firstName, lastName, hasAPIAccess, optionsAccessedBy=[], 
        formAccessedBy=[], userAccessedBy=[]}={}, transaction) {
        if (userId !== this.userId){
            const updatedInstancesNumber = await User.AUTHENTICATION.updateUser({
                userId: userId,
                companyId: this.companyId,
                profileId: profileId,
                email: email,
                firstName: firstName,
                lastName: lastName
            }, transaction)

            if (updatedInstancesNumber[0] > 0){
                events.emit('userUpdated', {
                    companyId: this.companyId,
                    userId: userId
                })
        
                await this.updateApiAccessKeyOfUser(transaction, userId, hasAPIAccess)
                await this.#updateUserFormulariesAndOptionsPermissions(transaction, userId, formAccessedBy, optionsAccessedBy)
                await this.#updateUserUsersPermission(transaction, userId, userAccessedBy)
            }
        }
    }
    /**
     * Creates a new user on the onboarding process.
     * 
     * @param {number} companyId - The created company id to append to the user.
     * @param {string} userEmail - The email of the user.
     * @param {string} userFirstName - The first name of the user.
     * @param {string} userLastName - The last name of the user.
     * @param {string} userPassword - The password that the used filled on the onboarding step.
     * @param {string} userPhone - The phone of the user. Used mostly for analytics and sales purposes
     * @param {object} transaction - The transaction object.
     * 
     * @returns {object} - The user object.
     */
    static async createUserOnOnboarding(companyId, userEmail, userFirstName, userLastName, 
        userPassword, userPhone, transaction) {
        
        const adminProfileId = (await ProfileType.AUTHENTICATION.profileIdOfAdmin())?.id
        const listingVisualizationTypeId = (await VisualizationType.AUTHENTICATION.visualizationTypeIdOfListing())?.id
        
        const user = await User.AUTHENTICATION.createUser({
            companyId: companyId, 
            profileId: adminProfileId, 
            visualizationTypeId: listingVisualizationTypeId, 
            email: userEmail, 
            firstName: userFirstName, 
            lastName: userLastName, 
            password: userPassword, 
            phone: userPhone
        }, transaction)
        
        // Added api acess for newly created user since he cannot edit itself
        // TODO: need to change this once the user can edit himself
        // UsersService.update_api_access_key_of_user(company.id, user.id, True)
        // update billing information
        // BillingService.create_on_onboarding(company.id, user.id, partner, discount_coupon_name)
        // updates formula context
        // FlowFormulaService.update_company_formula_context(company)
        return user
    }

    /**
     * When the refresh token is updated we interpret it as the user made login in our platform
     * because the user can stay logged in forever in our platform without the need of making login
     * again.
     * 
     * @param {number} userId - The id of the user that is retrieving the refresh token.
     * @param {object} transaction - The transaction object to be used for updating the user data.
     * 
     * @returns {object} - The object with the new access token and the new refresh token.
     */
     static async updateRefreshTokenAndUserLastLogin(userId, transaction) {
        await User.AUTHENTICATION.updateUserLastLogin(userId, transaction)
        const user = await User.AUTHENTICATION.userById(userId)

        events.emit('userRefreshToken', {
            companyId: user.companyId,
            userId: userId
        })

        return {
            accessToken: JWT.getToken(user.id),
            refreshToken: JWT.getRefreshToken(user.id)
        }
    }

    /**
     * Updates the visualization of the user on all of the formularies, this visualization can be either 
     * `listing`, `dashboard`, `kanban` and so on.
     * 
     * @param {number} userId - The id of the user to update the visualization type for.
     * @param {number} visualizationTypeId - The id of the visualization type to set for the user.
     * @param {object} transaction - The transaction to use in the query.
     */
    static async updateUserVisualizationType(userId, visualizationTypeId, transaction) {
        await User.AUTHENTICATION.updateUserVisualizationType(userId, visualizationTypeId, transaction)
    }
    
}

module.exports = UserService