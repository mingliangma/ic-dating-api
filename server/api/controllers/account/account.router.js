import * as express from 'express';
import controller from './account.controller';

const { check } = require('express-validator/check');

const validateToken = check('token', 'require a token').exists();
const validatePhoneNum = check('phoneNum', 'Enter a valid phone number').isMobilePhone('any');
const validateAccountId = check('accountId', 'Enter a valid account ID').exists();
export default express
  .Router()
  .get('/me', [validateToken], controller.me)
  .post('/verify/phone/:phoneNum', controller.verifyPhone)
  .post('/verify/phone/:phoneNum/code/:code', controller.verifyCode)
  .put('/', [validateToken], controller.updateAccount)
  .post('/login', controller.login)
  .get('/list', controller.list);

