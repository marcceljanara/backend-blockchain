import { DataTypes } from 'sequelize';
import db from '../configs/database.js';

const SensorData = db.define('SensorData', {
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  gps: {
    type: DataTypes.JSONB,
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
}, {
  freezeTableName: true,
});

export default SensorData;
