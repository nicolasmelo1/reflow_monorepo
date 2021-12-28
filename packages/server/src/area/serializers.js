const serializers = require('../../config/serializers')
const { AppRelation } = require('./relations')
const { Area } = require('./models')

/**
 * This serializer will be used on the sidebar to display all of the areas the user has access to and all of the apps
 * that the user is able to access inside of reflow application.
 */
class AreaOutputSerializer extends serializers.ModelSerializer {
    async toRepresentation(areaUUID) {
        if (areaUUID === undefined) {
            return await super.toRepresentation()
        } else {
            const areaId = await Area.AREA.idByUUID(areaUUID)
            const data = await Area.AREA.subAreasByAreaId(areaId)
            return await super.toRepresentation(data)
        }
    }

    fields = {
        subAreas: new serializers.LazyField({ field: AreaOutputSerializer, source: 'uuid', many: true }),
        apps: new AppRelation({ source: 'uuid', many: true }),
    }

    options = {
        model: Area,
        fields: ['uuid', 'name', 'labelName', 'description', 'order']
    }
}

module.exports = {
    AreaOutputSerializer
}