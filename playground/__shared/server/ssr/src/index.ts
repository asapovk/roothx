/* eslint-disable @typescript-eslint/ban-ts-comment */
import express, { Express } from 'express';
import path from 'path';

let App: Express;

const startApp = () => {
  App = express();
  App.listen(3000, () => {
    console.log('[Info: Listen 3000 to requests');
  });
};

startApp();
//@ts-ignore
App.use('/', express.static(path.join(__dirname, '../../../../../build')));
