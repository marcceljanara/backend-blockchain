import { Buffer } from 'buffer';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import http from 'http';
import https from 'https';
import dotenv from 'dotenv';
import routers from './src/routes/router.js';

dotenv.config();

const api = express();

api.use(bodyParser.json());
api.use('/',cors(), routers);

api.use('/',cors(), (req,res) =>{
    res.status(404);
    res.send('404 Not Found');
})


const PORT = process.env.PORT || 5000; 

api.listen(PORT, () => { // Start the server
    console.log(`Server is running on http://localhost:${PORT}`);
});
