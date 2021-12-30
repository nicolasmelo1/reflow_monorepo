const controllers = require('../../config/controllers')
const status = require('../../config/status')

const { Area } = require('./models')
const { AreaOutputSerializer, AreaInputSerializer } = require('./serializers')

/**
 * Controller responsible for retrieving the areas. Areas is what is loaded in the sidebar of the application.
 * In the front-end/client this is also known as the "workspace".
 */
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


class AreaEditController extends controllers.Controller {
    inputSerializer = AreaInputSerializer

}

module.exports = {
    AreaController
}