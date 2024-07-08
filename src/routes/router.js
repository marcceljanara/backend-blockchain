import {getDataImage, getDataSensor} from '../controllers/controllerBlockchain.js'
import { Router } from 'express';

const routers = Router();

//Record of data Image
routers.get('/data/image',getDataImage);

// Record of data sensor
routers.get('/data/sensor',getDataSensor);

export default routers;