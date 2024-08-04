/* eslint-disable no-cond-assign */
/* eslint-disable import/extensions */
import mqtt from 'mqtt';
import dotenv from 'dotenv';
import CryptoJS from 'crypto-js';
import SensorData from './src/models/sensor-data-models.js';
import db from './src/configs/database.js';

dotenv.config();

const mqttTopic = 'sawit';

// Cek dan log env variables
const {
  MQTT_HOST, MQTT_USERNAME, MQTT_PASSWORD, AES_SECRET_KEY,
} = process.env;
if (!MQTT_HOST || !MQTT_USERNAME || !MQTT_PASSWORD || !AES_SECRET_KEY) {
  console.error('MQTT or AES configuration is missing');
  process.exit(1);
}

// Fungsi untuk mendekripsi data AES
const decryptAES = (encryptedData) => {
  // Decrypt using CryptoJS
  const bytes = CryptoJS.AES.decrypt(encryptedData, AES_SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const client = mqtt.connect(MQTT_HOST, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  port: 1883, // Port default untuk MQTT adalah 1883
});

client.on('connect', () => {
  console.log('Connected to MQTT Broker');
  client.subscribe(mqttTopic, (err) => {
    if (!err) {
      console.log('Subscribed to topic:', mqttTopic);
    } else {
      console.error('Subscription error:', err);
    }
  });
});

client.on('message', async (topic, message) => {
  if (topic === mqttTopic) {
    try {
      // Parse dan decrypt data
      const encryptedData = JSON.parse(message.toString());
      const data = {
        timestamp: decryptAES(encryptedData.timestamp),
        latitude: parseFloat(decryptAES(encryptedData.latitude)),
        longitude: parseFloat(decryptAES(encryptedData.longitude)),
        temperature: parseFloat(decryptAES(encryptedData.temperature)),
        humidity: parseFloat(decryptAES(encryptedData.humidity)),
        lux: parseInt(decryptAES(encryptedData.lux), 10),
        publisher: decryptAES(encryptedData.publisher),
      };

      // Validasi data
      if (!data.timestamp || Number.isNaN(data.latitude) || Number.isNaN(data.longitude)
       || Number.isNaN(data.temperature) || Number.isNaN(data.humidity)
       || Number.isNaN(data.lux) || !data.publisher) {
        console.error('Invalid data format after decryption:', data);
        return;
      }

      // Pastikan koneksi DB
      await db.authenticate();

      // Simpan data ke database
      await SensorData.create(data);
      console.log('Data saved to database:', data);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }
});
