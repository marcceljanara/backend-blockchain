const Buffer = require('buffer').Buffer;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const https = require('https');
require('dotenv').config();

const api = express();

// Routes Blockchain
const blockchainAppRoute = require('./src/routes/routerBlockchain.js');

api.use(bodyParser.json());
api.use('/',cors(), blockchainAppRoute);

api.use('/',cors(), (req,res) =>{
    res.status(404);
    res.send('404 Not Found');
})

const PORT = process.env.PORT || 5000; 

api.listen(PORT, () => { // Start the server
    console.log(`Server is running on http://localhost:${PORT}`);
});
