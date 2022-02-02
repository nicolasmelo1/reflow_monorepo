const { settings } = require('../../../palmares/conf')
const { models } = require('../../../palmares/database')

const {
    DraftTypeDraftManager,
    DraftDraftManager
} = require('./managers')

/**
 * As explaied in `Draft` model there are two types of drafts in the system:
 * - file: This is a file that is uploaded by the user.
 * - value: A simple string that is stored in the database.
 */
class DraftType extends models.Model {
    attributes = {
        name: new models.fields.CharField({ maxLength: 255 }),
        order: new models.fields.IntegerField({defaultValue: 1})
    }

    options = {
        tableName: 'draft_type',
        ordering: ['order']
    }

    static DRAFT = new DraftTypeDraftManager()
}

/**
 * What is a draft?
 * 
 * To put it in simple words a draft is something that is temporary. In our system sometimes we want to save files
 * just after saving, but we don't want to store them forever, we just want to upload it after saving for performance
 * reasons. That is exactly the case here.
 * 
 * An easy example is when handling files:
 * - The user added a new file to an attachments field while editing a formulary. When the user attach a new file we
 * have 2 options: option 1 is to upload this file ONLY when the user hits save. The option 2 is to upload this file exactly
 * on the moment he attach a new file.
 * 
 * On option one you will not be able to edit the formulary while the upload is happening, and the upload will take too long if
 * you have lots of files, on option 2, when you hit save the attachment will already be uploaded.
 * 
 * Another example is on rich texts, where the user can upload a new image while he is writting. If he is writting a really long text
 * with lot's of images, those images will take too much time to be uploaded, on the other hand if they are uploaded in the exact moment
 * they are attached when you hit save it will be a lot less costly.
 * 
 * Another non trivial example, but could be a use case for this kind of funcionality: prevent users from doing poop.
 * What we mean is that, we can create an history or even fallback funcionality. When the users click save while editing a formulary
 * we display to them the a message if they want to fallback to how the data was before saving. If he hit this button we undo his changes
 * otherwise we keep this changes.
 * 
 * As you can see, there is a lot of room for use cases for temporary data in our platform. Right now we support two:
 * - Files - As the name suggests they are exactly that: files. They are files we store in our storage provider.
 * - values - They are strings that are not saved elsewhere, they are saved in our database directly. For Json, and other types
 * of values that can be strigfied you might prefer this over files.
 * 
 * I don't know if you understand but those files and values are deleted from our database after some time, they are just temporary and exists
 * between a certain timeframe.
 */
class Draft extends models.Model {
    attributes = {
        updatedAt: new models.fields.DatetimeField({autoNow: true, allowNull: true}),
        createdAt: new models.fields.DatetimeField({autoNowAdd: true, allowNull: true}),
        uuid: new models.fields.UUIDField({ autoGenerate: true }),
        isPublic: new models.fields.BooleanField({defaultValue: false}),
        draftType: new models.fields.ForeignKeyField({
            relatedTo: 'DraftType',
            onDelete: models.fields.ON_DELETE.CASCADE,
            dbIndex: true
        }),
        bucket: new models.fields.CharField({
            maxLength: 255, 
            defaultValue: settings.S3_BUCKET,
            allowNull: true,
            allowBlank: true
        }),

        fileDraftPath: new models.fields.CharField({
            maxLength: 255,
            allowNull: true,
            allowBlank: true,
            defaultValue: settings.S3_FILE_DRAFT_PATH,
        }),
        fileUrl: new models.fields.TextField({ allowNull: true, allowBlank: true }),
        fileSize: new models.fields.BigIntegerField({ defaultValue: null, allowNull: true }),
        value: new models.fields.TextField(),
        workspace: new models.fields.ForeignKeyField({
            relatedTo: 'Workspace',
            onDelete: models.fields.ON_DELETE.CASCADE,
            dbIndex: true
        }),
        user: new models.fields.ForeignKeyField({
            relatedTo: 'User',
            onDelete: models.fields.ON_DELETE.CASCADE,
            dbIndex: true
        })
    }

    options = {
        tableName: 'draft'
    }

    static DRAFT = new DraftDraftManager()
}

module.exports = {
    DraftType,
    Draft
}