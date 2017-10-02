import * as express from 'express';
import controller from './account.controller';

const mongoose = require('mongoose');

// API request validatorup
const { check } = require('express-validator/check');

const validatePhoneNum = check('phoneNum', 'Enter a valid phone number').isMobilePhone('any');
const validateDateOfBirth = check('dateOfBirth', 'the date should be in the format of yyyy-mm-dd')
  .isLength(10)
  .matches(/(\d)(\d)(\d)(\d)(-)(\d)(\d)(-)(\d)(\d)/);
const validateGender = check('gender', 'Enter male or female').isIn(['male', 'female']);
const validateEthnicity = check('ethnicity', 'Enter asian, black, latin, indian, native-american, caucasian, and other')
  .isIn(['asian', 'black', 'latin', 'native_american', 'caucasian', 'other']);
const validateAccountId = check('accountId', 'Enter a valid account ID').custom(value => mongoose.Types.ObjectId.isValid(value));
const validateFileType = check('fileType', 'Enter a valid file Type, eg. image/png').exists();
const validateFileName = check('fileName', 'Enter a valid file Name, eg. me.png').exists();
const validateSignId = check('signId', 'signId field must be an array of integer').custom((value, { req }) => {
  if (value) {
    return value === req.body.password;
  }
  return true;
});

export default express
  .Router()
  .get('/me', controller.me)
  .post('/verify/phone/:phoneNum', controller.verifyPhone)
  .post('/verify/phone/:phoneNum/code/:code', controller.verifyCode)
  .put('/', [validateDateOfBirth, validateGender, validateEthnicity], controller.initAccount)
  .post('/login', [validatePhoneNum], controller.login)
  .get('/list', controller.list)
  .get('/:accountId', [validateAccountId], controller.getAccountInfo)
  .put('/:accountId', [validateAccountId], controller.updateAccount)
  .get('/:accountId/image/gen-presigned-url', controller.generatePutPreSignedURL);

