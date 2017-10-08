import * as express from 'express';
import controller from './discovery.controller';
const mongoose = require('mongoose');
// API request validatorup
const { check } = require('express-validator/check');

const validateAccountId = check('accountId', 'Enter a valid account ID').custom(value => mongoose.Types.ObjectId.isValid(value));

export default express
  .Router()
  .get('/myAccountId/:myAccountId', controller.discover)
  .post('/hide/initiator/:initiatorAccountId/receiver/:receiverAccountId', [validateAccountId], controller.hideUser);
