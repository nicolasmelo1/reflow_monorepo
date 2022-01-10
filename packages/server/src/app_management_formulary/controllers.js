const controllers = require("../../config/controllers")
const status = require("../../config/status")

const { TypeOutputSerializer } = require('./serializers')

/**
 * This will hold all of the types for the formulary. The types will be the first thing that we retrieve in the front-end because
 * it will be needed in order to work.
 * 
 * We save this data on the front end so that we can, by the id, know what is the type of the field, the type of the section, the formatting
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

class FormularyController extends controllers.Controller {
    outputSerializer = FormularyOutputSerializer

    async get(req, res) {
    }
}

module.exports = {
    TypeController
}