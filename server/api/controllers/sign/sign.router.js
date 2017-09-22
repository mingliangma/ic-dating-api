import * as express from 'express';
import controller from './sign.controller';

export default express
  .Router()
  .get('/', controller.getAllSign);

