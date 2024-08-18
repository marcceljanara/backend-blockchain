/* eslint-disable import/extensions */
import express from 'express';
import { getDataImage, getDataModels } from '../controllers/controllerBlockchain.js';
/* eslint-disable import/extensions */
import {
  getUsers, Register, Login, Logout, changePassword,

} from '../controllers/users.js';
import { authenticateToken, verifyToken } from '../middleware/verify-token.js';
import { getDataByMonth, getDataWithinTimeframe, downloadDataAsCSV } from '../controllers/mqttDataController.js';

const router = express.Router();

// Register, Login, & change password Logout route
router.get('/users', verifyToken, authenticateToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.delete('/logout', Logout);
router.put('/password', verifyToken, changePassword);

// Record of data Image
router.get('/data/image', getDataImage);

// Record of data Models
router.get('/data/models', getDataModels);

// Record of data sensor
router.get('/data/:timeframe', getDataWithinTimeframe);
router.get('/data/month/:month', getDataByMonth);
router.get('/data/download/:timeframe', downloadDataAsCSV);

export default router;
