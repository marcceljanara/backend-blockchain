/* eslint-disable no-cond-assign */
/* eslint-disable import/extensions */
import mqtt from 'mqtt';
import dotenv from 'dotenv';
import SensorData from './src/models/sensor-data-models.js';
import db from './src/configs/database.js';

dotenv.config();

const mqttTopic = process.env.MQTT_TOPIC;

// Cek dan log env variables
const {
  MQTT_HOST, MQTT_USERNAME, MQTT_PASSWORD,
} = process.env;
if (!MQTT_HOST || !MQTT_USERNAME || !MQTT_PASSWORD) {
  console.error('MQTT configuration is missing');
  process.exit(1);
}

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
      const rawdata = JSON.parse(message);
      const data = {
        timestamp: (rawdata.timestamp),
        latitude: parseFloat((rawdata.latitude)),
        longitude: parseFloat((rawdata.longitude)),
        temperature: parseFloat((rawdata.temperature)),
        humidity: parseFloat((rawdata.humidity)),
        lux: parseInt((rawdata.lux), 10),
        battery_soc: parseFloat(rawdata.battery_soc),
        battery_voltage: parseFloat(rawdata.battery_voltage),
        battery_current: parseFloat(rawdata.battery_current),
      };

      // Validasi data
      if (!data.timestamp || Number.isNaN(data.latitude) || Number.isNaN(data.longitude)
       || Number.isNaN(data.temperature) || Number.isNaN(data.humidity)
       || Number.isNaN(data.lux) || Number.isNaN(data.battery_soc)
       || Number.isNaN(data.battery_voltage) || Number.isNaN(data.battery_current)) {
        console.error('Invalid data format:', data);
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
