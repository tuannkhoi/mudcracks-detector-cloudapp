var express = require('express');
var router = express.Router();

let nasaController = require('../controller/nasa.controller');

router.get('/', nasaController.getPredictions);

module.exports = router;