const serializers = require('../../config/serializers')
const { Area, App } = require('./models')

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

module.exports = {
    AppRelation
}