const { models } = require('../../../../palmares/database')

const { AppAppManagamentFormularyManager } = require('../../app_management_formulary/managers')
const { 
    AreaAreaManager, AppAreaManager, AvailableAppAreaManager,
    AppConfigurationAreaManager, MetadataForAppAreaManager,
    MetadataTypeAreaManager
} = require('../managers')

/**
 * This is the required metadata for each app in order to work, each app might need the user to configure something
 * before continuing and using the app. So for that we create a metadata so we are able to add metadata to an app without
 * having to add each data the app might need by hand. Also, we don't like the idea of storing json directly since the format 
 * and how data is stored change over time, we see that storing it in a table and in a tabular format will be better to maintain
 * in the long tun.
 */
class MetadataType extends models.Model {
    attributes = {
        name: new models.fields.TextField(),
        order: new models.fields.IntegerField(),
    }

    options = {
        tableName: 'metadata_type',
        ordering: ['order']
    }

    static AREA = new MetadataTypeAreaManager()
}

/**
 * This is an area, an area is where you organize the apps inside of reflow. Understand an Area as a group of apps.
 * For example: The area can be "Sales", or a project like "User Research", or whatever. The user can organize all 
 * of the areas as he wants inside of reflow. An area can also contain other areas inside of it.
 * 
 * The name of each area is unique, so you can not have multiple areas with the same name. Even for sub areas, sub areas
 * cannot have the same name as other areas and other areas cannot have the same name as sub areas.
 * 
 * The order of the areas is important, the order of the areas is the order in which they will be displayed in the
 * sidebar for the user.
 */
class Area extends models.Model {
    attributes = {
        createdAt: new models.fields.DatetimeField({autoNowAdd: true }),
        updatedAt: new models.fields.DatetimeField({autoNow: true }),
        uuid: new models.fields.UUIDField({ autoGenerate: true }),
        name: new models.fields.CharField({ maxLength: 255 }),
        labelName: new models.fields.TextField(),
        description: new models.fields.TextField({ allowBlank: true, allowNull: true, defaultValue: null }),
        order: new models.fields.IntegerField(),
        color: new models.fields.TextField({ allowBlank: true, allowNull: true, defaultValue: null }),
        workspace: new models.fields.ForeignKeyField({
            relatedTo: 'Workspace',
            onDelete: models.fields.ON_DELETE.CASCADE,
        }),
        subAreaOf: new models.fields.ForeignKeyField({
            relatedTo: 'Area',
            relatedName: 'subAreas',
            onDelete: models.fields.ON_DELETE.CASCADE,
            allowNull: true
        })
    }

    options = {
        tableName: 'area',
        ordering: ['order']
    }

    static AREA = new AreaAreaManager()
}

/**
 * In reflow, everything is an APP. I mean, EVERYTHING. The idea has changed and had been growing since reflow 1.0.
 * But now with the reflow 2.0 we have added this idea. This means that formularies, automation, chat, or whatever.
 * 
 * With this we make reflow extremely flexible for growing, whatever users come up with they can use it in reflow. 
 * It is similar to a browser, on a browser you can have many tabs open, each tab is something inside of reflow.
 * On here the idea is basically the same. On the new reflow every App is a tab inside of reflow, so we can have,
 * for example, embed whatsapp inside of reflow so users can use reflow without leaving platform. 
 * 
 * Yes, people would enjoy to embed stuff without needing to switch places.
 */
