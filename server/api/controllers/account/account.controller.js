/* eslint-disable newline-per-chained-call,consistent-return */
import AccountService from '../../services/account.service';
import SmsService from '../../services/sms.service';
import OtpService from '../../services/otp.service';
import JwtService from '../../services/jwt.service';
import AwsService from '../../services/aws.service';
import PasswordService from '../../services/password.service';
import l from '../../../common/logger';
import User from '../../../model/user';
import Sign from '../../../model/sign';
// get our mongoose model
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');
const dateFormat = require('dateformat');
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

function generateAccountResponse(user) {
  let response = {};
  const signResponse = [];
  if (user) {
    if (user.sign.length > 0) {
      for (let i = 0; i < user.sign.length; i++) {
        // console.info(user.sign[0]);
        signResponse.push({
          signId: user.sign[i].sign_id,
          signName: user.sign[i].sign_name,
          signIconUrl: user.sign[i].sign_icon_url,
        });
      }
    }

    const pictureThumbnailUrlArray = [];
    const pictureUrlArray = [];
    if (user.picture_url.length > 0) {
      for (let i = 0; i < user.picture_url.length; i++) {
        const pictureUrl = user.picture_url[i];
        const pictureThumbnailUrl = `${pictureUrl.substring(0, pictureUrl.lastIndexOf('/'))}/resized/cropped-to-square${
          pictureUrl.substring(pictureUrl.lastIndexOf('/'))}`;
        const pictureMediumUrl = `${pictureUrl.substring(0, pictureUrl.lastIndexOf('/'))}/reduced${
          pictureUrl.substring(pictureUrl.lastIndexOf('/'))}`;

        pictureThumbnailUrlArray.push(pictureThumbnailUrl);
        pictureUrlArray.push(pictureMediumUrl);
      }
    }

    response = {
      accountId: user._id.toString(),
      displayName: user.display_name,
      ethnicity: user.ethnicity,
      dateOfBirth: dateFormat(user.date_of_birth, 'yyyy-mm-dd'),
      gender: user.gender,
      phoneNum: user.phone_num,
      pictureUrl: pictureUrlArray,
      pictureThumbnailUrl: pictureThumbnailUrlArray,
      description: user.description,
      signId: signResponse,
    };
  }
  return response;
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
          res.status(200).json(generateAccountResponse(u));
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
    //
    // l.debug(req.params.phoneNum);
    // l.debug(req.phoneNum);
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
          return u.save();
        }
      }).then(u => {
        res.status(201).json(generateAccountResponse(u));
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

        user.picture_url.push(req.body.pictureUrl);
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

  removePhoto(req, res) {
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
            user.picture_url.splice(i, i + 1);
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
          return u.save();
        }

        if (!result) {
          throw new UserNotFoundError();
        } else {
          const u = result;
          if (req.body.description) u.description = req.body.description;
          if (req.body.pictureUrl) u.picture_url = req.body.pictureUrl;
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
    console.log(parseInt(req.query.page, 1));

    let page = 1;
    let limit = 10;

    if (req.query.page && isNaN(req.query.page)) page = parseInt(req.query.page, 10)
    if (req.query.limit && isNaN(req.query.limit)) limit = parseInt(req.query.limit, 10)

    User.paginate({}, { page, limit, populate: 'sign' }, (err, result) => {
      if (err) {
        return res.status(200).json(err);
      }

      const responseArray = [];
      for (let i = 0; i < result.docs.length; i++) {
        responseArray.push(generateAccountResponse(result.docs[i]));
      }
      const results = {
        list: responseArray,
        totalPages: result.total,
        limit: result.limit,
        page: result.page,
      };
      res.status(200).json(results);
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
}


export default new Controller();
