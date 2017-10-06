import * as express from 'express';
import controller from './discovery.controller';

// API request validatorup
const { check } = require('express-validator/check');

const validateAccountId = check('accountId', 'Enter a valid account ID').custom(value => mongoose.Types.ObjectId.isValid(value));

export default express
  .Router()
  .get('/myAccountId/:myAccountId', controller.discover)
  .post('/hide', [validateAccountId], controller.hideUser);
