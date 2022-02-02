const serializers = require('../../../palmares/serializers')
const DraftService = require('./services')

/**
 * This serializer will recieve the file from the user and will save it to the draft storage.
 */
class DraftFileInputSerializer extends serializers.Serializer {
    async save(_, userId, workspaceId, file, transaction) {
        const draftService = new DraftService(userId, workspaceId)

        return await draftService.saveNewDraft({
            draftFile: file
        }, transaction)
    }
}

module.exports = {
    DraftFileInputSerializer
}