import Express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
import cookieParser from 'cookie-parser';
import swaggerify from './swagger';


import populateDB from '../api/services/populate.db.service';

const app = new Express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const boom = require('express-boom');
const l = require('pino')();
const firebaseAdmin = require('firebase-admin');
const firebase = require('firebase');

// const cors = require('cors');


export default class ExpressServer {
  constructor() {
    // l.info('process.env.DATABASE_URL=', process.env.DATABASE_URI);
    // connect to database
    mongoose.connect(process.env.DATABASE_URI.toString(), {
      useMongoClient: true,
    });


    const root = path.normalize(`${__dirname}/../..`);
    app.set('appPath', `${root}client`);


    // use body parser so we can get info from POST and/or URL parameters
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // use morgan to log requests to the console
    app.use(morgan('dev'));


    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(Express.static(`${root}/build/public`));

    app.use(boom());

    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert({
        projectId: process.env.PROJECT_ID.toString(),
        clientEmail: process.env.CLIENT_EMAIL.toString(),
        privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      databaseURL: process.env.DATABASE_URL.toString(),
    });

    const config = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
    };

    firebase.initializeApp(config);


    // app.options('*', cors())
    if (process.env.NODE_ENV !== 'test') populateDB.populate();
  }

  router(routes) {
    swaggerify(app, routes);
    return this;
  }

  listen(port = process.env.PORT) {
    const welcome = p => () => l.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${p}}`);
    http.createServer(app).listen(port, welcome(port));
    return app;
  }
}
