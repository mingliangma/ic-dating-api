/* eslint-disable newline-per-chained-call,consistent-return */
import AccountService from '../../services/account.service';
import SmsService from '../../services/sms.service';
import OtpService from '../../services/otp.service';
import JwtService from '../../services/jwt.service';
import AwsService from '../../services/aws.service';
import ResponseService from '../../services/response.service';
import PasswordService from '../../services/password.service';
import l from '../../../common/logger';
import User from '../../../model/user';
import Sign from '../../../model/sign';
import Hide from '../../../model/hide';
// get our mongoose model
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

const moment = require('moment');
const { validationResult } = require('express-validator/check');

Promise.config({
  // Enable cancellation
  cancellation: true,
});

class UserNotFoundError extends Error {
  constructor(s) {
    super(s);
  }
}

class SignNotFoundError extends Error {
  constructor(s) {
    super(s);
  }
}

function generateListQuery(reqQuery) {
  return new Promise((resolve, reject) => {
    const query = {};
    query.display_name = { $exists: true };
    query.picture_url = { $exists: true };
    query.$where = 'this.picture_url.length>0';
    if (reqQuery.gender) query.gender = reqQuery.gender;
    if (reqQuery.ethnicity) query.ethnicity = reqQuery.ethnicity;
    if (reqQuery.ageMax || reqQuery.ageMin) {
      const dateQuery = { };

      if (reqQuery.ageMax) {
        const dateString = moment().subtract(reqQuery.ageMax, 'years');
        dateQuery.$gte = dateString.toDate();
      }

      if (reqQuery.ageMin) {
        const dateString = moment().subtract(reqQuery.ageMin, 'years');
        dateQuery.$lte = dateString.toDate();
      }

      query.date_of_birth = dateQuery;
    } else {
      // should always return user with age over 18
      const dateQuery = {};
      dateQuery.$lte = moment().subtract(18, 'years').toDate();
      query.date_of_birth = dateQuery;
    }
    if (reqQuery.sign) {
      const signArray = reqQuery.sign.split('-');
      Sign.find({ sign_id: { $in: signArray } }, '_id', (err, signs) => {
        if (err) {
          reject(err);
        }

        for (let i = 0; i < signs.length; i++) {
          query.sign = { $in: signs };
        }
        resolve(query);
      });
    } else {
      resolve(query);
    }
  });
}

export class Controller {
  me(req, res) {
    // console.log('token: ', req.headers.token);

    JwtService.verifyToken(req.headers.token)
      .then(decoded =>
        // l.debug(decoded);
        AccountService.findOneAndPopulate('phone_num', decoded.phoneNum, 'sign'),
      )
      .then(u => {
        if (!u) {
          throw new UserNotFoundError('User not found');
        } else {
          res.status(200).json(ResponseService.generateAccountResponse(u));
        }
      }).catch(jwt.TokenExpiredError, () => {
        res.boom.unauthorized('TokenExpiredError: JWT token expired');
      }).catch(jwt.JsonWebTokenError, err => {
        res.boom.unauthorized(`JsonWebTokenError: ${err.message}`);
      }).catch(err => {
        // l.info(err);
        res.boom.unauthorized(err.message);
      });
  }

