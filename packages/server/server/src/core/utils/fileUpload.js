const multer = require('multer')
const storage = multer.diskStorage({})

module.exports = multer({storage: storage})