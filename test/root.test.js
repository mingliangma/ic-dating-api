import { before, after } from 'mocha';

const firebase = require('firebase');
const firebaseAdmin = require('firebase-admin');

before(() => {
  // const config = {
  //   apiKey: 'AIzaSyAn6kyJxzZrFflz78MEz3tYCgdlcMujQC0',
  //   authDomain: 'ic-dating-dev.firebaseapp.com',
  //   databaseURL: 'https://ic-dating-dev.firebaseio.com',
  //   projectId: 'ic-dating-dev',
  //   storageBucket: 'ic-dating-dev.appspot.com',
  //   messagingSenderId: '945749542557',
  // };
  // firebase.initializeApp(config);
});
after(() => {
  deleteAllFirebaseUsers();
});

function deleteAllFirebaseUsers() {
  // List batch of users, 1000 at a time.
  firebaseAdmin.auth().listUsers(100)
    .then(listUsersResult => {
      listUsersResult.users.forEach(userRecord => {
        // console.log('user', userRecord.toJSON());
        firebaseAdmin.auth().deleteUser(userRecord.uid);
      });
    })
    .catch(error => {
      console.log('Error listing users:', error);
    });
}
