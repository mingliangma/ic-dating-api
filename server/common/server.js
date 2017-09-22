import Express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
import cookieParser from 'cookie-parser';
import swaggerify from './swagger';
import l from './logger';
import SignService from '../api/services/sign.service';

const app = new Express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const boom = require('express-boom');

export default class ExpressServer {
  constructor() {
    l.info('process.env.DATABASE_URL=', process.env.DATABASE_URI);
    mongoose.connect(process.env.DATABASE_URI.toString()); // connect to database


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

    SignService.populateSignTable();
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
