import { describe, beforeEach, before, it } from 'mocha';
import populateDB from '../server/api/services/populate.db.service';

const User = require('../server/model/user');
const Sign = require('../server/model/sign');

// Require the dev-dependencies
const chai = require('chai');
const request = require('supertest');
const server = require('../server/index').default;

const expect = chai.expect;
// chai.should();
// chai.use(require('chai-things'));

// Our parent block
describe('Discovery', () => {
  before(done => { // Before the tests we empty the database
    User.remove({}, err => {
      if (!err) {
        addUsers().then(users => { done(); });
      } else {
        done();
      }
    });
  });

  describe('/GET /api/v1/discovery/myAccountId/{myAccountId}', () => {
    it('discover with no filter', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .get(`/api/v1/discovery/myAccountId/${res0.body.accountId}?latitude=43.7659095&longitude=-79.4141207&maxDistance=100000`)
            .end((err, res) => {
              if (err) console.error(err);
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.property('list');
              expect(res.body).to.have.property('totalPages');
              expect(res.body).to.have.property('totalItems');
              expect(res.body).to.have.property('limit');
              expect(res.body).to.have.property('page');

              expect(res.body.totalPages).to.equal(1);
              expect(res.body.totalItems).to.equal(4);
              expect(res.body.limit).to.equal(30);
              expect(res.body.page).to.equal(1);

              expect(res.body.list).to.be.a('array');
              expect(res.body.list).to.have.lengthOf(4);
              expect(res.body.list[0]).to.have.property('displayName');
              expect(res.body.list[0]).to.have.property('accountId');
              expect(res.body.list[0]).to.have.property('ethnicity');
              expect(res.body.list[0]).to.have.property('dateOfBirth');
              expect(res.body.list[0]).to.have.property('gender');
              expect(res.body.list[0]).to.have.property('phoneNum');
              expect(res.body.list[0]).to.have.property('pictureUrl');
              expect(res.body.list[0]).to.have.property('pictureThumbnailUrl');
              expect(res.body.list[0]).to.have.property('description');
              expect(res.body.list[0]).to.have.property('signId');
              expect(res.body.list[0].pictureUrl).to.be.a('array');
              expect(res.body.list[0].pictureThumbnailUrl).to.be.a('array');
              expect(res.body.list[0].signId).to.be.a('array');
              expect(res.body.list[0].signId[0]).to.be.a('object');
              expect(res.body.list[0].signId[0]).to.have.property('signId');
              expect(res.body.list[0].signId[0]).to.have.property('signName');
              expect(res.body.list[0].signId[0]).to.have.property('signIconUrl');
              done();
            });
        });
    });

    it('discover with female gender filter', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .get(`/api/v1/discovery/myAccountId/${res0.body.accountId}?gender=female&latitude=43.7659095&longitude=-79.4141207&maxDistance=100000`)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.property('list');
              expect(res.body).to.have.property('totalPages');
              expect(res.body).to.have.property('totalItems');
              expect(res.body).to.have.property('limit');
              expect(res.body).to.have.property('page');

              expect(res.body.totalPages).to.equal(1);
              expect(res.body.totalItems).to.equal(4);
              expect(res.body.limit).to.equal(30);
              expect(res.body.page).to.equal(1);

              expect(res.body.list).to.be.a('array');
              expect(res.body.list).to.have.lengthOf(4);

              done();
            });
        });
    });

    it('discover with male gender filter', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .get(`/api/v1/discovery/myAccountId/${res0.body.accountId}?gender=male&latitude=43.7659095&longitude=-79.4141207&maxDistance=100000`)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.property('list');
              expect(res.body).to.have.property('totalPages');
              expect(res.body).to.have.property('totalItems');
              expect(res.body).to.have.property('limit');
              expect(res.body).to.have.property('page');

              expect(res.body.totalPages).to.equal(1);
              expect(res.body.totalItems).to.equal(0);
              expect(res.body.limit).to.equal(30);
              expect(res.body.page).to.equal(1);

              expect(res.body.list).to.be.a('array');
              expect(res.body.list).to.have.lengthOf(0);

              done();
            });
        });
    });

    it('discover with min age filter', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .get(`/api/v1/discovery/myAccountId/${res0.body.accountId}?ageMin=23&latitude=43.7659095&longitude=-79.4141207&maxDistance=100000`)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.property('list');
              expect(res.body).to.have.property('totalPages');
              expect(res.body).to.have.property('totalItems');
              expect(res.body).to.have.property('limit');
              expect(res.body).to.have.property('page');

              expect(res.body.totalPages).to.equal(1);
              expect(res.body.totalItems).to.equal(3);
              expect(res.body.limit).to.equal(30);
              expect(res.body.page).to.equal(1);

              expect(res.body.list).to.be.a('array');
              expect(res.body.list).to.have.lengthOf(3);

              done();
            });
        });
    });

    it('discover with max age filter', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .get(`/api/v1/discovery/myAccountId/${res0.body.accountId}?ageMax=23&latitude=43.7659095&longitude=-79.4141207&maxDistance=100000`)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.property('list');
              expect(res.body).to.have.property('totalPages');
              expect(res.body).to.have.property('totalItems');
              expect(res.body).to.have.property('limit');
              expect(res.body).to.have.property('page');

              expect(res.body.totalPages).to.equal(1);
              expect(res.body.totalItems).to.equal(2);
              expect(res.body.limit).to.equal(30);
              expect(res.body.page).to.equal(1);

              expect(res.body.list).to.be.a('array');
              expect(res.body.list).to.have.lengthOf(2);

              done();
            });
        });
    });

    it('discover with min and max age filter', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .get(`/api/v1/discovery/myAccountId/${res0.body.accountId}?ageMin=23&ageMax=23&latitude=43.7659095&longitude=-79.4141207&maxDistance=100000`)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.property('list');
              expect(res.body).to.have.property('totalPages');
              expect(res.body).to.have.property('totalItems');
              expect(res.body).to.have.property('limit');
              expect(res.body).to.have.property('page');

              expect(res.body.totalPages).to.equal(1);
              expect(res.body.totalItems).to.equal(1);
              expect(res.body.limit).to.equal(30);
              expect(res.body.page).to.equal(1);

              expect(res.body.list).to.be.a('array');
              expect(res.body.list).to.have.lengthOf(1);

              done();
            });
        });
    });

    it('discover with ethnicity filter - 1', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .get(`/api/v1/discovery/myAccountId/${res0.body.accountId}?ethnicity=caucasian&latitude=43.7659095&longitude=-79.4141207&maxDistance=100000`)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.property('list');
              expect(res.body).to.have.property('totalPages');
              expect(res.body).to.have.property('totalItems');
              expect(res.body).to.have.property('limit');
              expect(res.body).to.have.property('page');

              expect(res.body.totalPages).to.equal(1);
              expect(res.body.totalItems).to.equal(0);
              expect(res.body.limit).to.equal(30);
              expect(res.body.page).to.equal(1);

              expect(res.body.list).to.be.a('array');
              expect(res.body.list).to.have.lengthOf(0);

              done();
            });
        });
    });

    it('discover with ethnicity filter - 2', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .get(`/api/v1/discovery/myAccountId/${res0.body.accountId}?ethnicity=latin&latitude=43.7659095&longitude=-79.4141207&maxDistance=100000`)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.property('list');
              expect(res.body).to.have.property('totalPages');
              expect(res.body).to.have.property('totalItems');
              expect(res.body).to.have.property('limit');
              expect(res.body).to.have.property('page');

              expect(res.body.totalPages).to.equal(1);
              expect(res.body.totalItems).to.equal(1);
              expect(res.body.limit).to.equal(30);
              expect(res.body.page).to.equal(1);

              expect(res.body.list).to.be.a('array');
              expect(res.body.list).to.have.lengthOf(1);
              expect(res.body.list[0].ethnicity).to.equal('latin');
              done();
            });
        });
    });

    it('discover with sign filter - 1', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          console.log(res0.body);
          request(server)
            .get(`/api/v1/discovery/myAccountId/${res0.body.accountId}?sign=3&latitude=43.7659095&longitude=-79.4141207&maxDistance=100000`)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.property('list');
              expect(res.body).to.have.property('totalPages');
              expect(res.body).to.have.property('totalItems');
              expect(res.body).to.have.property('limit');
              expect(res.body).to.have.property('page');

              expect(res.body.totalPages).to.equal(1);
              expect(res.body.totalItems).to.equal(0);
              expect(res.body.limit).to.equal(30);
              expect(res.body.page).to.equal(1);

              expect(res.body.list).to.be.a('array');
              expect(res.body.list).to.have.lengthOf(0);
              done();
            });
        });
    });

    it('discover with sign filter - 2', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .get(`/api/v1/discovery/myAccountId/${res0.body.accountId}?sign=1-12&latitude=43.7659095&longitude=-79.4141207&maxDistance=100000`)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.property('list');
              expect(res.body).to.have.property('totalPages');
              expect(res.body).to.have.property('totalItems');
              expect(res.body).to.have.property('limit');
              expect(res.body).to.have.property('page');

              expect(res.body.totalPages).to.equal(1);
              expect(res.body.totalItems).to.equal(1);
              expect(res.body.limit).to.equal(30);
              expect(res.body.page).to.equal(1);

              expect(res.body.list).to.be.a('array');
              expect(res.body.list).to.have.lengthOf(1);
              expect(res.body.list[0].displayName).to.equal('Allie');
              done();
            });
        });
    });

    it('discover with sign filter - 3', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .get(`/api/v1/discovery/myAccountId/${res0.body.accountId}?sign=2-3-4-5-6-7-8&latitude=43.7659095&longitude=-79.4141207&maxDistance=100000`)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.property('list');
              expect(res.body).to.have.property('totalPages');
              expect(res.body).to.have.property('totalItems');
              expect(res.body).to.have.property('limit');
              expect(res.body).to.have.property('page');

              expect(res.body.totalPages).to.equal(1);
              expect(res.body.totalItems).to.equal(4);
              expect(res.body.limit).to.equal(30);
              expect(res.body.page).to.equal(1);

              expect(res.body.list).to.be.a('array');
              expect(res.body.list).to.have.lengthOf(4);
              done();
            });
        });
    });

    it('discover with max distance - 1', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .get(`/api/v1/discovery/myAccountId/${res0.body.accountId}?latitude=43.7659095&longitude=-79.4141207&maxDistance=1000`)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.property('list');
              expect(res.body).to.have.property('totalPages');
              expect(res.body).to.have.property('totalItems');
              expect(res.body).to.have.property('limit');
              expect(res.body).to.have.property('page');

              expect(res.body.totalPages).to.equal(1);
              expect(res.body.totalItems).to.equal(1);
              expect(res.body.limit).to.equal(30);
              expect(res.body.page).to.equal(1);

              expect(res.body.list).to.be.a('array');
              expect(res.body.list).to.have.lengthOf(1);

              expect(res.body.list[0]).to.have.property('displayName');
              expect(res.body.list[0].displayName).to.equal('Janice');

              expect(res.body.list[0]).to.have.property('phoneNum');
              expect(res.body.list[0].phoneNum).to.equal('+16471112223');

              expect(res.body.list[0]).to.have.property('gender');
              expect(res.body.list[0].gender).to.equal('female');

              expect(res.body.list[0]).to.have.property('distance');
              expect(res.body.list[0].distance).to.equal(984);

              done();
            });
        });
    });

    it('discover with max distance - 2', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .get(`/api/v1/discovery/myAccountId/${res0.body.accountId}?latitude=43.7659095&longitude=-79.4141207&maxDistance=8000`)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.property('list');
              expect(res.body).to.have.property('totalPages');
              expect(res.body).to.have.property('totalItems');
              expect(res.body).to.have.property('limit');
              expect(res.body).to.have.property('page');

              expect(res.body.totalPages).to.equal(1);
              expect(res.body.totalItems).to.equal(2);
              expect(res.body.limit).to.equal(30);
              expect(res.body.page).to.equal(1);

              expect(res.body.list).to.be.a('array');
              expect(res.body.list).to.have.lengthOf(2);
              done();
            });
        });
    });

    it('discover with max distance - 3', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .get(`/api/v1/discovery/myAccountId/${res0.body.accountId}?latitude=43.7659095&longitude=-79.4141207&maxDistance=100000`)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.property('list');
              expect(res.body).to.have.property('totalPages');
              expect(res.body).to.have.property('totalItems');
              expect(res.body).to.have.property('limit');
              expect(res.body).to.have.property('page');

              expect(res.body.totalPages).to.equal(1);
              expect(res.body.totalItems).to.equal(4);
              expect(res.body.limit).to.equal(30);
              expect(res.body.page).to.equal(1);

              expect(res.body.list).to.be.a('array');
              expect(res.body.list).to.have.lengthOf(4);

              expect(res.body.list[0]).to.have.property('displayName');
              expect(res.body.list[0].displayName).to.equal('Janice');

              expect(res.body.list[0]).to.have.property('distance');
              expect(res.body.list[0].distance).to.equal(984);

              expect(res.body.list[1]).to.have.property('displayName');
              expect(res.body.list[1].displayName).to.equal('Ashley');

              expect(res.body.list[1]).to.have.property('distance');
              expect(res.body.list[1].distance).to.equal(7815);

              expect(res.body.list[2]).to.have.property('displayName');
              expect(res.body.list[2].displayName).to.equal('Heather');

              expect(res.body.list[2]).to.have.property('distance');
              expect(res.body.list[2].distance).to.equal(35554);

              expect(res.body.list[3]).to.have.property('displayName');
              expect(res.body.list[3].displayName).to.equal('Allie');

              expect(res.body.list[3]).to.have.property('distance');
              expect(res.body.list[3].distance).to.equal(77418);
              done();
            });
        });
    });

    it('discover with max distance - 4', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .get(`/api/v1/discovery/myAccountId/${res0.body.accountId}?latitude=43.7659095&longitude=-79.4141207&maxDistance=800`)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.property('list');
              expect(res.body).to.have.property('totalPages');
              expect(res.body).to.have.property('totalItems');
              expect(res.body).to.have.property('limit');
              expect(res.body).to.have.property('page');

              expect(res.body.totalPages).to.equal(1);
              expect(res.body.totalItems).to.equal(0);
              expect(res.body.limit).to.equal(30);
              expect(res.body.page).to.equal(1);

              expect(res.body.list).to.be.a('array');
              expect(res.body.list).to.have.lengthOf(0);
              done();
            });
        });
    });
  });
});

function addUsers() {
  return new Promise((resolve, reject) => {
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
    }).then(users => resolve(users))
      .catch(err => {
        if (err.code === 11000 || err.code === 11001) {
          resolve();
        } else {
          reject();
        }
      });
  });
}
