/* eslint-disable arrow-parens */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
import { Op } from 'sequelize';
import { parse } from 'json2csv';
import SensorData from '../models/sensor-data-models.js';

// eslint-disable-next-line consistent-return
const getDataWithinTimeframe = async (req, res) => {
  const { timeframe } = req.params;
  let timeCondition;

  switch (timeframe) {
    case '15m':
      timeCondition = new Date(Date.now() - 15 * 60 * 1000);
      break;
    case '1h':
      timeCondition = new Date(Date.now() - 60 * 60 * 1000);
      break;
    case '6h':
      timeCondition = new Date(Date.now() - 6 * 60 * 60 * 1000);
      break;
    case '12h':
      timeCondition = new Date(Date.now() - 12 * 60 * 60 * 1000);
      break;
    case '1d':
      timeCondition = new Date(Date.now() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      timeCondition = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      timeCondition = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      return res.status(400).json({ error: 'Invalid timeframe' });
  }

  try {
    const data = await SensorData.findAll({
      attributes: ['timestamp', 'latitude', 'longitude', 'lux', 'temperature', 'humidity', 'publisher'], // Select specific columns
      where: {
        timestamp: {
          [Op.gte]: timeCondition,
        },
      },
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// eslint-disable-next-line consistent-return
const getDataByMonth = async (req, res) => {
  const { month } = req.params;
  const year = new Date().getFullYear();

  // Validasi bulan
  if (month < 1 || month > 12) {
    return res.status(400).json({ error: 'Invalid month' });
  }

  try {
    const data = await SensorData.findAll({
      attributes: ['timestamp', 'latitude', 'longitude', 'temperature', 'humidity', 'lux', 'publisher'], // Select specific columns
      where: {
        timestamp: {
          [Op.between]: [
            new Date(year, month - 1, 1),
            new Date(year, month, 1),
          ],
        },
      },
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Endpoint untuk mendownload data dalam format CSV
const downloadDataAsCSV = async (req, res) => {
  const { timeframe } = req.params;
  let timeCondition;

  switch (timeframe) {
    case '15m':
      timeCondition = new Date(Date.now() - 15 * 60 * 1000);
      break;
    case '1h':
      timeCondition = new Date(Date.now() - 60 * 60 * 1000);
      break;
    case '6h':
      timeCondition = new Date(Date.now() - 6 * 60 * 60 * 1000);
      break;
    case '12h':
      timeCondition = new Date(Date.now() - 12 * 60 * 60 * 1000);
      break;
    case '1d':
      timeCondition = new Date(Date.now() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      timeCondition = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      timeCondition = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      return res.status(400).json({ error: 'Invalid timeframe' });
  }

  try {
    const data = await SensorData.findAll({
      attributes: ['timestamp', 'latitude', 'longitude', 'temperature', 'humidity', 'lux', 'publisher'], // Select specific columns
      where: {
        timestamp: {
          [Op.gte]: timeCondition,
        },
      },
    });

    // Convert data to CSV
    const csv = parse(data.map(item => item.toJSON()));

    // Set response headers
    res.setHeader('Content-disposition', `attachment; filename=sensor-data-${timeframe}.csv`);
    res.set('Content-Type', 'text/csv');

    // Send CSV data
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export { getDataWithinTimeframe, getDataByMonth, downloadDataAsCSV };
