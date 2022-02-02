const serializers = require('../../../palmares/serializers')
const DraftService = require('./services')

/**
 * This serializer will recieve the file from the user and will save it to the draft storage.
 */
class DraftFileInputSerializer extends serializers.Serializer {
    fields = {
        uuid: new serializers.UUIDField(),
        name: new serializers.CharField(),
        size: new serializers.IntegerField(),
        currentChunkIndex: new serializers.IntegerField(),
        totalChunks: new serializers.IntegerField(),
    }
    
    async save(_, userId, workspaceId, file, transaction) {
        const draftService = new DraftService(userId, workspaceId)

        return await draftService.saveDraft({
            draftFile: file
        }, transaction)
    }
}

class DraftSaveFileOutputSerializer extends serializers.Serializer {
    fields = {
        draftStringId: new serializers.CharField()
    }
}

module.exports = {
    DraftFileInputSerializer,
    DraftSaveFileOutputSerializer
}