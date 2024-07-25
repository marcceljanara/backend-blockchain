import mqtt from 'mqtt';
import dotenv from 'dotenv';
import SensorData from './src/models/sensor-data-models.js';
import db from './src/configs/database.js';

dotenv.config();

const mqttTopic = 'sawit';

// Cek dan log env variables
const { MQTT_HOST, MQTT_USERNAME, MQTT_PASSWORD } = process.env;
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
      // Parse and validate data
      const data = JSON.parse(message.toString());
      if (!data.timestamp || !data.gps || !data.temperature || !data.humidity || !data.lux) {
        console.error('Invalid data format:', data);
        return;
      }

      // Ensure DB connection
      await db.authenticate();
      
      // Save data to database
      await SensorData.create(data);
      console.log('Data saved to database:', data);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }
});
