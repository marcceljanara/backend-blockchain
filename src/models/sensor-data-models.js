/* eslint-disable import/extensions */
import { DataTypes } from 'sequelize';
import db from '../configs/database.js';

const SensorData = db.define('SensorData', {
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  humidity: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  lux: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  battery_soc: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  battery_voltage: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  battery_current: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});

export default SensorData;
