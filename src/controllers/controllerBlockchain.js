/* eslint-disable no-use-before-define */
/* eslint-disable import/extensions */
import dotenv from 'dotenv';
import aes from 'crypto-js/aes.js';
import utf8 from 'crypto-js/enc-utf8.js';

dotenv.config();

const aesKey = process.env.AES_KEY;
const address = process.env.ADDRESS;

export const getDataImage = async (req, res) => {
  try {
    const data = await getData('image/jpeg');
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getDataSensor = async (req, res) => {
  try {
    const data = await getData('text/csv');
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // Send an error response if fetching data fails
  }
};

// Function Logic
const getData = async (mimeType) => {
  const nft = [];
  const response = await fetch(`https://explorer-api.shimmer.network/stardust/address/outputs/nft/shimmer-testnet/${address}`, { method: 'GET' });
  const responseJson = await response.json();
  const datas = await responseJson.outputs;
  datas.forEach((data) => {
    const hexMetaData = data.output.immutableFeatures[1].data.slice(2);
    const { transactionId } = data.metadata;
    const metaData = JSON.parse(hexToString(hexMetaData));
    metaData.transactionId = transactionId;
    console.log(transactionId);
    if (mimeType === metaData.type) {
      metaData.uri = aes.decrypt(metaData.uri, aesKey).toString(utf8);
      nft.push(metaData);
    }
  });
  return nft;
};

function hexToString(hex) {
  const buffer = Buffer.from(hex, 'hex');
  return buffer.toString('utf-8');
}
