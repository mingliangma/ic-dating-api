import * as express from 'express';
import controller from './status.controller';

export default express
  .Router()
  .get('/status', controller.status);