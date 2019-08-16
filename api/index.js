var express = require('express')
var router = express.Router()

router.use('/v1', require('./v1/api-v1'));

module.exports = router;