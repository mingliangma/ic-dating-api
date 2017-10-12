import { describe, beforeEach, before, it } from 'mocha';
import populateDB from '../server/api/services/populate.db.service';

const User = require('../server/model/user');
const Sign = require('../server/model/sign');

// Require the dev-dependencies
const chai = require('chai');
const request = require('supertest');
const server = require('../server/index').default;
const url = require('url');

const expect = chai.expect;
// chai.should();
// chai.use(require('chai-things'));

// Our parent block
describe('Account', () => {
  beforeEach(done => { // Before each test we empty the database
    User.remove({}, err => {
      if (!err) {
        console.log('user collection emptied');
        addUsers().then(() => {
          done();
        }).catch(err1 => console.error(err1));
      } else {
        console.error(err);
        done();
      }
    });
  });

  describe('/GET /api/v1/account/{accountId}', () => {
    it('check get account', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .get(`/api/v1/account/${res0.body.accountId}`)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.have.property('accountId');

              expect(res.body).to.have.property('displayName');
              expect(res.body.displayName).to.equal('Cindy');

              expect(res.body).to.have.property('phoneNum');
              expect(res.body.phoneNum).to.equal('+16471112222');

              expect(res.body).to.have.property('ethnicity');
              expect(res.body.ethnicity).to.equal('caucasian');

              expect(res.body).to.have.property('dateOfBirth');
              expect(res.body.dateOfBirth).to.equal('1993-02-02');

              expect(res.body).to.have.property('gender');
              expect(res.body.gender).to.equal('female');

              expect(res.body).to.have.property('pictureUrl');
              expect(res.body.pictureUrl).to.be.a('Array');

              expect(res.body).to.have.property('pictureThumbnailUrl');
              expect(res.body.pictureThumbnailUrl).to.be.a('Array');

              expect(res.body).to.have.property('originalPictureUrl');
              expect(res.body.originalPictureUrl[0]).to.equal('https://s3.amazonaws.com/ic-dating/profiles/1/beautiful-sexy-woman-with-suspenders-PD7CDDJ.jpg');
              expect(res.body.originalPictureUrl[1]).to.equal('https://s3.amazonaws.com/ic-dating/profiles/1/beautiful-woman-in-sunglasses-PHZVNKU.jpg');
              expect(res.body.originalPictureUrl[2]).to.equal('https://s3.amazonaws.com/ic-dating/profiles/1/beautiful-woman-looking-at-the-sky-PY8W2BD.jpg');

              expect(res.body).to.have.property('signId');
              expect(res.body.signId).to.be.a('Array');

              expect(res.body.signId[0]).to.have.property('signId');
              expect(res.body.signId[0]).to.have.property('signName');
              expect(res.body.signId[0]).to.have.property('signIconUrl');
              expect(res.body.signId[0].signId).to.equal(1);
              expect(res.body.signId[0].signName).to.equal('clubbing');
              expect(res.body.signId[0].signIconUrl).to.equal('https://s3.amazonaws.com/ic-dating/signs/clubbing_a.png');

              expect(res.body.signId[1]).to.have.property('signId');
              expect(res.body.signId[1]).to.have.property('signName');
              expect(res.body.signId[1]).to.have.property('signIconUrl');
              expect(res.body.signId[1].signId).to.equal(2);
              expect(res.body.signId[1].signName).to.equal('coffee');
              expect(res.body.signId[1].signIconUrl).to.equal('https://s3.amazonaws.com/ic-dating/signs/coffee_a.png');

              expect(res.body.signId[2]).to.have.property('signId');
              expect(res.body.signId[2]).to.have.property('signName');
              expect(res.body.signId[2]).to.have.property('signIconUrl');
              expect(res.body.signId[2].signId).to.equal(3);
              expect(res.body.signId[2].signName).to.equal('eat');
              expect(res.body.signId[2].signIconUrl).to.equal('https://s3.amazonaws.com/ic-dating/signs/eat_a.png');

              done();
            });
        });
    });
  });

  describe('/POST /api/v1/account/{accountId}', () => {
    it('check update account - Signs', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .put(`/api/v1/account/${res0.body.accountId}`)
            .set({ token: res0.body.token })
            .send({ signId: [4, 5, 6] })
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.have.property('accountId');

              expect(res.body).to.have.property('displayName');
              expect(res.body.displayName).to.equal('Cindy');

              expect(res.body).to.have.property('phoneNum');
              expect(res.body.phoneNum).to.equal('+16471112222');

              expect(res.body).to.have.property('ethnicity');
              expect(res.body.ethnicity).to.equal('caucasian');

              expect(res.body).to.have.property('dateOfBirth');
              expect(res.body.dateOfBirth).to.equal('1993-02-02');

              expect(res.body).to.have.property('gender');
              expect(res.body.gender).to.equal('female');

              expect(res.body).to.have.property('pictureUrl');
              expect(res.body.pictureUrl).to.be.a('Array');

              expect(res.body).to.have.property('pictureThumbnailUrl');
              expect(res.body.pictureThumbnailUrl).to.be.a('Array');

              expect(res.body).to.have.property('signId');
              expect(res.body.signId).to.be.a('Array');
              expect(res.body.signId).to.have.lengthOf(3);

              expect(res.body.signId[0]).to.have.property('signId');
              expect(res.body.signId[0]).to.have.property('signName');
              expect(res.body.signId[0]).to.have.property('signIconUrl');
              expect(res.body.signId[0].signId).to.equal(4);
              expect(res.body.signId[0].signName).to.equal('excercise');
              expect(res.body.signId[0].signIconUrl).to.equal('https://s3.amazonaws.com/ic-dating/signs/excercise_a.png');

              expect(res.body.signId[1]).to.have.property('signId');
              expect(res.body.signId[1]).to.have.property('signName');
              expect(res.body.signId[1]).to.have.property('signIconUrl');
              expect(res.body.signId[1].signId).to.equal(5);
              expect(res.body.signId[1].signName).to.equal('gay');
              expect(res.body.signId[1].signIconUrl).to.equal('https://s3.amazonaws.com/ic-dating/signs/gay_a.png');

              expect(res.body.signId[2]).to.have.property('signId');
              expect(res.body.signId[2]).to.have.property('signName');
              expect(res.body.signId[2]).to.have.property('signIconUrl');
              expect(res.body.signId[2].signId).to.equal(6);
              expect(res.body.signId[2].signName).to.equal('jog');
              expect(res.body.signId[2].signIconUrl).to.equal('https://s3.amazonaws.com/ic-dating/signs/jog_a.png');

              request(server)
                .get(`/api/v1/account/${res0.body.accountId}`)
                .end((err1, res1) => {
                  expect(res1.statusCode).to.equal(200);
                  expect(res.body.signId).to.have.lengthOf(3);
                  expect(res.body.signId[0]).to.have.property('signId');
                  expect(res.body.signId[0]).to.have.property('signName');
                  expect(res.body.signId[0]).to.have.property('signIconUrl');
                  expect(res.body.signId[0].signId).to.equal(4);
                  expect(res.body.signId[0].signName).to.equal('excercise');
                  expect(res.body.signId[0].signIconUrl).to.equal('https://s3.amazonaws.com/ic-dating/signs/excercise_a.png');

                  expect(res.body.signId[1]).to.have.property('signId');
                  expect(res.body.signId[1]).to.have.property('signName');
                  expect(res.body.signId[1]).to.have.property('signIconUrl');
                  expect(res.body.signId[1].signId).to.equal(5);
                  expect(res.body.signId[1].signName).to.equal('gay');
                  expect(res.body.signId[1].signIconUrl).to.equal('https://s3.amazonaws.com/ic-dating/signs/gay_a.png');

                  expect(res.body.signId[2]).to.have.property('signId');
                  expect(res.body.signId[2]).to.have.property('signName');
                  expect(res.body.signId[2]).to.have.property('signIconUrl');
                  expect(res.body.signId[2].signId).to.equal(6);
                  expect(res.body.signId[2].signName).to.equal('jog');
                  expect(res.body.signId[2].signIconUrl).to.equal('https://s3.amazonaws.com/ic-dating/signs/jog_a.png');
                  done();
                });
            });
        });
    });

    it('check update account - description', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .put(`/api/v1/account/${res0.body.accountId}`)
            .set({ token: res0.body.token })
            .send({ description: 'I am an entrepreneur' })
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.have.property('accountId');

              expect(res.body).to.have.property('displayName');
              expect(res.body.displayName).to.equal('Cindy');

              expect(res.body).to.have.property('description');
              expect(res.body.description).to.equal('I am an entrepreneur');

              done();
            });
        });
    });


    it('check update account - pictureUrl', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');


          request(server)
            .put(`/api/v1/account/${res0.body.accountId}`)
            .set({ token: res0.body.token })
            .send({ pictureUrl: ['https://s3.amazonaws.com/ic-dating/profiles/2/beautiful-woman-PGKY5V2.jpg'] })
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.have.property('accountId');

              expect(res.body).to.have.property('displayName');
              expect(res.body.displayName).to.equal('Cindy');

              expect(res.body).to.have.property('pictureUrl');
              expect(res.body.pictureUrl).to.have.lengthOf(1);
              expect(res.body.pictureUrl[0]).to.equal('https://s3.amazonaws.com/ic-dating/profiles/2/resized/large/beautiful-woman-PGKY5V2.jpg');

              done();
            });
        });
    });

    it('check update account - description and empty picture URL', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .put(`/api/v1/account/${res0.body.accountId}`)
            .set({ token: res0.body.token })
            .send({ description: 'I am an entrepreneur', pictureUrl: [] })
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.have.property('accountId');

              expect(res.body).to.have.property('displayName');
              expect(res.body.displayName).to.equal('Cindy');

              expect(res.body).to.have.property('description');
              expect(res.body.description).to.equal('I am an entrepreneur');

              done();
            });
        });
    });

    it('check update account - description and empty signs', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');
          request(server)
            .put(`/api/v1/account/${res0.body.accountId}`)
            .set({ token: res0.body.token })
            .send({ description: 'I am an entrepreneur', signId: [] })
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.have.property('accountId');

              expect(res.body).to.have.property('displayName');
              expect(res.body.displayName).to.equal('Cindy');

              expect(res.body).to.have.property('description');
              expect(res.body.description).to.equal('I am an entrepreneur');

              done();
            });
        });
    });
  });

  describe('Post/Delete /api/v1/account/{accountId}/image', () => {
    it('check add picture url', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');

          request(server)
            .put(`/api/v1/account/${res0.body.accountId}/image`)
            .set({ token: res0.body.token })
            .send({ pictureUrl: 'https://s3.amazonaws.com/ic-dating/profiles/2/beautiful-woman-PGKY5V2.jpg' })
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);

              expect(res.body).to.have.property('pictureUrl');
              expect(res.body.pictureUrl).to.have.lengthOf(4);
              expect(res.body.pictureUrl[3]).to.equal('https://s3.amazonaws.com/ic-dating/profiles/2/resized/large/beautiful-woman-PGKY5V2.jpg');

              done();
            });
        });
    });

    it('check add 3 picture url', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');

          request(server)
            .put(`/api/v1/account/${res0.body.accountId}/image`)
            .set({ token: res0.body.token })
            .send({ pictureUrl: 'https://s3.amazonaws.com/ic-dating/profiles/2/beautiful-woman-PGKY5V2.jpg' })
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);

              request(server)
                .put(`/api/v1/account/${res0.body.accountId}/image`)
                .set({ token: res0.body.token })
                .send({ pictureUrl: 'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-274645.jpg' })
                .end((err1, res1) => {
                  expect(res1.statusCode).to.equal(200);

                  request(server)
                    .put(`/api/v1/account/${res0.body.accountId}/image`)
                    .set({ token: res0.body.token })
                    .send({ pictureUrl: 'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-289225.jpg' })
                    .end((err2, res2) => {
                      expect(res2.statusCode).to.equal(200);

                      expect(res2.body).to.have.property('pictureUrl');
                      expect(res2.body.pictureUrl).to.have.lengthOf(6);
                      expect(res2.body.pictureUrl[3]).to.equal('https://s3.amazonaws.com/ic-dating/profiles/2/resized/large/beautiful-woman-PGKY5V2.jpg');
                      expect(res2.body.pictureUrl[4]).to.equal('https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-274645.jpg');
                      expect(res2.body.pictureUrl[5]).to.equal('https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-289225.jpg');
                      done();
                    });
                });
            });
        });
    });

    it('check delete picture url - 1', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');

          request(server)
            .delete(`/api/v1/account/${res0.body.accountId}/image`)
            .set({ token: res0.body.token })
            .send({ pictureUrl: 'https://s3.amazonaws.com/ic-dating/profiles/2/beautiful-woman-PGKY5V2.jpg' })
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);

              expect(res.body).to.have.property('pictureUrl');
              expect(res.body.pictureUrl).to.have.lengthOf(3);

              done();
            });
        });
    });

    it('check delete picture url - 2', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');

          request(server)
            .delete(`/api/v1/account/${res0.body.accountId}/image`)
            .set({ token: res0.body.token })
            .send({ pictureUrl: 'https://s3.amazonaws.com/ic-dating/profiles/1/beautiful-woman-in-sunglasses-PHZVNKU.jpg' })
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);

              expect(res.body).to.have.property('pictureUrl');
              expect(res.body.pictureUrl).to.have.lengthOf(2);
              expect(res.body.pictureUrl[0]).to.equal('https://s3.amazonaws.com/ic-dating/profiles/1/resized/large/beautiful-sexy-woman-with-suspenders-PD7CDDJ.jpg');
              expect(res.body.pictureUrl[1]).to.equal('https://s3.amazonaws.com/ic-dating/profiles/1/resized/large/beautiful-woman-looking-at-the-sky-PY8W2BD.jpg');

              done();
            });
        });
    });
  });

  describe('GET /account/{accountId}/image/gen-presigned-url', () => {
    it('check generate presigned url', done => {
      request(server)
        .post('/api/v1/account/login')
        .send({ phoneNum: '+16471112222', password: '55555555' })
        .end((err0, res0) => {
          expect(res0.statusCode).to.equal(201);
          expect(res0.body).to.have.property('accountId');

          request(server)
            .get(`/api/v1/account/${res0.body.accountId}/image/gen-presigned-url`)
            .set({ token: res0.body.token })
            .query({ fileName: 'test.png', fileType: 'image/png' })
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);

              expect(res.body).to.have.property('signedURL');

              const q = url.parse(res.body.signedURL, true);
              expect(q.host).to.equal('ic-dating.s3.amazonaws.com');
              expect(q.pathname).to.equal(`/profiles/${res0.body.accountId}/test.png`);
              expect(q.query).to.be.a('object');
              expect(q.query).to.have.property('AWSAccessKeyId');
              expect(q.query).to.have.property('Content-Type');
              expect(q.query).to.have.property('Expires');
              expect(q.query).to.have.property('Signature');
              expect(res.body).to.have.property('fileLink');

              expect(res.body.fileLink).to.equal(
                `https://s3.amazonaws.com/ic-dating/profiles/${res0.body.accountId}/test.png`,
              );

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
