const path = require('path')

const ENV = ![null, undefined, ''].includes(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development'
const DEBUG = true
const PORT = 4000
const SECRET_KEY = 'teste'
const APP_NAME = 'reflow_server'

const BASE_PATH = path.dirname(path.resolve(__dirname))

const ROOT_URLCONF = BASE_PATH + '/src/routes'

const INSTALLED_APPS = [
    path.join('src', 'core'),
    path.join('src', 'authentication'),
    path.join('src', 'area'),
    path.join('src', 'app_management_formulary'),
    path.join('src', 'draft')
]

const WEBSOCKETS = {
    ROOT_URLCONF: BASE_PATH + '/src/routing',
    LAYER: {
        BACKEND: 'inMemory',
    }
}

const MIDDLEWARE = [
    require('./core/middlewares').corsMiddleware(),
    require('compression')(),
    require('express').json(),
    require('express').urlencoded({extended: false}),
    require('./core/middlewares').snakeToCamelCaseQueryParams(),
    require('./core/middlewares').retrieveUsersPreferredLanguage(),
    require('helmet')(),
    require('./core/middlewares').poweredByReflowMiddleware(),
]

const DATABASE = {   
    engine: 'postgres',
    databaseName: 'postgres',
    username: 'postgres', 
    password: '',
    host: 'localhost',
    port: 5435,
    extraOptions: {
        logging: false,
        query: { 
            raw: true
        }
    }
}


// Reflow configurations, configurations specific for Reflow project

// CUSTOM EVENTS CONFIGURATION
// check src/core/events file for reference
const EVENTS = {
    /*userStartedOnboarding: {
        dataParameters: ['visitorId'],
        consumers: [require('./analytics/events').AnalyticsEvents]
    },
    userOnboarding: {
        dataParameters: ['userId', 'companyId', 'visitorId'],
        consumers: ['src/analytics/events/AnalyticsEvents']
    },
    userLogin: {
        dataParameters: ['userId', 'companyId'],
        consumers: [require('./analytics/events').AnalyticsEvents]
    },
    userRefreshToken: {
        dataParameters: ['userId', 'companyId'],
        consumers: ['src/analytics/events/AnalyticsEvents']
    },
    userCreated: {
        dataParameters: ['userId', 'companyId'],
        consumers: ['src/analytics/events/AnalyticsEvents']
    },
    userUpdated: {
        dataParameters: ['userId', 'companyId'],
        consumers: ['src/analytics/events/AnalyticsEvents', 'src/authentication/events/AuthenticationBroadcastEvent']
    },/*
    formularyDataCreated: {
        dataParameters: ['userId', 'companyId', 'formId', 'formDataId', 'isPublic', 'data'],
        consumers: [require('./analytics/events').AnalyticsEvents, require('./data/events').DataBroadcastEvent, require('./automation/events').AutomationEvent]
    },
    formularyDataUpdated: {
        dataParameters: ['userId', 'companyId', 'formId', 'formDataId', 'isPublic', 'data'],
        consumers: [require('./analytics/events').AnalyticsEvents, require('./data/events').DataBroadcastEvent, require('./automation/events').AutomationEvent]
    },
    formularyCreated: {
        dataParameters: ['userId', 'companyId', 'formId'],
        consumers: [require('./analytics/events').AnalyticsEvents, require('./formulary/events').FormularyBroadcastEvent]
    },
    formularyUpdated: {
        dataParameters: ['userId', 'companyId', 'formId'],
        consumers: [require('./analytics/events').AnalyticsEvents, require('./formulary/events').FormularyBroadcastEvent]
    },
    fieldCreated: {
        dataParameters: ['userId', 'companyId', 'formId', 'sectionId', 'fieldId'],
        consumers: [require('./analytics/events').AnalyticsEvents, require('./formulary/events').FormularyBroadcastEvent]
    },
    fieldUpdated: {
        dataParameters: ['userId', 'companyId', 'formId', 'sectionId', 'fieldId'],
        consumers: [require('./analytics/events').AnalyticsEvents, require('./formulary/events').FormularyBroadcastEvent]
    },
    newPayingCompany: {
        dataParameters: ['userId', 'companyId', 'totalPayingValue'],
        consumers: [require('./analytics/events').AnalyticsEvents, require('./billing/events').BillingBroadcastEvent]
    },
    updatedBillingInformation: {
        dataParameters: ['userId', 'companyId', 'totalPayingValue'],
        consumers: [require('./analytics/events').AnalyticsEvents, require('./billing/events').BillingBroadcastEvent]
    },
    companyInformationUpdated: {
        dataParameters: ['userId', 'companyId'],
        consumers: ['src/analytics/events/AnalyticsEvents', 'src/authentication/events/AuthenticationBroadcastEvent']
    },
    removedOldDraft: {
        dataParameters: ['userId', 'companyId', 'draftId', 'draftIsPublic'],
        consumers: [require('./analytics/events').AnalyticsEvents, require('./draft/events').DraftBroadcastEvent]
    },
    themeSelect: {
        dataParameters: ['userId', 'companyId', 'themeId'],
        consumers: [require('./analytics/events').AnalyticsEvents]
    },
    themeEyeballing: {
        dataParameters: ['userId', 'themeId'],
        consumers: [require('./analytics/events').AnalyticsEvents]
    },
    pdfTemplateDownloaded: {
        dataParameters: ['userId', 'companyId', 'formId', 'pdfTemplateId'],
        consumers: [require('./analytics/events').AnalyticsEvents]
    },
    pdfTemplateCreated: {
        dataParameters: ['userId', 'companyId', 'formId', 'pdfTemplateId'],
        consumers: [require('./analytics/events').AnalyticsEvents]
    },
    pdfTemplateUpdated: {
        dataParameters: ['userId', 'companyId', 'formId', 'pdfTemplateId'],
        consumers: [require('./analytics/events').AnalyticsEvents]
    },
    kanbanDefaultSettingsCreated: {
        dataParameters: ['userId', 'companyId', 'formId', 'kanbanCardId', 'kanbanDimensionId'],
        consumers: [require('./analytics/events').AnalyticsEvents]
    },
    kanbanDefaultSettingsUpdated: {
        dataParameters: ['userId', 'companyId', 'formId', 'kanbanCardId', 'kanbanDimensionId'],
        consumers: [require('./analytics/events').AnalyticsEvents]
    },
    kanbanLoaded: {
        dataParameters: ['userId', 'companyId', 'formId'],
        consumers: [require('./analytics/events').AnalyticsEvents]
    },
    listingLoaded: {
        dataParameters: ['userId', 'companyId', 'formId'],
        consumers: [require('./analytics/events').AnalyticsEvents]
    },
    dashboardLoaded: {
        dataParameters: ['userId', 'companyId', 'formId'],
        consumers: [require('./analytics/events').AnalyticsEvents]
    },
    dashboardChartCreated: {
        dataParameters: ['userId', 'companyId', 'formId', 'dashboardChartId'],
        consumers: [require('./analytics/events').AnalyticsEvents]
    },
    dashboardChartUpdated: {
        dataParameters: ['userId', 'companyId', 'formId', 'dashboardChartId'],
        consumers: [require('./analytics/events').AnalyticsEvents]
    },
    notificationLoaded: {
        dataParameters: ['userId', 'companyId'],
        consumers: [require('./analytics/events').AnalyticsEvents]
    },
    notificationConfigurationCreated: {
        dataParameters: ['userId', 'companyId', 'formId', 'notificationConfigurationId'],
        consumers: [require('./analytics/events').AnalyticsEvents]
    },
    notificationConfigurationUpdated: {
        dataParameters: ['userId', 'companyId', 'formId', 'notificationConfigurationId'],
        consumers: [require('./analytics/events').AnalyticsEvents]
    }*/
}

// CUSTOM PERMISSIONS CONFIGURATION
// check src/core/permissions file for reference
const PERMISSIONS = {
    DEFAULT: [
        'src/authentication/permissions/AuthenticationDefaultPermission'/*
        'reflow_server.authentication.permissions.AuthenticationDefaultPermission',
        'reflow_server.data.permissions.DataDefaultPermission',
        'reflow_server.kanban.permissions.KanbanDefaultPermission',
        'reflow_server.dashboard.permissions.DashboardDefaultPermission',
        'reflow_server.formulary.permissions.FormularyDefaultPermission',
        'reflow_server.notification.permissions.NotificationDefaultPermission',
        'reflow_server.theme.permissions.ThemeDefaultPermission'*/
    ],
    PUBLIC: [
        /*'reflow_server.formulary.permissions.FormularyPublicPermission',
        'reflow_server.authentication.permissions.AuthenticationPublicPermission',*/
    ],
    BILLING: [
        /*'reflow_server.billing.permissions.BillingBillingPermission',
        'reflow_server.draft.permissions.DraftBillingPermission',
        'reflow_server.dashboard.permissions.ChartsBillingPermission',
        'reflow_server.pdf_generator.permissions.PDFGeneratorBillingPermission'*/
    ]
}

// DATE FIELD CONFIGURATION
// check ./src/formulary/models/FieldDateFormatType
/*
Dates are saved in this default format, this way it becomes easier to work with it regardless
the location the user is accessing
*/
const DEFAULT_PSQL_DATE_FIELD_FORMAT = 'YYYY-MM-DD HH24:MI:SS'
const DEFAULT_DATE_FIELD_FORMAT = 'YYYY-MM-DD HH:mm:ss'

// NUMBER FIELD CONFIGURATION
// check ./src/formulary/models/FieldNumberFormatType
/*
Numbers are saved as `INTEGERs` in our DB since it's very difficult to work
with float values in computing, with this, we define a BASE NUMBER, so every integer saved
is multiplied by it, and every decimal is saved following the rule FLOATNUMBER * (BASE/PRECISION)
*/
const DEFAULT_BASE_NUMBER_FIELD_FORMAT = 100000000

// DEVELOPMENT LOCALSTACK CONFIGURATION
const LOCALSTACK_ENDPOINT = 'localhost.localstack.cloud'
const LOCALSTACK_PORT = 4566

// AWS CONFIGURATION
const AWS_SECRET_ACCESS_KEY = 'T9F/BhjffmkIFDpxoLkaguAB3gTUrRXACIp2Y8gg'
const AWS_ACCESS_KEY_ID = 'AKIAIBXGLOHWXNYYZJYQ'

// S3 CONFIGURATION
// check core/utils/storage.js file
const S3_REGION_NAME = 'us-east-2'
const S3_BUCKET = 'reflow-crm'
const S3_COMPANY_LOGO_PATH = 'company-logo'
const S3_FIELD_LABEL_IMAGE_PATH = 'field-label-image'
const S3_USER_PROFILE_IMAGE_PATH = 'user-profile'
const S3_FILE_ATTACHMENTS_PATH = 'file-attachments'
const S3_FILE_DRAFT_PATH = 'file-draft'

// CUSTOM JWT CONFIGURATION
// check authentication/utils/jwtAuth file
const JWT_ENCODING = 'HS256'
const JWT_HEADER_TYPES = ['Client']

// BILLING CONFIGURATION
const FREE_TRIAL_DAYS = 15

// MIXPANEL CONFIGURATION
// check https://developer.mixpanel.com/docs/nodejs for reference
const MIXPANEL_TOKEN = 'c128d8d78f06b4b00882a83b4f3d8021'

module.exports = {
    ENV,
    PERMISSIONS,
    EVENTS,
    DEBUG,
    PORT,
    BASE_PATH,
    MIDDLEWARE,
    APP_NAME,
    SECRET_KEY,
    ROOT_URLCONF,
    INSTALLED_APPS,
    DATABASE,
    DEFAULT_PSQL_DATE_FIELD_FORMAT,
    DEFAULT_DATE_FIELD_FORMAT,
    DEFAULT_BASE_NUMBER_FIELD_FORMAT,
    LOCALSTACK_ENDPOINT,
    LOCALSTACK_PORT,
    AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID,
    S3_REGION_NAME,
    S3_BUCKET,
    S3_COMPANY_LOGO_PATH,
    S3_USER_PROFILE_IMAGE_PATH,
    S3_FILE_ATTACHMENTS_PATH,
    S3_FILE_DRAFT_PATH,
    JWT_ENCODING,
    JWT_HEADER_TYPES,
    WEBSOCKETS,
    FREE_TRIAL_DAYS,
    MIXPANEL_TOKEN
}