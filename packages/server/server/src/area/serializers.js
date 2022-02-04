const serializers = require('../../../palmares/serializers')

const { strings } = require('../core/utils')

const { ReflowValidationError } = require('../core/serializers')
const { AppRelation, SelectedAppRelation, AppConfigurationRelation } = require('./relations')
const { Area, App } = require('./models')
const { AreaService } = require('./services')
/**
 * This serializer will be used on the sidebar to display all of the areas the user has access to and all of the apps
 * that the user is able to access inside of reflow application.
 */
class AreaOutputSerializer extends serializers.ModelSerializer {
    async toRepresentation(areaUUID) {
        /**
         * The subAreaOfId is the id of the area that this area is a sub area of. But on the front-end we will not work with id's directly we will use the uuids. For that what we
         * do is get the id of the area that this area is a sub area of and then we get the uuid of that area. This means, suppose `Sub Pasta` is a sub area of `vendas`, with res-
         * pectively ids: 1 and 2. This means `Sub Pasta`'s subAreaOfId is 2. So what we do is get this `2` and then get the uuid of this id.
         * 
         * Be aware we update the objects here by reference. This means we do not return anything, but since that when you pass `area` you are passing the memory address of 
         * this object. When we update this object here we will also be updating the original object.
         * Reference: https://i.stack.imgur.com/mzMfb.gif
         * 
         * @param {Area} area - The area that we are going to update.
         */
        async function addSubAreaOfUUID(area) {
            let subAreaOfUUID = null
            if (![undefined, null].includes(area.subAreaOfId) && typeof area.subAreaOfId === 'number') {
                subAreaOfUUID = await Area.AREA.uuidById(subAreaId)
            }
            area.subAreaOfUUID = subAreaOfUUID
        }

        if (areaUUID === undefined) {
            // if the `many` is defined this means we will always work with an array, otherwise this means it's probably a single and simple object.
            if (this.many === true && this.instance.length > 0) {
                for (const area of this.instance) {
                    await addSubAreaOfUUID(area)
                }
            } else if (this.many === false) {
                await addSubAreaOfUUID(this.instance)
            }
            return await super.toRepresentation(this.instance)
        } else {
            const areaId = await Area.AREA.idByUUID(areaUUID)
            const data = await Area.AREA.subAreasByAreaId(areaId)
            if (Array.isArray(data)) {
                for (const area of data) {
                    area.subAreaOfUUID = areaUUID
                }
            } else {
                data.subAreaOfUUID = areaUUID
            }
            return await super.toRepresentation(data)
        }
    }

    fields = {
        subAreaOfUUID: new serializers.CharField({ allowBlank: true, maxLength:36, allowNull: true }),
        subAreas: new serializers.LazyField({ field: AreaOutputSerializer, source: 'uuid', many: true }),
        apps: new AppRelation({ source: 'uuid', many: true }),
    }

    options = {
        model: Area,
        fields: ['uuid', 'labelName', 'description', 'color', 'order']
    }
}

/**
 * Used for creating or updating the areas inside of reflow. All of the areas of a given workspace MUST have unique
 * names. This will enable us to differentiate between apps inside of reflow, enable formulas/automations/api and all
 * of that stuff.
 */
class AreaInputSerializer extends serializers.ModelSerializer {
    fields = {
        subAreaOfUUID: new serializers.UUIDField({ allowBlank: true, allowNull: true }),
    }

    async validate(data, workspaceId, userId, uuid=null) {
        this.uuid = uuid
        this.areaService = new AreaService(workspaceId, userId)
        const isLabelNameUnique = await this.areaService.isLabelNameUnique(
            data.labelName, uuid
        )
        if (!isLabelNameUnique) {
            throw new ReflowValidationError({
                reason: 'area_name_exists',
                detail: strings(this.context.language, 'areaNameExistsError'),
                metadata: {
                    uuid: data.uuid,
                    labelName: data.labelName
                }
            })
        }
    }

    async save(data, transaction) {
        await this.areaService.createOrUpdate({ 
            uuid: data.uuid,
            labelName: data.labelName,
            description: data.description,
            color: data.color,
            order: data.order,
            subAreaOfUUID: data.subAreaOfUUID
        }, transaction)
    }

    options = {
        model: Area,
        fields: ['uuid', 'labelName', 'description', 'color', 'order', 'subAreaOfUUID']
    }
}


class AppOutputSerializer extends serializers.ModelSerializer {
    fields = {
        selectedApp: new SelectedAppRelation({ source: 'selectedAppId' }),
        appConfiguration: new AppConfigurationRelation({ source: '*', many: true }),
    }

    options = {
        model: App,
        exclude: ['createdAt', 'updatedAt', 'areaId', 'order', 'selectedAppId']
    }
}


module.exports = {
    AreaOutputSerializer,
    AreaInputSerializer,
    AppOutputSerializer
}