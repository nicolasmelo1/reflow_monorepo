const serializers = require('../../../palmares/serializers')
const { 
    Area, App, AvailableApp, AppConfiguration, 
    MetadataForApp, MetadataType 
} = require('./models')

/**
 * This relation is the selected app type. Since the user can name their app whatever they want, we need a way to know what app type
 * was selected. Is it a management app, a drawing app? an automation app? what it is?
 * 
 * That's the hole idea for this relation.
 */
class SelectedAppRelation extends serializers.ModelSerializer {
    async toRepresentation(availableAppId) {
        const data = await AvailableApp.AREA.availableAppByAvailableAppId(availableAppId)
        return await super.toRepresentation(data)
    }

    options = {
        model: AvailableApp,
        exclude: ['createdAt', 'updatedAt']
    }
}

/**
 * Relation for loading the data and information about the apps. This is used to load the sidebar of the app.
 */
 class AppRelation extends serializers.ModelSerializer {
    async toRepresentation(areaUUID) {
        const areaId = await Area.AREA.idByUUID(areaUUID)
        const appsOfArea = await App.AREA.appsByAreaId(areaId)
        const data = appsOfArea.map(app => ({
            areaUUID,
            ...app
        }))
        return await super.toRepresentation(data)
    }

    fields = {
        areaUUID: new serializers.CharField({ allowBlank: false, allowNull: false }),
        selectedApp: new SelectedAppRelation({ source: 'selectedAppId' }),
        appConfiguration: new AppConfigurationRelation({ source: '*', many: true }),
    }

    options = {
        model: App,
        exclude: ['createdAt', 'updatedAt', 'areaId', 'order', 'selectedAppId']
    }
}

/**
 * Sometimes some apps needs some configuration data in order to be rendered and built on the screen.
 * This is exactly what this does, retrieves the required data that the user set up for the app.
 * For builtins it will not be needed but for user created apps it will probably be needed to render stuff on 
 * the screen.
 */
class AppConfigurationRelation extends serializers.Serializer {
    fields = {
        configurationName: new serializers.CharField(),
        defaultValue: new serializers.CharField({ allowBlank: true, allowNull: true }),
        dataType: new serializers.CharField(),
        value: new serializers.CharField(),
    }

    async toRepresentation(appData) {
        const { id: appId, selectedAppId } = appData
        let data = []
        const valuesAndMetadataIds = await AppConfiguration.AREA.valuesAndMetadataIdsByAppId(appId)
        for (const { value, metadataId } of valuesAndMetadataIds) {
            const metadata = await MetadataForApp.AREA.metadataTypeIdDefaultValueAndNameByMetadataIdAndAvailableAppId(metadataId, selectedAppId)
            const metadataTypeName = await MetadataType.AREA.metadataNameById(metadata.metadataTypeId)

            data.push({
                configurationName: metadata.name,
                defaultValue: metadata.defaultValue,
                dataType: metadataTypeName,
                value
            })
        }
        return await super.toRepresentation(data)
    }
}

module.exports = {
    AppRelation,
    SelectedAppRelation,
    AppConfigurationRelation
}