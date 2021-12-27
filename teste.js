const makeRequestAgain = () => {
    return new Promise((resolve, reject) => {
        console.log('teste2')
    })
}

const main = async () => {
    await makeRequestAgain()
    console.log('teste')
}

main()