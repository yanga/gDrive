// import express from 'express';
const express = require('express');
import {driveService} from './service/drive.service';
import {mailService} from './service/mail.service';

const app = express();
const PORT = process.env.PORT || 3000;

const handleResponse = (res: any, data: any) => res.status(200).send(data);

app.use(function (req: any, res:any, next: any) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Pass to next layer of middleware
  next();
});

app.use(express.urlencoded({
  extended: true
}))

app.get('/', (req: any, res: any) => res.send('Express + TypeScript Server'));

app.get('/getFiles/:clientShareId',async (req: any ,res: any, next: any) => {
  driveService.getFilesByShareId(req.params.clientShareId)
    .then((data: any) => handleResponse(res, data))
    .catch(next);
});

app.get('/getFolder/:clientShareId',async (req: any ,res: any, next: any) => {
  driveService.getFolderName(req.params.clientShareId)
    .then((data: any) => handleResponse(res, data))
    .catch(next);
});

app.post('/sendMail', async (req: any, res: any, next: any) => {
  mailService.sendSelection(req.body)
    .then((data: any) => handleResponse(res, data))
    .catch(next);
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
