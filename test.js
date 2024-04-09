const Buffer = require('buffer').Buffer;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const https = require('https');
require('dotenv').config()
const routers = require('express').Router();

const getData = async () =>{
    const nft = [];
    const response = await fetch('https://explorer-api.shimmer.network/stardust/address/outputs/nft/testnet/rms1qrhnfwvgsa3pd3yxarqgyrsx5l9g9u4du5864l5e7v86266yxn5s7ensvvs',{method:'GET'});
    const responseJson = await response.json()
    const datas = await responseJson.outputs
    datas.forEach((data,index) =>{
        const hexMetaData = data.output.immutableFeatures[1].data.slice(2);
        const metaData = JSON.parse(hexToString(hexMetaData));
        metaData.id = index;
        nft.push(metaData);
    })
    return nft;  
    }

const api = express();
routers.get('/latest', async (req, res) => { // Define a route handler with request and response parameters
    try {
        const data = await getData(); // Fetch data asynchronously
        res.json(data); // Send the fetched data as JSON response
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: 'Internal Server Error' }); // Send an error response if fetching data fails
    }
});

api.use(bodyParser.json()); // Parse JSON request bodies
api.use(cors()); // Enable CORS
api.use('/', routers);

const PORT = process.env.PORT || 5000; // Get port from environment variable or use 5000 as default

api.listen(PORT, () => { // Start the server
    console.log(`Server is running on http://localhost:${PORT}`);
});

function hexToString(hex) {
    const buffer = Buffer.from(hex, 'hex');
    return buffer.toString('utf-8');
}
