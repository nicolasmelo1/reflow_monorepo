const controllers = require('../../../palmares/controllers')
const status = require('../../../palmares/status')

const { Area, App } = require('./models')
const { AreaOutputSerializer, AreaInputSerializer, AppOutputSerializer } = require('./serializers')
const { reflowJSONError } = require('../core/services')
const { AreaService } = require('./services')

/**
 * Controller responsible for retrieving the areas. Areas is what is loaded in the sidebar of the application.
 * In the front-end/client this is also known as the "workspace".
 */
class AreaController extends controllers.Controller {
    outputSerializer = AreaOutputSerializer
    inputSerializer = AreaInputSerializer
    
    /**
     * This will load all of the areas the user has access to. Areas is the menus of the apps. It will load
     * on the sidebar of the app.
     */
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

    /**
     * This will create a new area inside of our database. When we create a new area we do not create the apps inside of this area.
     * The apps inside of this area CAN be created after the area is created.
     */
    async post(req, res, next, transaction) {
        const serializer = new this.inputSerializer({
            data: req.body,
            context: {
                language: req.preferredLanguage
            }
        })
        if (await serializer.isValid(req.workspace.id, req.user.id)) {
            await serializer.toSave(transaction)
            return res.status(status.HTTP_201_CREATED).json({
                status: 'ok'
            })
        } else {
            const error = serializer.error()
            return res.status(status.HTTP_400_BAD_REQUEST).json({
                status: 'error',
                error: reflowJSONError({
                    reason: error.errorKey ? error.errorKey : error.reason,
                    detail: error.detail ? error.detail : error.reason,
                    metadata: error.fieldName ? { fieldName: error.fieldName } : {}
                })
            })
        }
    }
}

/**
 * Controller responsible for editing an existing area inside of an workspace.
 */
class AreaEditController extends controllers.Controller {
    inputSerializer = AreaInputSerializer

    /**
     * This will update an existing area with some new data.
     */
    async put(req, res, next, transaction) {
        const serializer = new this.inputSerializer({
            data: req.body,
            context: {
                language: req.preferredLanguage
            }
        })
        if (await serializer.isValid(req.workspace.id, req.user.id, req.params.areaUUID)) {
            await serializer.toSave(transaction)
            return res.status(status.HTTP_200_OK).json({
                status: 'ok'
            })
        } else {
            const error = serializer.error()
            return res.status(status.HTTP_400_BAD_REQUEST).json({
                status: 'error',
                error: reflowJSONError({
                    reason: error.errorKey ? error.errorKey : error.reason,
                    detail: error.detail ? error.detail : error.reason,
                    metadata: error.fieldName ? { fieldName: error.fieldName } : {}
                })
            })
        }
    }

    /**
     * This will remove a single area from our database. Be aware if the area has sub areas it will also remove them.
     */
    async delete(req, res, next, transaction) {
        const areaService = new AreaService(req.workspace.id, req.user.id)
        await areaService.removeArea(req.params.areaUUID, transaction)
        return res.status(status.HTTP_200_OK).json({
            status: 'ok'
        })
    }
}

/**
 * Controller responsible for loading the data of the app. This will load the name of the app defined by the user as well as the app that has been selected
 * to use. For example, we can have an app for managament, an app for drawing and so on. But altough we have different app types they all can be named differently
 * by the user for his organization. So we need this app type in order to know what to render.
 */
class AppController extends controllers.Controller {
    outputSerializer = AppOutputSerializer
    
    async get(req, res) {
        const areaId = await Area.AREA.idByUUID(req.params.areaUUID)
        const instance = await App.AREA.appByAreaIdAndAppUUID(areaId, req.params.appUUID)
        const serializer = new this.outputSerializer({
            instance: instance
        })
        return res.status(status.HTTP_200_OK).json({
            status: 'ok',
            data: await serializer.toRepresentation()
        })
    }
}

module.exports = {
    AreaController,
    AppController,
    AreaEditController
}