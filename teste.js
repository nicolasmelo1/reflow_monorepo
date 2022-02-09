const evaluate = require('./packages/shared/flow')

async function main() {
    const result = await evaluate(
`
List.join(String.split("Teste"), ',')
`
    )
    console.log(await(await result._string_())._representation_())
}

main()