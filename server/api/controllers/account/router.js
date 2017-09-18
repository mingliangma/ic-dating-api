import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .get('/me', controller.me)
  .post('/verify/phone/:phoneNum', controller.verifyPhone)
  .post('/verify/phone/:phoneNum/code/:code', controller.verifyCode)
  .post('/', controller.createAccount)
    .post('/login', controller.login);