  verifyPhone(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.mapped());
      return res.status(422).json({ errors: errors.mapped() });
    }
    // check if account already created
    const p = AccountService.findOnePromise('phone_num', req.params.phoneNum)
      .then(user => {
        console.log('user: ', user);
        if (user && user.password && !req.query.disablePasswordLogin) {
          res.status(200).json({ message: 'Account already exist and account can use password to login' });
          p.cancel();
        } else {
          Promise.resolve();
        }
      })
      .then(() => {
        // generate OTP code
        const token = OtpService.generateToken();
        l.debug(`IC Code: ${token}`);
        if (req.query.disableSMS) {
          l.debug('SMS service is disabled');
          res.status(201).json({ codeForTesting: token, success: true });
          p.cancel();
        }
        return Promise.resolve(token);
      })
      .then(token =>
        // send OTP code to user through SMS
        Promise.all([token, SmsService.sendSms(req.params.phoneNum, `IC Code: ${token}`)]),
      )
      .then(([token, message]) => {
        res.status(201);
        res.json({ codeForTesting: token, success: true, message: `Verification code sent, messageId is ${message.sid}` });
      })
      .catch(err => {
        console.log('err: ', err);
        res.boom.badRequest(err.message);
      });
  }

  verifyCode(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.mapped());
      return res.status(422).json({ errors: errors.mapped() });
    }

    const phoneNum = req.params.phoneNum;
    const code = req.params.code;

    // verify text code
    const verified = OtpService.verifyToken(code);
    if (!verified) {
      res.boom.unauthorized('invalid verfication code');
      return;
    }
    l.info(`code verified for phone number ${phoneNum}`);


    const p = AccountService.createAccount(phoneNum)
      .then(user => {
        // generate web token
        console.log('generateToken1');
        const token = JwtService.generateToken(phoneNum, user._id);
        res.status(201).json({ success: true, token, userId: user._id });
        p.cancel();
      }).catch(err => {
        if (err.code === 11000 || err.code === 11001) {
          console.log('Phone number already exist');
          return User.findOne({ phone_num: phoneNum });
        }
        res.boom.forbidden(err.errmsg);
        p.cancel();
      }).then(user => {
        const token = JwtService.generateToken(phoneNum, user._id);
        res.status(201).json({ success: true, token, userId: user._id });
      }).catch(err => {
        console.log(err);
        res.boom.forbidden(err.errmsg);
      });
  }

  initAccount(req, res) {
    // Get the validation result whenever you want; see the Validation Result API for all options!
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.mapped());
      return res.status(422).json({ errors: errors.mapped() });
    }
    console.log('req.body.dateOfBirth: ', req.body.dateOfBirth);
    JwtService.verifyToken(req.headers.token)
      .then(decoded =>
        User.findById(decoded.accountId),
      ).then(user => {
        if (!user) {
          throw new UserNotFoundError();
        } else {
          console.log('req.body.displayName: ', req.body.displayName);

          const u = user;
          if (req.body.password) u.password = PasswordService.cryptPasswordSync(req.body.password);
          if (req.body.displayName) u.display_name = req.body.displayName;
          if (req.body.ethnicity) u.ethnicity = req.body.ethnicity;
          if (req.body.dateOfBirth) u.date_of_birth = req.body.dateOfBirth;
          if (req.body.gender) u.gender = req.body.gender;
          u.created_at = moment().toDate();
          return u.save();
        }
      }).then(u => {
        res.status(201).json(ResponseService.generateAccountResponse(u));
      }).catch(jwt.TokenExpiredError, () => {
        res.boom.unauthorized('TokenExpiredError: JWT token expired');
      }).catch(jwt.JsonWebTokenError, err => {
        res.boom.unauthorized(`JsonWebTokenError: ${err.message}`);
      }).catch(UserNotFoundError, () => {
        res.boom.notFound('account id not found');
      }).catch(err => {
        l.error(err);
        res.boom.badImplementation(err.message);
      });
  }

  addPhoto(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.mapped());
      return res.status(422).json({ errors: errors.mapped() });
    }

    JwtService.verifyToken(req.headers.token)
      .then(decoded => User.findById(decoded.accountId))
      .then(user => {
        if (!user) {
          throw new UserNotFoundError();
        }

        for (let i = 0; i < user.picture_url.length; i++) {
          if (user.picture_url[i] === req.body.pictureUrl) {
            return user;
          }
        }

        const u = user;
        u.picture_url.push(req.body.pictureUrl);
        u.updated_at = moment().toDate();

        return u.save();
      }).then(u => {
        res.status(200).json({ pictureUrl: u.picture_url });
      }).catch(jwt.TokenExpiredError, () => {
        res.boom.unauthorized('TokenExpiredError: JWT token expired');
      }).catch(jwt.JsonWebTokenError, err => {
        res.boom.unauthorized(`JsonWebTokenError: ${err.message}`);
      }).catch(UserNotFoundError, () => {
        res.boom.notFound('account id not found');
      }).catch(err => {
        l.error(err);
        res.boom.badImplementation(err.message);
      });
  }

  removePhoto(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.mapped());
      return res.status(422).json({ errors: errors.mapped() });
    }

    JwtService.verifyToken(req.headers.token)
      .then(decoded => User.findById(decoded.accountId))
      .then(u => {
        if (!u) {
          throw new UserNotFoundError();
        }

        const user = u;
        for (let i = 0; i < user.picture_url.length; i++) {
          if (user.picture_url[i] === req.body.pictureUrl) {
            user.picture_url.splice(i, 1);
            user.updated_at = moment().toDate();
          }
        }
        return user.save();
      }).then(u => {
        res.status(200).json({ pictureUrl: u.picture_url });
      }).catch(jwt.TokenExpiredError, () => {
        res.boom.unauthorized('TokenExpiredError: JWT token expired');
      }).catch(jwt.JsonWebTokenError, err => {
        res.boom.unauthorized(`JsonWebTokenError: ${err.message}`);
      }).catch(UserNotFoundError, () => {
        res.boom.notFound('account id not found');
      }).catch(err => {
        l.error(err);
        res.boom.badImplementation(err.message);
      });
  }

  updateAccount(req, res) {
    console.log('req.headers.token: ', req.headers.token);
    // Get the validation result whenever you want; see the Validation Result API for all options!
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.mapped());
      return res.status(422).json({ errors: errors.mapped() });
    }

    console.log('signId: ', req.body.signId);
    JwtService.verifyToken(req.headers.token)
      .then(decoded => {
        if (req.body.signId) {
          const promiseArray = [User.findById(decoded.accountId)];
          for (let j = 0; j < req.body.signId.length; j++) {
            promiseArray.push(Sign.findOne({ sign_id: req.body.signId[j] }));
          }

          return Promise.all(promiseArray);
        }
        return User.findById(decoded.accountId);
      })
      .then(result => {
        if (result instanceof Array) {
          if (!result[0]) {
            throw new UserNotFoundError();
          }
          if (!result[1]) {
            throw new SignNotFoundError();
          }

          const u = result[0];
          const signArray = [];
          for (let i = 1; i < result.length; i++) {
            signArray.push(result[i]);
          }

          if (req.body.description) u.description = req.body.description;
          if (req.body.signId) u.sign = signArray;
          if (req.body.pictureUrl) u.picture_url = req.body.pictureUrl;
          u.updated_at = moment().toDate();
          return u.save();
        }

        if (!result) {
          throw new UserNotFoundError();
        } else {
          const u = result;
          if (req.body.description) u.description = req.body.description;
          if (req.body.pictureUrl) u.picture_url = req.body.pictureUrl;
          u.updated_at = moment().toDate();
          return u.save();
        }
      }).then(u => {
        res.status(200).json(generateAccountResponse(u));
      }).catch(jwt.TokenExpiredError, () => {
        res.boom.unauthorized('TokenExpiredError: JWT token expired');
      }).catch(jwt.JsonWebTokenError, err => {
        res.boom.unauthorized(`JsonWebTokenError: ${err.message}`);
      }).catch(UserNotFoundError, () => {
        res.boom.notFound('account id not found');
      }).catch(err => {
        l.error(err);
        res.boom.badImplementation(err.message);
      });
  }

  getAccountInfo(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.mapped());
      return res.status(422).json({ errors: errors.mapped() });
    }

    console.log('accountId: ', req.params.accountId);
    console.log('accountId is valid: ', mongoose.Types.ObjectId.isValid(req.params.accountId));

    AccountService.findOneByIdPromise(req.params.accountId)
      .then(user => {
        if (!user) {
          throw new UserNotFoundError();
        } else {
          const u = user;
          res.status(200).json(generateAccountResponse(u));
        }
      }).catch(jwt.TokenExpiredError, () => {
        res.boom.unauthorized('TokenExpiredError: JWT token expired');
      }).catch(jwt.JsonWebTokenError, err => {
        res.boom.unauthorized(`JsonWebTokenError: ${err.message}`);
      }).catch(UserNotFoundError, () => {
        res.boom.notFound('account id not found');
      }).catch(err => {
        l.error(err);
        res.boom.badImplementation(err.message);
      });
  }

  login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.mapped());
      return res.status(422).json({ errors: errors.mapped() });
    }

    const findOne = AccountService.findOnePromise('phone_num', req.body.phoneNum);
    const comparePassword = findOne.then(user => {
      if (user) {
        return PasswordService.comparePassword(user.password, req.body.password);
      }
      throw new UserNotFoundError('phone number not found');
    }).catch(UserNotFoundError, err => {
      res.boom.unauthorized(err.message);
      comparePassword.cancel();
    }).catch(err => {
      res.boom.unauthorized(err.message);
      comparePassword.cancel();
    });

    Promise.all([findOne, comparePassword]).then(([user, compareResult]) => {
      if (compareResult) {
        const token = JwtService.generateToken(req.body.phoneNum, user._id);
        res.status(201).json({ success: true, token, userId: user._id });
      } else {
        res.boom.unauthorized('incorrect password');
      }
    });
  }

  list(req, res) {
    // console.log(req.query);

    const options = { page: 1, limit: 30, populate: 'sign' };

    if (req.query.page && !isNaN(req.query.page)) options.page = parseInt(req.query.page, 10);
    if (req.query.limit && !isNaN(req.query.limit)) options.limit = parseInt(req.query.limit, 10);

    generateListQuery(req.query)
      .then(query => {
        // console.log('query: ', query);
        // console.log('options: ', options);
        User.paginate(query, options, (err, result) => {
          if (err) {
            return res.status(200).json(err);
          }

          const responseArray = [];
          for (let i = 0; i < result.docs.length; i++) {
            responseArray.push(ResponseService.generateAccountResponse(result.docs[i]));
          }

          const results = {
            list: responseArray,
            totalPages: Math.ceil(result.total / result.limit),
            totalItems: result.total,
            limit: result.limit,
            page: result.page,
          };
          res.status(200).json(results);
        });
      })
      .catch(err => {
        console.error('error:', err.message);
        res.boom.badimplementation(err.message);
      });
  }

  generatePutPreSignedURL(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.mapped());
      return res.status(422).json({ errors: errors.mapped() });
    }

    AccountService.accountExistById(req.params.accountId)
      .then(result => {
        console.log('accountExistById: ', result);
      })
      .then(() => AwsService.generatePutPreSignedURL(
        req.query.fileName,
        req.query.fileType,
        req.params.accountId))
      .then(({ signedURL, fileLink }) => {
        res.status(200).json({ signedURL, fileLink });
      })
      .catch(err => {
        console.error('error:', err.message);
        res.boom.badimplementation(err.message);
      });
  }

  // receiverAccountId hide from initiatorAccountId
  hideUser(req, res) {
    const initiatorAccountId = req.params.initiatorAccountId;
    const receiverAccountId = req.params.receiverAccountId;

    console.log('initiatorAccountId is valid: ', mongoose.Types.ObjectId.isValid(initiatorAccountId));
    console.log('receiverAccountId is valid: ', mongoose.Types.ObjectId.isValid(receiverAccountId));

    // check if initiatorAccountId and receiverAccountId exist
    AccountService.findPromise({ _id: { $in: [
      mongoose.Types.ObjectId(initiatorAccountId),
      mongoose.Types.ObjectId(receiverAccountId),
    ] } })
      .then(users => {
        if (users && users.length === 2) {
          const nowDate = moment().toDate();
          return new Hide({
            initiator: users[0],
            receiver: users[1],
            created_at: nowDate,
          }).save((err, hide) => {
            console.log('err: ', err);
            console.log('hide: ', hide);
          });
        }
      }).then(hide => {
        res.status(201).json({ success: true });
      }).catch(err => {
        res.status(400).json(err);
      });
  }
}


export default new Controller();
