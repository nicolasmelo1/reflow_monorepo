const FlowService = require('./packages/shared/flow/service')

async function main() {
    const flowService = await FlowService.initialize()
    const result = await flowService.evaluate(`
Requisição.pegar
`
    )
    console.log(await(await result._string_())._representation_())
}

main()