class App extends models.Model {
    attributes = {
        createdAt: new models.fields.DatetimeField({autoNowAdd: true }),
        updatedAt: new models.fields.DatetimeField({autoNow: true }),
        uuid: new models.fields.UUIDField({ autoGenerate: true }),
        name: new models.fields.CharField({ maxLength: 255 }),
        labelName: new models.fields.TextField(),
        description: new models.fields.TextField({ allowBlank: true, allowNull: true }),
        area: new models.fields.ForeignKeyField({
            relatedTo: 'Area',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        selectedApp: new models.fields.ForeignKeyField({
            relatedTo: 'AvailableApp',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        order: new models.fields.IntegerField(),
    }

    options = {
        tableName: 'app',
        ordering: ['order']
    }

    static AREA = new AppAreaManager()
    static APP_MANAGEMENT_FORMULARY = new AppAppManagamentFormularyManager()
}

/**
 * This is the data that we need for configuring the app. Sometimes when we select an app we need to also setup some stuff like
 * login for another service, some specific id. And so on. This data is the one needed to setup the app.
 */
class AppConfiguration extends models.Model {
    attributes = {
        app: new models.fields.ForeignKeyField({
            relatedTo: 'App',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),        
        metadata: new models.fields.ForeignKeyField({
            relatedTo: 'MetadataForApp',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        value: new models.fields.TextField()
    }

    options = {
        tableName: 'app_configuration'
    }

    static AREA = new AppConfigurationAreaManager()
}

/**
 * This is used to relate between apps. So one app will be related to another. For example, if you have two apps,
 * and they both are a management app and one of them has a `connection` field type. This means that the first app
 * one of them is connected to the other. 
 * 
 * The idea of that is that later we can display this information for the user so he can know and understand which
 * process/app is dependant/connected to which other app. So the user can view their apps as processes interconnected to
 * one another.
 * 
 * This will be defined and done automatically, the user will not be able to change, alter or delete this information,
 * reflow will handle all of those connections automatically for him. So if for example the user removes the `connection`
 * field type. Then these apps are not connected anymore and the user will know that those apps are not connected to each
 * other anymore.
 */
class AppRelatedTo extends models.Model {
    attributes = {
        app: new models.fields.ForeignKeyField({
            relatedTo: 'App',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        relatedTo: new models.fields.ForeignKeyField({
            relatedTo: 'App',
            onDelete: models.fields.ON_DELETE.CASCADE
        })
    }

    options = {
        tableName: 'app_related_to'
    }
}

/**
 * This is the actual app the user can select to open. If the user selects an app then we will create their stuff on this app.
 * For example, we can have a managament app that users will use to manage their activities, school, projects and so on.
 * We can have also a drawing app, similar to figma so he can draw stuff. We can have a chat app, so he can chat with other users inside of reflow 
 * and so on.
 * Every app that the user has is based on one of those apps, here we will define if the user needs to set some required data for configuring the app.
 */
class AvailableApp extends models.Model {
    attributes = {
        createdAt: new models.fields.DatetimeField({autoNowAdd: true }),
        updatedAt: new models.fields.DatetimeField({autoNow: true }),
        uuid: new models.fields.UUIDField({ autoGenerate: true }),
        name: new models.fields.TextField(),
        labelName: new models.fields.TextField({ allowNull: true }),
        description: new models.fields.TextField({ allowBlank: true, allowNull: true }),
        isBuiltin: new models.fields.BooleanField({ defaultValue: false })
    }
     
    options = {
        tableName: 'available_app'
    }

    static AREA = new AvailableAppAreaManager()
}

class MetadataForApp extends models.Model {
    attributes = {
        metadataType: new models.fields.ForeignKeyField({
            relatedTo: 'MetadataType',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        name: new models.fields.TextField(),
        isRequired: new models.fields.BooleanField({ defaultValue: false }),
        defaultValue: new models.fields.TextField({ allowBlank: true, allowNull: true }),
        availableApp: new models.fields.ForeignKeyField({
            relatedTo: 'AvailableApp',
            onDelete: models.fields.ON_DELETE.CASCADE,
            allowNull: true
        })
    }

    options = {
        tableName: 'metadata_for_app'
    }

    static AREA = new MetadataForAppAreaManager()
}

module.exports = {
    MetadataType,
    Area,
    App,
    AppConfiguration,
    AppRelatedTo,
    AvailableApp,
    MetadataForApp
}