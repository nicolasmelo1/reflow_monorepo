/** @module src/authentication/services/company */

const { settings } = require('../../../config/conf')

const { Company } = require('../models')
const { CompanyAnalyticsService } = require('../../analytics/services')
const Bucket = require('../../core/utils/storage')
const events = require('../../core/events')

const fs = require('fs')

/**
 * Service responsible for handling companies inside of reflow, like company creation or authentication.
 */
class CompanyService {
    /**
     * Creates a random companyName if the companyName is not specified
     * 
     * @returns {string} - The company name generated.
     */
    #companyNameGenerator() {
        const prefixOptions = [
            'Ice', 'Hot', 'Cold', 'Fire', 'Earth', 'Light', 'Air', 'Windy', 'Nightly', 
            'Dark', 'White', 'Brown', 'Orange', 'Pink', 'Red', 'Cyan', 'Grey', 'Beautiful',
            'Nice', 'Cool', 'Perfect', 'Kind', 'Cute', 'Long', 'Quick', 'Fast', 'Rapid'
        ]
        
        const suffixOptions = [
            'Fox', 'Hound', 'Dog', 'Cat', 'Chetah', 'Lion', 'Horse', 'Seagul', 'Pingeon', 'Turtle',
            'Fish', 'Caterpilar', 'Giraffe', 'Zebra', 'Rhino', 'Rabbit', 'Crocodile', 'Flamingo',
            'Sealion', 'Horsesea', 'Whale', 'Bee', 'Nest', 'Tiger', 'Peixe-Boi', 'Boto', 'Jacaré', 'Narwall'
        ]

        const prefix = prefixOptions[Math.floor(Math.random() * prefixOptions.length)]
        const suffix = suffixOptions[Math.floor(Math.random() * suffixOptions.length)]

        return `${prefix} ${suffix}`
    }

    /**
     * Recieves a companyName and creates an endpoint, endpoints must be url friendly and JSON notation friendly
     * and also needs to be unique for each company.
     * 
     * Reference: https://stackoverflow.com/a/37511463
     * 
     * @param {string} companyName - The company name to be used as the endpoint.
     * 
     * @returns {string} - The endpoint generated.
     */
    async #createEndpoint(companyName) {
        const endpoint = companyName.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+/g, '').toLowerCase()
        return await this.#checkIfEndpointExists(endpoint)
    }
    
    /**
     * The name says it all, it just checks if the endpoint exists already in a company then creates a random int if it exists
     * it just goes on and on on a loop until one is valid.
     * 
     * @param {string} endpoint - The endpoint to be checked.
     * 
     * @returns {string} - The endpoint validated that it does not exist.
     */
    async #checkIfEndpointExists(endpoint) {
        let existsCompanyWithEndpoint = true
        while (existsCompanyWithEndpoint) {
            existsCompanyWithEndpoint = await Company.AUTHENTICATION.existsCompanyByEndpoint(endpoint)
            if (existsCompanyWithEndpoint) endpoint = `${endpoint}${Math.floor(Math.random() * 1000)}`
        }
        return endpoint
    }

    /**
     * Creates a new company and returns the company created. We require the companyName,
     * the number of employees, the sector, the sharedBy id, the partner name if it has one and
     * the transaction.
     * 
     * @param {string} companyName - The name of the company
     * @param {number} companyNumberOfEmployees - The number of employees of the company
     * @param {string} companySector - The market sector of the company
     * @param {string} sharedBy - The company that shared this to what company
     * @param {string} partner - Has this company entered from a partner? Set the partner name.
     * @param {string} endpoint - The endpoint of the company
     * @param {object} transaction - The transaction to be used.
     * 
     * @returns {Promise<Company>} - Returns a promise that resolves to the created company
     */
    async createCompany(companyName, companyNumberOfEmployees, companySector, 
                        sharedBy, partner, transaction) {
        let sharedByCompanyId = null
        const companyIdByEndpoint = await Company.AUTHENTICATION.companyIdByEndpoint(sharedBy)
        if (companyIdByEndpoint !== null) sharedByCompanyId = companyIdByEndpoint.id

        const companyEndpoint = await this.#createEndpoint(companyName)
        if (companyName === undefined || companyName === null || companyName === '') {
            companyName = this.#companyNameGenerator()
        }

        const company = await Company.AUTHENTICATION.createCompany(
            companyName, sharedByCompanyId, partner, companyEndpoint, transaction
        )

        await CompanyAnalyticsService.createCompanyAnalytics(
            company.id, companyNumberOfEmployees, companySector, transaction
        )
        return company
    }

    /**
     * Updates the company based on a companyId. This just updates the name of the company and sets a image file for the logo.
     * 
     * @param {Object} attributes - Custom attributes to be used for updating the company.
     * @param {number} attributes.userId - The id of the user that is updating the company.
     * @param {number} attributes.companyId - The id of the company to be updated.
     * @param {string} attributes.name - The new name of the company.
     * @param {null | object} [attributes.companyLogo=null] - The multer multipart object of the file used to upload to s3. Defaults to null.
     * @param {object} transaction - The transaction to be used.
     */
    async updateCompany({userId, companyId, name, companyLogo=null} = {}, transaction) {
        const doesCompanyExist = await Company.AUTHENTICATION.existsCompanyById(companyId)
        if (doesCompanyExist) {
            let companyLogoUrl = null

            if (companyLogo !== null) {
                const file = fs.readFileSync(companyLogo.path)
                const keyPath = `${settings.S3_COMPANY_LOGO_PATH}/${companyId}/${companyLogo.originalname.replaceAll(' ', '_')}`
                const bucket = new Bucket()
                companyLogoUrl = await bucket.upload(file, keyPath, true)
            }
            
            await Company.AUTHENTICATION.updateCompany({
                companyId, 
                name: name,
                logoImageUrl: companyLogoUrl
            }, transaction)

            // sends the events to the clients
            events.emit('companyInformationUpdated', {
                userId,
                companyId
            })
        }
    }
}

module.exports = CompanyService