const controllers = require('../../../palmares/controllers')
const status = require('../../../palmares/status')

const { App } = require('../area/models')
const { Formulary } = require('./models')
const { FormularyOutputSerializer, TypeOutputSerializer } = require('./serializers')

/**
 * This will hold all of the types for the formulary. The types will be the first thing that we retrieve in the front-end because
 * it will be needed in order to work.
 * 
 * We save this data on the front end so that we can, by the id, know what is the type of the field, the formatting
 * of numbers and so on.
 */
class TypeController extends controllers.Controller {
    outputSerializer = TypeOutputSerializer

    /**
     * This will retrieve the types of the app_management_formulary. This types will be used and needed to build and validate the formulary
     * data. With that we can use just the ids of the types and we will know each type of the fields.
     */
    async get(req, res) {
        const serializer = new this.outputSerializer()
        return res.status(status.HTTP_200_OK).json({
            status: 'ok',
            data: await serializer.toRepresentation()
        })
    }
}

/**
 * Controller for retrieving an existing formulary. This will be used to retrieve the formulary data that
 * we will use to render on the screen.
 */
class FormularyController extends controllers.Controller {
    outputSerializer = FormularyOutputSerializer

    /**
     * Retrieves a formulary to be rendered on the screen. This will retrieve a json with the formulary data,
     * each field from the formulary. As well as specific information about the fields like FieldNumber, the FieldDate 
     * and all of that stuff.
     */
    async get(req, res) {
        const appId = await App.APP_MANAGEMENT_FORMULARY.appIdByAppUUID(req.params.appUUID)
        const instance = await Formulary.APP_MANAGEMENT_FORMULARY.formularyByAppId(appId)
        const serializer = new this.outputSerializer({
            instance: instance,
        })
        return res.status(status.HTTP_200_OK).json({
            status: 'ok',
            data: await serializer.toRepresentation()
        })
    }
}

module.exports = {
    TypeController,
    FormularyController
}