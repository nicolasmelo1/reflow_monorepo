const serializers = require('../../config/serializers')
const { Area, App, AvailableApp, AppConfiguration, MetadataForApp, MetadataType } = require('./models')


class AppRelation extends serializers.ModelSerializer {
    async toRepresentation(areaUUID) {
        const areaId = await Area.AREA.idByUUID(areaUUID)
        const data = await App.AREA.appsByAreaId(areaId)
        return await super.toRepresentation(data)
    }

    options = {
        model: App,
        fields: ['uuid', 'name', 'labelName', 'description', 'order']
    }
}

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