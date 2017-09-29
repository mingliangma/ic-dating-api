import l from '../../common/logger';
import User from '../../model/user';

const Promise = require('bluebird');

class AccountService {
  me() {
    const result = {
      accountId: '1dfasdf1',
      displayName: 'Ming',
      ethnicity: 'Asian',
      dateOfBirth: '1988-11-1',
      gender: 'female',
      distance: 5,
      pictures: [
        {
          url: 'https://scontent-ort2-1.xx.fbcdn.net/v/t1.0-9/1601455_10201728349473724_757186058_n.jpg?oh=23097799eabbb1bd04cabd17a48f1023&oe=5A4B8178',
        },
      ],
      signs: [
        {
          signId: 0,
          signName: 'money',
          signAvatarUrl: 'https://image.flaticon.com/icons/png/128/189/189093.png',
          order: 0,
        },
      ],
    };
    return result;
  }

  createAccount(phoneNum) {
    return new Promise((resolve, reject) => {
      // create a user
      const u = new User({
        phone_num: phoneNum,
      });

      // save the user
      u.save((err, user) => {
        if (!err) {
          resolve(user);
        } else {
          reject(err);
        }
      });
    });
  }

  updateAccount(userInfo) {
    return new Promise((resolve, reject) => {
      const findById = Promise.promisify(User.findById);

      findById(userInfo.accountId)
        .then(user => {
          if (!user) {
            console.log('user not found');
            throw new Error('user not found');
          } else {
            console.log('11111');
            const u = user;
            if (userInfo.password) u.password = userInfo.password;
            if (userInfo.display_name) u.display_name = userInfo.displayName;
            if (userInfo.ethnicity) u.ethnicity = userInfo.ethnicity;
            if (userInfo.dateOfBirth) u.dateOfBirth = userInfo.dateOfBirth;
            if (userInfo.gender) u.gender = userInfo.gender;
            return u.save();
          }
        })
        .then(user => {
          console.log('succesfully saved user info');
          resolve(user);
        })
        .catch(err => {
          console.log('save error', err.message);
          reject(err);
        });
    });
  }

  findOnePromise(phoneNum) {
    return new Promise((resolve, reject) => {
      User.findOne({ phone_num: phoneNum }, (err, user) => {
        if (user) {
          resolve(user);
        } else if (err) {
          reject(err);
        } else {
          resolve(null);
        }
      });
    });
  }

  findOneByIdPromise(accountId) {
    return new Promise((resolve, reject) => {
      User.findById(accountId, (err, user) => {
        if (user) {
          resolve(user);
        } else if (err) {
          reject(err);
        } else {
          resolve(null);
        }
      });
    });
  }

  accountExist(phoneNum) {
    return new Promise(resolve => {
      User.findOne({ phone_num: phoneNum }, (err, user) => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  accountExistById(accountId) {
    console.log('accountExistById():accountId: ', accountId);

    return new Promise((resolve, reject) => {
      User.findById(accountId, (err, user) => {
        if (user) {
          resolve(true);
        } else if (err) {
          reject(err);
        } else {
          resolve(false);
        }
      });
    });
  }
}

export default new AccountService();
