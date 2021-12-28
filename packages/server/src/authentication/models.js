/** @module src/authentication/models */

const { settings } = require('../../config/conf')
const { models } = require('../../config/database')
const AbstractUser = require('../../config/authentication/user')

const { 
    UserAuthenticationManager,
    WorkspaceAuthenticationManager,
    UserWorkspacesAuthenticationManager
} = require('./managers')

/**
 * This type is used to define the internationalization, everything will be tied to a specific location, for example: Brazil,
 * and then the language, how the user will be able to format the date and so on will be tied to that specific location/region.
 */
class LocationType extends models.Model {
    attributes = {
        name: new models.fields.CharField({maxLength: 200}),
        order: new models.fields.IntegerField({defaultValue: 1})
    }

    options = {
        tableName: 'location_type',
        ordering: ['order']
    }
}

/**
 * This model is a `type` so it contains required data used for this program to work. This model defines
 * a type of profile, each profile change what the user can see, and what a user has access to.
 * - If a user is an `simple_user`: he only have access on what he insert in the system, also, on the filters 
 * defined on `formulary.models.OptionAccessedBy` and `formulary.models.FormAccessedBy` that applies to him.
 * - If a user is an `coordinator`: He have access on what other users have inserted in the system, also, 
 * on the filters defined on `formulary.models.OptionAccessedBy` and `formulary.models.FormAccessedBy` that applies to him.
 * - If a user is an `admin`: he have access to some admin urls, and have access to most of the data, also, 
 * on the filters defined on `formulary.models.OptionAccessedBy` and `formulary.models.FormAccessedBy` that applies to him.
 */
class ProfileType extends models.Model {
    attributes = {
        name: new models.fields.CharField({maxLength: 200}),
        canEdit: new models.fields.BooleanField({defaultValue: false}),
        order: new models.fields.IntegerField({defaultValue: 1})
    }

    options = {
        tableName: 'profile_type',
        ordering: ['order']
    }
}

/**
 * This model is a `helper` so it contains data used that is used but is not required. Usually this
 * type of model offers an ammount of data but doesn't relate directly to any table in the database 
 * (They are not used as ForeignKeys).
 * 
 * It defines the address options for the user so we will have all of the cities from every state from 
 * every country we support.
 */
class AddressHelper extends models.Model {
    attributes = {
        locationType: new models.fields.ForeignKeyField({
            relatedTo: 'LocationType',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        countryCode: new models.fields.CharField({maxLength: 50}),
        countryName: new models.fields.CharField({maxLength: 200}),
        state: new models.fields.CharField({maxLength: 400}),
        stateCode: new models.fields.CharField({maxLength: 400}),
        city: new models.fields.CharField({maxLength: 400}),
        order: new models.fields.BigIntegerField({defaultValue: 1})
    }

    options = {
        tableName: 'address_helper',
        ordering: ['order']
    }
}

/**
 * This is the user model, as you can see it it inherits from AbstractUser. From preventing the users to do POOP stuff
 * we decided to create an abstract user in the framework itself that handles much stuff about the user like authentication,
 * password cryptography and many other stuff.
 * 
 * This model defines stuff we might want to have on a `user` level. We define stuff like company, profile, if the user is
 * an admin (this admin is the admin that can access the default django url /admin, not the profile admin) or not, and etc.
 */
class User extends models.Model {
    abstracts = [AbstractUser]

    attributes = {
        dateJoined: new models.fields.DatetimeField({ autoNowAdd: true, allowNull: true}),
        isSuperuser: new models.fields.BooleanField({ defaultValue: false }),
        firstName: new models.fields.TextField(),
        lastName: new models.fields.TextField(),
        email: new models.fields.TextField({ unique: true }),
        isStaff: new models.fields.BooleanField({ defaultValue: false }),
        tempPassword: new models.fields.CharField({maxLength: 250, defaultValue: null, allowNull: true, allowBlank: true})
    }
    
    options = {
        tableName: 'user'
    }

    static AUTHENTICATION = new UserAuthenticationManager()
} 

/**
 * A workspace is a space where work happens, it can be a personal workspace, a company workspace, a project workspace, a team workspace, whatever.
 * Before we had the user tied to a specific company and only one company, now the user can be tied to multiple workspaces and companies at the same time
 * and all of that access will be available to the user.
 */
class Workspace extends models.Model {
    attributes = {
        updatedAt: new models.fields.DatetimeField({autoNow: true, allowNull: true}),
        createdAt: new models.fields.DatetimeField({autoNowAdd: true, allowNull: true}),
        name: new models.fields.CharField({maxLength: 400, dbIndex: true}),
        endpoint: new models.fields.CharField({maxLength: 280, unique: true, dbIndex: true}),
        isActive: new models.fields.BooleanField({defaultValue: true, dbIndex: true}),
        uuid: new models.fields.UUIDField({ autoGenerate: true, allowNull: true, dbIndex: true }),
        sharedBy: new models.fields.ForeignKeyField({
            allowNull: true,
            relatedTo: 'Company',
            relatedName: 'sharedFromCompanies',
            onDelete: models.fields.ON_DELETE.SET_NULL
        }),
        partner: new models.fields.CharField({maxLength: 500, defaultValue: null, allowNull: true}),
        logoImageBucket: new models.fields.CharField({maxLength: 200, defaultValue: settings.S3_BUCKET}),
        logoImagePath: new models.fields.CharField({maxLength:250, defaultValue: settings.S3_COMPANY_LOGO_PATH}),
        logoImageUrl: new models.fields.CharField({maxLength: 1000, defaultValue: null, allowNull: true})
    }

    options = {
        tableName: 'workspace'
    }

    static AUTHENTICATION = new WorkspaceAuthenticationManager()
}

/**
 * Every user is tied to one or more workspace, a workspace can be a company, can be a project, can be a team. Whatever. The idea is that
 * when we tie the user to a workspace than we can define all of the related data of this user inside of the workspace. For example, we can define
 * exactly what is the profile of the user in this workspace, if he's active or not, when he has joined and all of that stuff.
 */
class UserWorkspaces extends models.Model {
    attributes = {
        user: new models.fields.ForeignKeyField({
            relatedTo: 'User',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        workspace: new models.fields.ForeignKeyField({
            relatedTo: 'Workspace',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        profileType: new models.fields.ForeignKeyField({
            relatedTo: 'ProfileType',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        dateJoined: new models.fields.DatetimeField({ autoNowAdd: true, allowNull: true}),
        isActive: new models.fields.BooleanField({ defaultValue: true })
    }

    options = {
        tableName: 'user_workspaces',
    }

    static AUTHENTICATION = new UserWorkspacesAuthenticationManager()
}


module.exports = {
    LocationType,
    ProfileType,
    AddressHelper,
    User,
    Workspace,
    UserWorkspaces
}