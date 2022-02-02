const controllers = require('../../../palmares/controllers')
const status = require('../../../palmares/status')

const { reflowJSONError } = require('../core/services')
const { DraftFileInputSerializer } = require('./serializers')

/**
 * This controller is responsible for saving a file to the draft storage. This file is temporary and will be removed after a certain time.
 */
class DraftSaveFileController extends controllers.Controller {
    inputSerializer = DraftFileInputSerializer
    
    /**
     * Will upload and store the file in the draft storage so when we save the data we can retrieve the data from the storage
     * and just copy to the final storage. This copy will happen MUCH faster than it would be done if it was made directly from the user.
     * Because we use our cloud network to copy files from one place to another.
     * 
     * @param {import('express').Request} req - Express's request object.
     * @param {import('express').Response} res - Express's response object.
     * @param {import('express').NextFunction} next - Express's next function.
     * @param {object} transaction - The transaction object recived from the sequelize ORM to use in the controller lifecycle.
     */
    async post(req, res, next, transaction) {
        const files = req.files
        if (files && files.length > 0) {
            const file = files[0]
            const serializer = new this.inputSerializer()
            if (await serializer.isValid()) {
                const draftStringId = await serializer.toSave(req.user.id, req.workspace.id, file, transaction)
                return res.status(status.HTTP_201_CREATED).json({
                    status: 'ok'
                })
            }
        } 

        return res.status(status.HTTP_406_NOT_ACCEPTABLE).json({
            status: 'error',
            error: reflowJSONError({
                reason: 'invalid_file',
                detail: 'For some reason the file was not uploaded or we have mismatch data' +
                        ' (workspaceUUID or user does not exist anymore), so try to upload it again.'
            })

        })
    }
}

module.exports = {
    DraftSaveFileController
}