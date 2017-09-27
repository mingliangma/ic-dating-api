import * as express from 'express';
import controller from './account.controller';
const cors = require('cors');
// API file uploader
// const multer = require('multer');
// const uploading = multer({
//   dest: `${__dirname}../public/uploads/`,
//   limits: { fileSize: 1000000, files: 1 },
// });


// API request validatorup
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
  .get('/list', controller.list)
  .get('/:accountId/image/upload', cors(), controller.imageUpload)
  .get('/:accountId/image', cors(), controller.generatePresignedURL);

