/** @module src/authentication/services/onboarding */

const CompanyService = require('./company')
const UserService = require('./users')
const events = require('../../core/events')

/**
 * Service responsible for onboarding a new company/user inside of reflow.
 */
class OnboardingService {
    /**
     * Onboards a new user and creates a new company (aswell as a new user). Updates the billing info on the fly.
     * 
     * @param {Object} attributes - The attributes to onboard the user with.
     * @param {string} attributes.userEmail - The email of the user that he created.
     * @param {string} attributes.userFirstName - The first name of the user that was created.
     * @param {string} attributes.userLastName - The last name of the user that was created.
     * @param {string} attributes.userPassword - The password of the user that was created. He needs to type it twice so
     * it's certain that he won't forget what he have created.
     * @param {string} attributes.userPhone - The phone number of the user that was created so we can call him/her if 
     * needed for sales.
     * @param {string | null} [attributes.companyName=null] - The name of the company that was created. If null we will
     * create dynamically.
     * @param {number} [attributes.companyNumberOfEmployees=0] - The number of employees that the company has.
     * @param {string} [attributes.companySector=''] - The industry of the company.
     * @param {string | null} [attributes.sharedBy=null] - If the company refered to another company this will hold the company
     * endpoint that shared it as a string.
     * @param {string | null} [attributes.partner=null] - If a partner has send his link for the users to join on reflow
     * we append this here so we can count.
     * @param {string | null} [attributes.discountCouponName=null] - The discount coupon to use when the company is being onboarded.
     * @param {string} [attributes.userVisitorId=''] - The visitor id of the user that was created for him when visiting 
     * reflow.com.br. Created by `reflow_tracking` project.
     * @param {object} transaction - The transaction to use when onboarding the user.
     * 
     * @returns {Promise<User>} The user that was created on the onboarding process..
     */
    static async onboard({userEmail, userFirstName, userLastName, userPassword, userPhone, 
                         companyName=null, companyNumberOfEmployees=0, companySector='', 
                         sharedBy=null, partner=null, discountCouponName=null, userVisitorId=''}={}, transaction) {
        const companyService = new CompanyService()
        const company = await companyService.createCompany(companyName, companyNumberOfEmployees, companySector, 
            sharedBy, partner, transaction)
        const user = await UserService.createUserOnOnboarding(company.id, userEmail, userFirstName, userLastName, 
            userPassword, userPhone, transaction)

        events.emit('userOnboarding', {
            userId: user.id,
            companyId: company.id,
            visitorId: userVisitorId
        })
        // Added api acess for newly created user since he cannot edit itself
        // TODO: need to change this once the user can edit himself
        // UsersService.update_api_access_key_of_user(company.id, user.id, True)
        // update billing information
        // BillingService.create_on_onboarding(company.id, user.id, partner, discount_coupon_name)
        // updates formula context
        // FlowFormulaService.update_company_formula_context(company)
        return user
    }   
}

module.exports = OnboardingService