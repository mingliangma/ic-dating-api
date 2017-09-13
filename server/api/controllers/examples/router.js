import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .post('/me', controller.all)
  .get('/', controller.all)
  .get('/:id', controller.byId);
