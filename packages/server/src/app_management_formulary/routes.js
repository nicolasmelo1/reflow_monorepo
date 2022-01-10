const { path } = require("../../config/routers")

const { TypeController } = require('./controllers')


const routes = [
    path('/types', TypeController.asController())
]

module.exports = routes