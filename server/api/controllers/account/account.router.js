import * as express from 'express';
import controller from './account.controller';

// API request validatorup
const { check } = require('express-validator/check');

const validateToken = check('token', 'require a token').exists();
const validatePhoneNum = check('phoneNum', 'Enter a valid phone number').isMobilePhone('any');
const validateAccountId = check('accountId', 'Enter a valid account ID').exists();
const validateFileType = check('fileType', 'Enter a valid file Type, eg. image/png').exists();
const validateFileName = check('fileName', 'Enter a valid file Name, eg. me.png').exists();

export default express
  .Router()
  .get('/me', [validateToken], controller.me)
  .post('/verify/phone/:phoneNum', controller.verifyPhone)
  .post('/verify/phone/:phoneNum/code/:code', controller.verifyCode)
  .put('/', [validateToken], controller.updateAccount)
  .post('/login', controller.login)
  .get('/list', controller.list)
  .get('/:accountId/image/gen-presigned-url', controller.generatePutPreSignedURL);

