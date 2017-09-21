/* eslint-disable newline-per-chained-call */
import AccountService from '../../services/account.service';
import SmsService from '../../services/sms.service';
import OtpService from '../../services/otp.service';
import JwtService from '../../services/jwt.service';
import PasswordService from '../../services/password.service';
import l from '../../../common/logger';
import User from '../../../model/user';// get our mongoose model

const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

const boom = require('express-boom');
const { validationResult } = require('express-validator/check');

Promise.config({
  // Enable cancellation
  cancellation: true,
});

export class Controller {
  me(req, res) {
    console.log('token: ', req.headers.token);

    // Get the validation result whenever you want; see the Validation Result API for all options!
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.mapped());
      return res.status(422).json({ errors: errors.mapped() });
    }

    JwtService.verifyToken(req.headers.token)
      .then(decoded => User.findOne({ phone_num: decoded.phoneNum }))
      .then(user => {
        if (!user) {
          throw new Error('JWT validated correctly but the user record is not found');
        } else {
          return res.json(user);
        }
      }).catch(jwt.TokenExpiredError, err => {
        res.boom.unauthorized('TokenExpiredError: JWT token expired');
      }).catch(jwt.JsonWebTokenError, err => {
        res.boom.unauthorized(`JsonWebTokenError: ${err.message}`);
      }).catch(err => {
        // l.info(err);
        res.boom.unauthorized(err.message);
      });
  }

  verifyPhone(req, res) {
    // check if account already created
    if (AccountService.accountExist(req.phoneNum)) {
      res.status(200).json({ message: 'Account already exist and account can use password to login' });
      return;
    }

    // generate OTP code
    const token = OtpService.generateToken();
    l.info(`IC Code: ${token}`);

    // send OTP code to user through SMS
    SmsService.sendSms(req.params.phoneNum, `IC Code: ${token}`)
      .then(message => {
        res.status(201);
        res.json({ codeForTesting: token, success: true, message: `Verification code sent, messageId is ${message.sid}` });
      })
      .catch(err => {
        console.log('err: ', err);
        res.boom.badRequest(err);
      });
  }

  verifyCode(req, res) {
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

  updateAccount(req, res) {
    // Get the validation result whenever you want; see the Validation Result API for all options!
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.mapped());
      return res.status(422).json({ errors: errors.mapped() });
    }

    JwtService.verifyToken(req.headers.token)
      .then(decoded =>
        // const userFindOne = Promise.promisify(User.findOne);
        // userFindOne({ phone_num: decoded.phoneNum });
        // const findById = Promise.promisify(User.findById);
        // findById(decoded.accountId);
        User.findById(decoded.accountId),
      )
      .then(user => {
        if (!user) {
          throw new Error('JWT validated correctly but the user record is not found');
        } else {
          const u = user;
          if (req.body.password) u.password = PasswordService.cryptPasswordSync(req.body.password);
          if (req.body.display_name) u.display_name = req.body.displayName;
          if (req.body.ethnicity) u.ethnicity = req.body.ethnicity;
          if (req.body.dateOfBirth) u.dateOfBirth = req.body.dateOfBirth;
          if (req.body.gender) u.gender = req.body.gender;
          return u.save();
        }
      }).then(user => {
        // console.log('succesfully saved user info');
        // console.log(user);
        res.status(201).json(user);
      }).catch(jwt.TokenExpiredError, err => {
        res.boom.unauthorized('TokenExpiredError: JWT token expired');
      }).catch(jwt.JsonWebTokenError, err => {
        res.boom.unauthorized(`JsonWebTokenError: ${err.message}`);
      }).catch(err => {
        l.error(err);
        res.status(500).json({ error: err.message });
      });
  }

  login(req, res) {
    // const userFindOne = Promise.promisify(User.findOne);
    // const findOne = userFindOne({ phone_num: req.body.phoneNum });
    const findOne = AccountService.findOnePromise(req.body.phoneNum);
    const comparePassword = findOne.then(user => {
      if (user) {
        return PasswordService.comparePassword(user.password, req.body.password);
      }
      throw new Error('incorrect phone number');
    }).catch(err => {
      res.boom.unauthorized(err.message);
      comparePassword.cancel();
    });

    Promise.all([findOne, comparePassword]).then(([user, compareResult]) => {
      if (compareResult) {
        const token = JwtService.generateToken(req.phoneNum, user._id);
        res.status(201).json({ success: true, token, userId: user._id });
      } else {
        res.boom.unauthorized('incorrect password');
      }
    });
  }
}

export default new Controller();
