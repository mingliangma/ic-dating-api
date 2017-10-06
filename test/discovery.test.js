import { describe, beforeEach, it } from 'mocha';
import populateDB from '../server/api/services/populate.db.service';

const User = require('../server/model/user');
const Sign = require('../server/model/sign');

// Require the dev-dependencies
const chai = require('chai');
const request = require('supertest');
const server = require('../server/index').default;

const expect = chai.expect;

// Our parent block
describe('User', () => {
  beforeEach(done => { // Before each test we empty the database
    User.remove({}, err => {
      if (!err) {
        addUsers().then(() => { done(); });
      } else {
        done();
      }
    });
  });

  describe('/GET /api/v1/account/list', () => {
    it('it should GET zero accounts', done => {
      request(server)
        .get('/api/v1/account/list')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('list');
          expect(res.body).to.have.property('totalPages');
          expect(res.body).to.have.property('totalItems');
          expect(res.body).to.have.property('limit');
          expect(res.body).to.have.property('page');

          expect(res.body.list).to.be.a('array');
          expect(res.body.list).to.have.lengthOf(5);
          // expect(res.body.list).to.all.have.property('display_name');
          // expect(res.body.list).to.include({display_name: 'Allie'});
          done();
        });
    });
  });
});

function addUsers() {
  return new Promise((resolve,reject) => {
    const signs = populateDB.prepareSignsPromise();

    Promise.all(signs).catch(err => {
      if (err.code === 11000 || err.code === 11001) {
        return Sign.find({});
      }
    }).then(results => {
      const signMap = new Map();
      results.forEach(sign => {
        signMap.set(sign.sign_id, sign);
      });

      const users = [];
      populateDB.populatePresetUsers(users, signMap);
      return Promise.all(users);
    }).then(() => resolve())
      .catch(err => {
        if (err.code === 11000 || err.code === 11001) {
          resolve();
        }else{
          reject();
        }
      });
  });
}
