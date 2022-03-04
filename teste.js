/*const FlowService = require('./packages/shared/flow/service')

async function main() {
    const flowService = await FlowService.initialize()
    const result = await flowService.evaluate(`
HTTP.get
`
    )
    console.log(await(await result._string_())._representation_())
}

main()*/

//async function main() {
//    const q = await question('Digite a expressão: ')
//}
//main()