import { Op } from 'sequelize';
// eslint-disable-next-line import/extensions
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
      return res.status(400).send('Invalid timeframe');
  }

  try {
    const data = await SensorData.findAll({
      where: {
        timestamp: {
          [Op.gte]: timeCondition,
        },
      },
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

const getDataByMonth = async (req, res) => {
  const { month } = req.params;
  const year = new Date().getFullYear();

  try {
    const data = await SensorData.findAll({
      where: {
        timestamp: {
          [Op.gte]: new Date(year, month - 1, 1),
          [Op.lt]: new Date(year, month, 1),
        },
      },
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

export { getDataWithinTimeframe, getDataByMonth };
