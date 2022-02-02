const { DraftType, Draft } = require('../models')
const { Bucket } = require('../../core/utils')

/**
 * 
 */
class DraftService {
    constructor(userId, workspaceId) {
        this.userId = userId
        this.workspaceId = workspaceId
        this.bucket = new Bucket()
    }
    
    async saveNewDraft({draftFile=undefined, draftValue=undefined, isPublicDraft=false}={}, transaction) {
        
    }
}

module.exports = DraftService