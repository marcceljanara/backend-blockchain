const path = require('path');
const moment = require('moment');
require('dotenv').config();
require('fs');


const getDataImage = async (req, res) =>{
    try {
        const data = await getData();
        res.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: 'Internal Server Error' }); // Send an error response if fetching data fails
    }
}

// Function Logic
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

function hexToString(hex) {
    const buffer = Buffer.from(hex, 'hex');
    return buffer.toString('utf-8');
}

module.exports = {getDataImage};