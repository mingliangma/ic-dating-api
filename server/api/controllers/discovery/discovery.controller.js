import AccountService from '../../services/account.service';

import User from '../../../model/user';
import Hide from '../../../model/hide';
import Sign from '../../../model/sign';
import ResponseService from '../../services/response.service';

const moment = require('moment');
const mongoose = require('mongoose');

function generateListQuery(reqQuery, myAccountId, hides) {
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

    const hideIds = [myAccountId];
    if (hides) {
      hides.forEach(hide => {
        hideIds.push(hide.receiver);
      });
    }
    query._id = { $nin: hideIds };
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

function findHide(query) {
  return new Promise((resolve, reject) => {
    Hide.find(query, (err, hides) => {
      if (hides) {
        resolve(hides);
      } else if (err) {
        reject(err);
      } else {
        resolve(null);
      }
    });
  });
}

export class Controller {
  hideUser(req, res) {
    const initiatorAccountId = req.body.initiatorAccountId;
    const receiverAccountId = req.body.receiverAccountId;

    // check if initiatorAccountId and receiverAccountId exist
  }

  discover(req, res) {
    // console.log(req.query);

    const options = { page: 1, limit: 30, populate: 'sign' };

    if (req.query.page && !isNaN(req.query.page)) options.page = parseInt(req.query.page, 10);
    if (req.query.limit && !isNaN(req.query.limit)) options.limit = parseInt(req.query.limit, 10);

    const hideQuery = { initiator: mongoose.Types.ObjectId(req.params.myAccountId),
      created_at: { $gte: moment().subtract(7, 'days').calendar(),
      } };

    findHide(hideQuery)
      .then(hides => generateListQuery(req.query, req.params.myAccountId, hides))
      .then(query => {
        console.log('query: ', query);
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
}

export default new Controller();
