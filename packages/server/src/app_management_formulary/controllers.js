const controllers = require("../../config/controllers")
const status = require("../../config/status")

const { TypeOutputSerializer } = require('./serializers')


class TypeController extends controllers.Controller {
    outputSerializer = TypeOutputSerializer

    async get(req, res) {
        const serializer = new this.outputSerializer()
        return res.status(status.HTTP_200_OK).json({
            status: 'ok'
        })
    }
}

module.exports = {
    TypeController
}