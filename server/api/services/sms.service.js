const Twilio = require('twilio');
const Promise = require('bluebird');

const client = new Twilio(process.env.TWILLIO_ACCOUNT_ID, process.env.TWILLIO_AUTH_TOKEN);

module.exports.sendSms = (to, body) => new Promise(
  ((resolve, reject) => {
    client.messages.create({ to, from: process.env.MY_PHONE_NUM, body }, (err, message) => {
      if (err) {
        reject(err);
      }
      resolve(message);
    });
  }),
);

