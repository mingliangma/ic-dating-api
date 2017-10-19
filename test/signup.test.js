import { describe, beforeEach, it } from 'mocha';

const User = require('../server/model/user');
const Sign = require('../server/model/sign');

// Require the dev-dependencies
const chai = require('chai');
const request = require('supertest');
const server = require('../server/index').default;
const firebase = require('firebase');

const expect = chai.expect;

// Our parent block
describe('Sign Up Process', () => {
  beforeEach(done => { // Before each test we empty the database
    User.remove({}, err => {
      done();
    });
  });

  describe('/POST account/verify/phone', () => {
    it('it should create a new account and send a verfication code', done => {
      request(server)
        .post('/api/v1/account/verify/phone/+6475806776')
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Bad Request');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('To number: +6475806776, is not a mobile number');
          done();
        });
    });

    it('it should send a verfication code', done => {
      request(server)
        .post('/api/v1/account/verify/phone/+16475806776?disableSMS=true')
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('success');
          expect(res.body).to.have.property('codeForTesting');
          expect(res.body.codeForTesting).to.be.a('string');
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    // it('it should send a verfication code', done => {
    //   request(server)
    //     .post('/api/v1/account/verify/phone/+16475806776')
    //     .end((err, res) => {
    //       expect(res.statusCode).to.equal(201);
    //       expect(res.body).to.be.a('object');
    //       expect(res.body).to.have.property('success');
    //       expect(res.body).to.have.property('codeForTesting');
    //       expect(res.body.codeForTesting).to.be.a('string');
    //       expect(res.body.success).to.equal(true);
    //       done();
    //     });
    // });
  });

  describe('/POST account/verify/phone/{phoneNum}/code/{code}', () => {
    it('verify code', done => {
      request(server)
        .post('/api/v1/account/verify/phone/+16475806776?disableSMS=true')
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('codeForTesting');
          expect(res.body.codeForTesting).to.be.a('string');
          expect(res.body.success).to.equal(true);

          request(server)
            .post(`/api/v1/account/verify/phone/+16475806776/code/${res.body.codeForTesting}`)
            .end((err1, res1) => {
              console.log(res1.body);
              expect(res1.statusCode).to.equal(201);
              expect(res1.body).to.have.property('token');
              expect(res1.body.token).to.be.a('string');
              expect(res1.body.token).to.not.equal('');
              expect(res1.body).to.have.property('accountId');
              done();
            });
        });
    });

    it('verify code - user already exists', done => {
      request(server)
        .post('/api/v1/account/verify/phone/+16475806776?disableSMS=true')
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('codeForTesting');
          expect(res.body.codeForTesting).to.be.a('string');
          expect(res.body.success).to.equal(true);

          request(server)
            .post(`/api/v1/account/verify/phone/+16475806776/code/${res.body.codeForTesting}`)
            .end((err1, res1) => {
              request(server)
                .post(`/api/v1/account/verify/phone/+16475806776/code/${res.body.codeForTesting}`)
                .end((err2, res2) => {
                  console.log(res1.body);
                  expect(res2.statusCode).to.equal(201);
                  expect(res2.body).to.have.property('token');
                  expect(res2.body.token).to.be.a('string');
                  expect(res2.body.token).to.not.equal('');
                  expect(res2.body).to.have.property('accountId');
                  done();
                });
            });
        });
    });

    it('verify code - expect fail', done => {
      request(server)
        .post('/api/v1/account/verify/phone/+16475806776?disableSMS=true')
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('codeForTesting');
          expect(res.body.codeForTesting).to.be.a('string');
          expect(res.body.success).to.equal(true);

          request(server)
            .post('/api/v1/account/verify/phone/+16475806776/code/111')
            .end((err1, res1) => {
              console.log('res.body: ', res1.body);
              expect(res1.statusCode).to.equal(401);
              expect(res1.body).to.have.property('message');
              expect(res1.body.message).to.equal('invalid verfication code');
              done();
            });
        });
    });
  });

  describe('/PUT account - init account', () => {
    it('init account', done => {
      request(server)
        .post('/api/v1/account/verify/phone/+16475806776?disableSMS=true')
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('codeForTesting');
          expect(res.body.codeForTesting).to.be.a('string');
          expect(res.body.success).to.equal(true);

          request(server)
            .post(`/api/v1/account/verify/phone/+16475806776/code/${res.body.codeForTesting}`)
            .end((err1, res1) => {
              expect(res1.statusCode).to.equal(201);
              expect(res1.body).to.have.property('token');

              getIDToken(res1.body.token).then(idToken => {
                request(server)
                  .put('/api/v1/account')
                  .set('token', idToken)
                  .send({
                    password: '88888888',
                    displayName: 'Mingliang Ma',
                    ethnicity: 'asian',
                    dateOfBirth: '1987-11-02',
                    gender: 'male',
                  })
                  .end((err2, res2) => {
                    if (err2) console.error(err2);
                    if (res2.statusCode !== 201) console.error(res2.body);
                    expect(res2.statusCode).to.equal(201);
                    expect(res2.body).to.have.property('accountId');

                    expect(res2.body).to.have.property('displayName');
                    expect(res2.body.displayName).to.equal('Mingliang Ma');

                    expect(res2.body).to.have.property('phoneNum');
                    expect(res2.body.phoneNum).to.equal('+16475806776');

                    expect(res2.body).to.have.property('ethnicity');
                    expect(res2.body.ethnicity).to.equal('asian');

                    expect(res2.body).to.have.property('dateOfBirth');
                    expect(res2.body.dateOfBirth).to.equal('1987-11-02');

                    expect(res2.body).to.have.property('gender');
                    expect(res2.body.gender).to.equal('male');

                    expect(res2.body).to.have.property('pictureUrl');
                    expect(res2.body.pictureUrl).to.be.a('Array');

                    expect(res2.body).to.have.property('pictureThumbnailUrl');
                    expect(res2.body.pictureThumbnailUrl).to.be.a('Array');

                    expect(res2.body).to.have.property('signId');
                    expect(res2.body.signId).to.be.a('Array');

                    expect(res2.body).to.not.have.property('distance');

                    done();
                  });
              });
            });
        });
    });
  });

  describe('/PUT account/login', () => {
    it('login', done => {
      request(server)
        .post('/api/v1/account/verify/phone/+16475806776?disableSMS=true')
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('codeForTesting');
          expect(res.body.codeForTesting).to.be.a('string');
          expect(res.body.success).to.equal(true);

          request(server)
            .post(`/api/v1/account/verify/phone/+16475806776/code/${res.body.codeForTesting}`)
            .end((err1, res1) => {
              expect(res1.statusCode).to.equal(201);
              expect(res1.body).to.have.property('token');
              getIDToken(res1.body.token).then(idToken => {
                request(server)
                  .put('/api/v1/account')
                  .set('token', idToken)
                  .send({
                    password: '88888888',
                    displayName: 'Mingliang Ma',
                    ethnicity: 'asian',
                    dateOfBirth: '1987-11-02',
                    gender: 'male',
                  })
                  .end((err2, res2) => {
                    if (err2) console.error(err2);
                    expect(res2.statusCode).to.equal(201);
                    expect(res2.body).to.have.property('accountId');

                    expect(res2.body).to.have.property('phoneNum');
                    expect(res2.body.phoneNum).to.equal('+16475806776');

                    request(server)
                      .post('/api/v1/account/login')
                      .send({
                        password: '88888888',
                        phoneNum: res2.body.phoneNum,
                      })
                      .end((err3, res3) => {
                        if (err3) console.error(err3);
                        expect(res3.statusCode).to.equal(201);
                        expect(res3.body).to.have.property('token');

                        expect(res3.body).to.have.property('accountId');
                        expect(res3.body.accountId).to.equal(res2.body.accountId);

                        firebase.auth().signInWithCustomToken(res3.body.token.toString())
                          .then(user => {
                            expect(user.uid).to.equal(res2.body.accountId);
                            done();
                          }).catch(err4 => {
                            expect(err4).to.not.be.a('object');
                            done();
                          });
                      });
                  });
              });
            });
        });
    });
  });

  describe('/GET account/me', () => {
    it('validate token', done => {
      request(server)
        .post('/api/v1/account/verify/phone/+16475806776?disableSMS=true')
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('codeForTesting');
          expect(res.body.codeForTesting).to.be.a('string');
          expect(res.body.success).to.equal(true);

          request(server)
            .post(`/api/v1/account/verify/phone/+16475806776/code/${res.body.codeForTesting}`)
            .end((err1, res1) => {
              expect(res1.statusCode).to.equal(201);
              expect(res1.body).to.have.property('token');
              getIDToken(res1.body.token.toString())
                .then(idToken => {
                  request(server)
                    .get('/api/v1/account/me')
                    .set('token', idToken)
                    .end((err2, res2) => {
                      expect(res2.statusCode).to.equal(200);
                      expect(res2.body).to.have.property('accountId');
                      done();
                    });
                });
            });
        });
    });
  });
});

function getIDToken(customToken) {
  return firebase.auth().signInWithCustomToken(customToken)
    .then(() => firebase.auth().currentUser.getIdToken(true));
}

// firebase.auth().signInWithCustomToken(res1.body.token.toString())
//   .then(() => firebase.auth().currentUser.getIdToken(true))
//   .then(idToken => {
//     request(server)
//       .get('/api/v1/account/me')
//       .set('token', idToken)
//       .end((err2, res2) => {
//         expect(res2.statusCode).to.equal(200);
//         expect(res2.body).to.have.property('accountId');
//         done();
//       });
//   });
