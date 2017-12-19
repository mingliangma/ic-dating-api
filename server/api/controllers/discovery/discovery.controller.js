import AccountService from '../../services/account.service';

import User from '../../../model/user';
import Hide from '../../../model/hide';
import Sign from '../../../model/sign';
import ResponseService from '../../services/response.service';
import PopulateService from '../../services/populate.db.service';

const moment = require('moment');
const mongoose = require('mongoose');

function generateListQuery(reqQuery, myAccountId, hides) {
  // console.log('reqQuery: ',reqQuery);
  return new Promise((resolve, reject) => {
    const query = {};
    query.display_name = { $exists: true };
    query.picture_url = { $exists: true };
    query.$where = 'this.picture_url.length>0';

    if (reqQuery.maxDistance) {
      const maxDistance = reqQuery.maxDistance || 2000;
      query.geometry = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [reqQuery.longitude, reqQuery.latitude],
          },
          $maxDistance: maxDistance,
          $minDistance: 0,
        },
      };
    }

    if (reqQuery.gender && reqQuery.gender !== 'both') query.gender = reqQuery.gender;
    if (reqQuery.ethnicity) query.ethnicity = reqQuery.ethnicity;
    if (reqQuery.ageMax || reqQuery.ageMin) {
      const dateQuery = { };

      if (reqQuery.ageMax) {
        const dateString = moment().subtract(reqQuery.ageMax + 1, 'years');
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

          let receiver;
          let initiator;
          (users[0]._id.toString() === initiatorAccountId) ? initiator = users[0] : receiver = users[0];
          (users[1]._id.toString() === receiverAccountId) ? receiver = users[1] : initiator = users[1];

          console.log('initiator: ', initiator);
          console.log('receiver: ', receiver);
          return new Hide({
            initiator,
            receiver,
            created_at: nowDate,
          }).save((err, hide) => {
            console.log('err: ', err);
            console.log('hide: ', hide);
          });
        }else{
          console.log('users: ',users);
        }
      }).then(hide => {
        res.status(201).json({ success: true });
      }).catch(err => {
        res.status(400).json(err);
      });
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
            responseArray.push(ResponseService.generateAccountResponse(result.docs[i], req.query));
          }

          const results = {
            list: responseArray,
            totalPages: (Math.ceil(result.total / result.limit) === 0) ?
              1 : Math.ceil(result.total / result.limit),
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


  preview(req, res) {
    console.log('preview : ');
    res.status(200).json(PopulateService.previewResponse());
  }
}

export default new Controller();
