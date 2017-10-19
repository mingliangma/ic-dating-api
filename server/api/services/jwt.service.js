const Promise = require('bluebird');
const firebaseAdmin = require('firebase-admin');

import l from '../../common/logger';

// module.exports.generateToken = (phoneNum, accountId) => {
//   l.debug('phoneNum: ', phoneNum, ' accountId: ', accountId);
//   const tokenData = {
//     phoneNum,
//     accountId,
//   };
//   return jwt.sign(tokenData, process.env.SECRET);
// };
//
// module.exports.verifyToken = token => new Promise(
//   ((resolve, reject) => {
//     jwt.verify(token, process.env.SECRET, (err, decoded) => {
//       if (err) {
//         reject(err);
//       }
//       resolve(decoded);
//     });
//   }),
// );

module.exports.generateFirebaseCustomToken = (phoneNum, accountId) => {
  console.log('generateFirebaseCustomToken()::accountId: ', accountId);
  return Promise.resolve(firebaseAdmin.auth().createCustomToken(accountId.toString(), { phoneNum }));
};

module.exports.verifyFirebaseIDToken = idToken => {
  console.log('verifyFirebaseIDToken()::idToken:', idToken);
  return Promise.resolve(firebaseAdmin.auth().verifyIdToken(idToken));
};
