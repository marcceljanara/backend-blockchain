const path = require('path');
const moment = require('moment');
require('dotenv').config();
require('fs');
const {AES, enc} = require('crypto-js');

const aesKey = process.env.AES_KEY;

const getDataImage = async (req, res) =>{
    try {
        const data = await getData('image/jpeg');
        res.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: 'Internal Server Error' }); // Send an error response if fetching data fails
    }
}

const getDataSensor = async (req,res) =>{
    try {
        const data = await getData('text/csv');
        res.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: 'Internal Server Error' }); // Send an error response if fetching data fails
    }
}

// Function Logic
const getData = async (mimeType) =>{
    const nft = [];
    const response = await fetch('https://explorer-api.shimmer.network/stardust/address/outputs/nft/shimmer-testnet/rms1qr4c7zzslga0xv7jhwdkhxctlxqmqz6txzgusr9egysudknzpqta5k88zzh',{method:'GET'});
    const responseJson = await response.json()
    const datas = await responseJson.outputs
    datas.forEach((data,index) =>{
        const hexMetaData = data.output.immutableFeatures[1].data.slice(2);
        const metaData = JSON.parse(hexToString(hexMetaData));
        if(mimeType === metaData.type){
            nft.push(metaData);
            // metaData.id = index;
            metaData.uri = AES.decrypt(metaData.uri, aesKey).toString(enc.Utf8);
        }
    })
    return nft;  
}

function hexToString(hex) {
    const buffer = Buffer.from(hex, 'hex');
    return buffer.toString('utf-8');
}

module.exports = {getDataImage,getDataSensor};