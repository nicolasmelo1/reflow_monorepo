const FlowService = require('./packages/shared/flow/service')

async function main() {
    const flowService = await FlowService.initialize()
    const result = await flowService.evaluate(`
função soma(a; b=20) faça
    a + b
fim
  
soma(2) 
`
    )
    console.log(await(await result._string_())._representation_())
}

main()

//async function main() {
//    const q = await question('Digite a expressão: ')
//}
//main()