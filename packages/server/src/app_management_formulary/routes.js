const { path } = require("../../config/routers")

const { TypeController, FormularyController } = require('./controllers')


const routes = [
    path('', FormularyController.asController()),
    path('/types', TypeController.asController())
]

module.exports = routes