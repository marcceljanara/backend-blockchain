import {getDataImage, getDataSensor} from '../controllers/controllerBlockchain.js'
/* eslint-disable import/extensions */
import express from 'express';
import {
  getUsers, Register, Login, Logout, changePassword,

} from '../controllers/users.js';
import { authenticateToken, verifyToken } from '../middleware/verify-token.js';

const router = express.Router();

// Register, Login, & change password Logout route
router.get('/users', verifyToken, authenticateToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.delete('/logout', Logout);
router.put('/password', verifyToken, changePassword);


//Record of data Image
router.get('/data/image',verifyToken,getDataImage);

// Record of data sensor
router.get('/data/sensor',verifyToken,getDataSensor);

export default router;