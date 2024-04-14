const routers = require('express').Router();
const blockchainHttp = require('../controllers/controllerBlockchain.js');

//Record of data Image
routers.get('/data/image',blockchainHttp.getDataImage);

// Record of data sensor
// routers.get('/data/sensor');

module.exports = routers;