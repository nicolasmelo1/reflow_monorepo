const { strings } = require('../constants')
const Context = require('./context')
const evaluate = require('./evaluate')

class ContextService {
    async appendTranslation() {
        const appendParameters = (parameterName, details, builtinLibraryMethod) => {
            const translatedParameterName = details.name || parameterName
            const parameterDescription = details.description || ''
            const parameterType = details.type || 'any'
            const parameterRequired = details.required !== undefined ? details.required : true
            builtinLibraryMethod.addParameter(parameterName, translatedParameterName, parameterDescription, parameterType, parameterRequired)
        }

        const appendMethods = (methodName, details, builtinLibraryModule) => {
            const translatedMethodName = details.name || methodName
            const methodDescription = details.description || ''
            const methodExamples = details.examples || ''
            const hasParameters = ![null, undefined, ''].includes(details.parameters) && typeof details.parameters === 'object'
            const builtinLibraryMethod = builtinLibraryModule.addMethod(
                methodName, translatedMethodName, methodDescription, methodExamples
            )
            if (hasParameters === true) {
                for (const [parameterName, parameterDetails] of Object.entries(details.parameters)) {
                    appendParameters(parameterName, parameterDetails, builtinLibraryMethod)
                }
            }
        }

        const appendStructs = (structName, details, builtinLibraryModule) => {
            const translatedStructName = details.name || structName
            const structDescription = details.description || ''
            const hasAttributes = ![null, undefined, ''].includes(details.attributes) && typeof details.attributes === 'object'
            const builtinLibraryStruct = builtinLibraryModule.addStruct(
                structName, translatedStructName, structDescription
            )
        }

        const appendModules = (moduleName, details) =>{
            const translatedModuleName = details.name || moduleName
            const moduleDescription = details.description || ''
            const isMethodsDefined = !['', null, undefined].includes(details.methods) && typeof details.methods === 'object'
            const isStructsDefined = !['', null, undefined].includes(details.structs) && typeof details.structs === 'object'
            const builtinLibraryModule = this.context.addLibraryModule(moduleName, translatedModuleName, moduleDescription)

            if (isMethodsDefined === true) {
                for (const [methodName, methodDetails] of Object.entries(details.methods)) {
                    appendMethods(methodName, methodDetails, builtinLibraryModule)
                }
            }

            if (isStructsDefined === true) {
                for (const [structName, structDetails] of Object.entries(details.structs)) {
                    appendStructs(structName, structDetails, builtinLibraryModule)
                }
            }
        }

        const promises = this.context.modulesToRuntime.map(async ({ moduleClass, moduleName }) => {
            const documentation = await moduleClass.documentation(this.context.languageContext)
            const doesDocumentationExists = ![null, undefined].includes(documentation) && typeof documentation === 'object'
            if (doesDocumentationExists === true) {
                appendModules(moduleName, documentation)
            }
        })
        await Promise.all(promises)
    }

    /**
     * This is responsible for appending the extra modules to the runtime. So what we need to do is that for different context where
     * flow is running, we can append new builtin modules. So for example:
     * 
     * When we are building the Automation app, and want to use flow to run the automations. What we do is that we can append the Automation
     * module to the running context, so then Automation module will be available to use for the users/programmers.
     * 
     * Inside of the management app for example, we might want to retrieve the values of some particular fields. For that we can create
     * a `Formula` module where we can have specific methods and attributes.
     * 
     * @param {Array<{moduleClass: import('./builtins/library').LibraryModule, moduleName: string}>} extraModules - An array containing
     * all of the extra modules that you want to append to the runtime.
     */
    async appendExtraModulesAndTranslate(extraModules) {
        for (const extraModule of extraModules) {
            const { moduleName, moduleClass } = extraModule
            
            if (['', null, undefined].includes(moduleName)) throw new Error('moduleName is required in `extraModules`')

            const isModuleClassDefined = !['', null, undefined].includes(moduleClass)
            if (isModuleClassDefined === true) this.context.addModuleToRuntime(moduleClass, moduleName)
        }
        await this.appendTranslation()
    }

    async buildContext(languageContext, extraModules) {
        this.context = new Context({
            includes: strings('flowIncludesKeyword', languageContext),
            conjunction: strings('flowConjunctionKeyword', languageContext),
            disjunction: strings('flowDisjunctionKeyword', languageContext),
            inversion: strings('flowInversionKeyword', languageContext),
            equality: strings('flowEqualityKeyword', languageContext),
            blockDo: strings('flowDoKeyword', languageContext),
            blockEnd: strings('flowEndKeyword', languageContext),
            ifIf: strings('flowIfKeyword', languageContext),
            ifElse: strings('flowElseKeyword', languageContext),
            nullValue: strings('flowNullKeyword', languageContext),
            booleanTrue: strings('flowTrueKeyword', languageContext),
            booleanFalse: strings('flowFalseKeyword', languageContext),
            functionKeyword: strings('flowFunctionKeyword', languageContext),
            returnKeyword: strings('flowReturnKeyword', languageContext),
            raiseKeyword: strings('flowRaiseKeyword', languageContext),
            tryKeyword: strings('flowTryKeyword', languageContext),
            catchKeyword: strings('flowCatchKeyword', languageContext),
            moduleKeyword: strings('flowModuleKeyword', languageContext),
            decimalPointSeparator: strings('flowDecimalPointSeparator', languageContext),
            positionalArgumentSeparator: strings('flowPositionalArgumentSeparator', languageContext),
            timezone: strings('flowTimezone', languageContext),
            dateCharacter: strings('flowDateCharacter', languageContext),
            dateFormat: strings('flowDateFormat', languageContext),
            hourFormat: strings('flowHourFormat', languageContext),
            documentationKeyword: strings('flowDocumentationKeyword', languageContext),
            languageContext: languageContext,
            tailCallOptimizedMessage: strings('flowTailCallOptimizedMessage', languageContext),
        })

        await this.appendExtraModulesAndTranslate(extraModules)
        return this.context
    }
}

class FlowService {
    constructor(context) {
        this.context = context
    }
    
    static async initialize(languageContext='pt-BR', extraModules=[]) {
        const contextService = new ContextService()
        const context = await contextService.buildContext(languageContext, extraModules)
        return new this(context, languageContext)
    }

    async evaluate(code) {
        return await evaluate(code, this.context)
    }
    
}

const customModule = {
    moduleClass: Error,
    moduleName: 'Error',
    details: {
        name: 'Erro',
        description: 'Mensagem de erro',
        example: 'Erro: mensagem de erro',
    }
}
module.exports = FlowService