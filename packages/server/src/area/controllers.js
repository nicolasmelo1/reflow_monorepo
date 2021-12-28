const controllers = require('../../config/controllers')
const status = require('../../config/status')

const { Area } = require('./models')
const { AreaOutputSerializer } = require('./serializers')


class AreaController extends controllers.Controller {
    outputSerializer = AreaOutputSerializer

    async get(req, res) {
        const instances = await Area.AREA.areasByWorkspaceIdWithoutSubArea(req.workspace.id)
        const serializer = new this.outputSerializer({
            instance: instances,
            many: true
        })
        return res.status(status.HTTP_200_OK).json({
            status: 'ok',
            data: await serializer.toRepresentation()
        })
    }
}

module.exports = {
    AreaController
}