/* eslint-disable no-use-before-define */
import dotenv from 'dotenv';
import CryptoJS from 'crypto-js';

dotenv.config();

const aesKey = CryptoJS.enc.Utf8.parse(process.env.AES_KEY); // Key must be a WordArray
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

export const getDataModels = async (req, res) => {
  try {
    const data = await getData('application/x-hdf5');
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
    if (mimeType === metaData.type) {
      // Decrypt URI
      const encryptedText = metaData.uri;
      const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedText);

      // Extract IV (first 16 bytes) and encrypted data
      const iv = CryptoJS.lib.WordArray.create(encryptedBytes.words.slice(0, 4)); // 16 bytes
      const encryptedData = CryptoJS.lib.WordArray.create(encryptedBytes.words.slice(4));

      // Decrypt
      const decryptedBytes = CryptoJS.AES.decrypt({ ciphertext: encryptedData }, aesKey, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Convert decrypted bytes to string
      metaData.uri = decryptedBytes.toString(CryptoJS.enc.Utf8);
      nft.push(metaData);
    }
  });
  return nft;
};

function hexToString(hex) {
  const buffer = Buffer.from(hex, 'hex');
  return buffer.toString('utf-8');
}
