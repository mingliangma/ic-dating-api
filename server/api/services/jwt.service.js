const jwt = require('jsonwebtoken');
const Promise = require('bluebird');
import l from '../../common/logger';

module.exports.generateToken = (phoneNum, accountId) => {
  l.debug('phoneNum: ', phoneNum, ' accountId: ', accountId);
  const tokenData = {
    phoneNum,
    accountId,
  };
  return jwt.sign(tokenData, process.env.SECRET);
};

// module.exports.verifyToken = function (token) {
//   const decoded = jwt.verify(token, process.env.SECRET);
//   console.log(decoded);
// };

module.exports.verifyToken = token => new Promise(
  ((resolve, reject) => {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  }),
);
