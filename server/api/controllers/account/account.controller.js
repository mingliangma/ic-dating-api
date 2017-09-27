/* eslint-disable newline-per-chained-call,consistent-return */
import AccountService from '../../services/account.service';
import SmsService from '../../services/sms.service';
import OtpService from '../../services/otp.service';
import JwtService from '../../services/jwt.service';
import PasswordService from '../../services/password.service';
import l from '../../../common/logger';
import User from '../../../model/user';// get our mongoose model

const jwt = require('jsonwebtoken');
const Promise = require('bluebird');
const aws = require('aws-sdk');
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
      .then(decoded => {
        l.debug(decoded);
        return User.findOne({ phone_num: decoded.phoneNum });
      })
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
    //
    // l.debug(req.params.phoneNum);
    // l.debug(req.phoneNum);
    // check if account already created
    const p = AccountService.accountExist(req.params.phoneNum)
      .then(isAccountExist => {
        if (isAccountExist && !req.query.disablePasswordLogin) {
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
        const token = JwtService.generateToken(req.body.phoneNum, user._id);
        res.status(201).json({ success: true, token, userId: user._id });
      } else {
        res.boom.unauthorized('incorrect password');
      }
    });
  }

  list(req, res) {
    User.find({}, (err, users) => {
      console.log(users);
      res.status(200).json(users);
    });
  }

  imageUpload(req, res, next) {
    aws.config.update({ accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_KEY });

    console.log('S3_BUCKET: ', process.env.S3_BUCKET);
    console.log('file_name: ', req.query.file_name);

    const s3 = new aws.S3();
    const options = {
      Bucket: process.env.S3_BUCKET,
      Key: req.query.file_name,
      Expires: 600,
      ContentType: 'image/png',
      ACL: 'public-read',
    };

    s3.getSignedUrl('putObject', options, (err, data) => {
      if (err) return res.send('Error with S3');
      console.log('signed_url: ', data);
      res.json({
        signed_request: data,
        url: `https://s3.amazonaws.com/${process.env.S3_BUCKET}/${req.query.file_name}`,
      });
    });
  }


  generatePresignedURL(req, res, next) {
    aws.config.update({ accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_KEY });

    console.log('S3_BUCKET: ', process.env.S3_BUCKE);
    console.log('file_name: ', req.query.file_name);

    const s3 = new aws.S3();
    const options = {
      Bucket: process.env.S3_BUCKET,
      Key: req.query.file_name,
      Expires: 600,
    };

    s3.getSignedUrl('getObject', options, (err, data) => {
      if (err) return res.send('Error with S3');
      console.log('The URL is', data);
      res.json({
        signed_request: data,
        url: `https://s3.amazonaws.com/${process.env.S3_BUCKET}/${req.query.file_name}`,
      });
    });
  }
}


export default new Controller();
