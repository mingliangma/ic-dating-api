import Sign from '../../model/sign';
import User from '../../model/user';
import PasswordService from './password.service';

const moment = require('moment');
const random_name = require('node-random-name');
const Promise = require('bluebird');

const ethnicity = ['asian', 'black', 'latin', 'indian', 'native_american', 'caucasian', 'other'];
const gender = ['male', 'female'];
const pictureUrl = {
  female: ['https://s3.amazonaws.com/ic-dating/profiles/women/beautiful-girl-female-young-94275.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/women/girl-nature-smile-beauty-160998.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-206302.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-206434.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-206542.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-218724.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-220418.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-235534.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-253758.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-265888.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-274645.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-289225.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-295821.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-300945.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-323245.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-573297.jpg'],
  male: ['https://s3.amazonaws.com/ic-dating/profiles/guy/young-guy-standing-at-the-beach-with-surfboard-PZK8MWC.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/guy/guy1.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/guy/handsome-guy-in-the-park-PJ8U7VV.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/guy/hipster-guy-walking-down-the-street-urban-style-P4HY28P.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/guy/young-handsome-attractive-bearded-model-man-PAFDUGZ.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/guy/portrait-young-guy-on-the-street-PM36UG9.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/guy/young-handsome-guy-PEJJ8W3.jpg',
    'https://s3.amazonaws.com/ic-dating/profiles/guy/young-stylish-guy-with-bicycle-outdoors-P92YSYC.jpg'],
};
const signInfoArray = [{
  sign_id: 1,
  sign_name: 'clubbing',
  sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/clubbing_a.png',
},
{
  sign_id: 2,
  sign_name: 'coffee',
  sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/coffee_a.png',
},
{
  sign_id: 3,
  sign_name: 'eat',
  sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/eat_a.png',
},
{
  sign_id: 4,
  sign_name: 'excercise',
  sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/excercise_a.png',
},
{
  sign_id: 5,
  sign_name: 'gay',
  sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/gay_a.png',
},
{
  sign_id: 6,
  sign_name: 'jog',
  sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/jog_a.png',
},
{
  sign_id: 7,
  sign_name: 'mahjong',
  sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/mahjong_a.png',
},
{
  sign_id: 8,
  sign_name: 'money',
  sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/money_a.png',
},
{
  sign_id: 9,
  sign_name: 'shopping',
  sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/shopping_a.png',
},
{
  sign_id: 10,
  sign_name: 'sleep',
  sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/sleep_a.png',
},
{
  sign_id: 11,
  sign_name: 'walk_dog',
  sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/walk_dog_a.png',
},

{ sign_id: 12,
  sign_name: 'watch_movie',
  sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/watch_movie_a.png',
}];

function populatePresetUsers(users, signMap) {
  users.push(new User({
    phone_num: '+16471112222',
    password: PasswordService.cryptPasswordSync('55555555'),
    display_name: 'Cindy',
    ethnicity: 'caucasian',
    date_of_birth: '1993-02-02',
    gender: 'female',
    created_at: moment().toDate(),
    updated_at: moment().toDate(),
    description: 'I know I cant be your only match, but at least Im the hottest one.',
    picture_url: ['https://s3.amazonaws.com/ic-dating/profiles/1/beautiful-sexy-woman-with-suspenders-PD7CDDJ.jpg',
      'https://s3.amazonaws.com/ic-dating/profiles/1/beautiful-woman-in-sunglasses-PHZVNKU.jpg',
      'https://s3.amazonaws.com/ic-dating/profiles/1/beautiful-woman-looking-at-the-sky-PY8W2BD.jpg'],
    sign: [signMap.get(1), signMap.get(2), signMap.get(3)],
  }).save());


  users.push(new User({
    phone_num: '+16471112223',
    password: PasswordService.cryptPasswordSync('55555555'),
    display_name: 'Janice',
    ethnicity: 'native_american',
    date_of_birth: '1994-02-02',
    gender: 'female',
    created_at: moment().toDate(),
    updated_at: moment().toDate(),
    description: 'If you dont look like your photos, you will have to buy me drinks until you do',
    picture_url: ['https://s3.amazonaws.com/ic-dating/profiles/2/beautiful-woman-PGKY5V2.jpg',
      'https://s3.amazonaws.com/ic-dating/profiles/2/beautiful-woman-using-smart-phone-and-listening-PRR5KSY.jpg'],
    sign: [signMap.get(4), signMap.get(5), signMap.get(6)],
  }).save());

  users.push(new User({
    phone_num: '+16471112224',
    password: PasswordService.cryptPasswordSync('55555555'),
    display_name: 'Ashley',
    ethnicity: 'caucasian',
    date_of_birth: '1987-02-02',
    gender: 'female',
    created_at: moment().toDate(),
    updated_at: moment().toDate(),
    description: 'THis sounds fun... \n Please message me for all hook ups =) \n Love meeting new people \n\n All about positivity and passion. Busy chasing my dreams... can you keep up?',
    picture_url: [
      'https://s3.amazonaws.com/ic-dating/profiles/3/beauty-woman-at-the-seaside-PKSLWYC.jpg',
      'https://s3.amazonaws.com/ic-dating/profiles/3/beauty-woman-at-the-seaside-PPJC9TA.jpg',
      'https://s3.amazonaws.com/ic-dating/profiles/3/beauty-woman-at-the-seaside-PQUDJC6.jpg'],
    sign: [signMap.get(7), signMap.get(8), signMap.get(9)],
  }).save());

  users.push(new User({
    phone_num: '+16471112225',
    password: PasswordService.cryptPasswordSync('55555555'),
    display_name: 'Allie',
    ethnicity: 'caucasian',
    date_of_birth: '1997-02-02',
    gender: 'female',
    created_at: moment().toDate(),
    updated_at: moment().toDate(),
    description: 'I love workout',
    picture_url: ['https://s3.amazonaws.com/ic-dating/profiles/4/young-beautiful-brunette-woman-PVZ4V7Z.jpg',
      'https://s3.amazonaws.com/ic-dating/profiles/4/young-woman-flexing-muscles-with-dumbbell-in-gym-PCWR2LF.jpg'],
    sign: [signMap.get(10), signMap.get(11), signMap.get(12), signMap.get(2), signMap.get(1)],
  }).save());

  users.push(new User({
    phone_num: '+16471112226',
    password: PasswordService.cryptPasswordSync('55555555'),
    display_name: 'Heather',
    ethnicity: 'caucasian',
    date_of_birth: '1991-02-02',
    gender: 'female',
    created_at: moment().toDate(),
    updated_at: moment().toDate(),
    picture_url: ['https://s3.amazonaws.com/ic-dating/profiles/5/happy-beautiful-young-woman-standing-and-talking-PNGKKME.jpg',
      'https://s3.amazonaws.com/ic-dating/profiles/5/sensual-attractive-young-woman-with-red-lips-PA4LCMB.jpg',
      'https://s3.amazonaws.com/ic-dating/profiles/5/young-woman-cutting-vegetables-PKTD234.jpg',
      'https://s3.amazonaws.com/ic-dating/profiles/5/young-woman-exercising-in-the-rain-PCNHPT8.jpg',
      'https://s3.amazonaws.com/ic-dating/profiles/5/young-woman-leaning-against-art-sculpture-PVSFSJY.jpg'],
    sign: [signMap.get(5), signMap.get(9), signMap.get(2)],
  }).save());
}

function populateFemaleUsers(users, signMap) {
  for (let i = 0; i < pictureUrl.female.length; i++) {
    let phoneNumPosfix = '';
    if (i < 10) {
      phoneNumPosfix = `0${i.toString()}`;
    } else {
      phoneNumPosfix = i.toString();
    }
    users.push(new User({
      phone_num: `+141622233${phoneNumPosfix}`,
      password: PasswordService.cryptPasswordSync('55555555'),
      display_name: random_name({ gender: 'female' }),
      ethnicity: ethnicity[i % 7],
      date_of_birth: moment('2000-05-01', 'YYYY-MM-DD').subtract(i * 10, 'months').calendar(),
      gender: 'female',
      created_at: moment().toDate(),
      updated_at: moment().toDate(),
      picture_url: pictureUrl.female[i],
      sign: [signMap.get((i % 12) + 1),
        signMap.get(((i + 2) % 12) + 1),
        signMap.get(((i + 1) % 12) + 1),
        signMap.get(((i + 3) % 12) + 1)],
    }).save());
  }
}

function populateXNumUsers(users, signMap) {
  for (let i = 0; i < 21; i++) {
    let phoneNumPosfix = '';
    if (i < 10) {
      phoneNumPosfix = `0${i.toString()}`;
    } else {
      phoneNumPosfix = i.toString();
    }
    users.push(new User({
      phone_num: `+141622233${phoneNumPosfix}`,
      password: PasswordService.cryptPasswordSync('55555555'),
      display_name: random_name({ gender: gender[i % 2] }),
      ethnicity: ethnicity[i % 7],
      date_of_birth: moment('2000-05-01', 'YYYY-MM-DD').subtract(i * 10, 'months').calendar(),
      gender: gender[i % 2],
      created_at: moment().toDate(),
      updated_at: moment().toDate(),
      picture_url: pictureUrl[gender[i % 2]][i % pictureUrl[gender[i % 2]].length],
      sign: [signMap.get((i % 12) + 1),
        signMap.get(((i + 2) % 12) + 1),
        signMap.get(((i + 1) % 12) + 1),
        signMap.get(((i + 3) % 12) + 1)],
    }).save());
  }
}

function populateMaleUsers(users, signMap) {
  for (let i = 0; i < pictureUrl.male.length; i++) {
    let phoneNumPosfix = '';
    if (i < 10) {
      phoneNumPosfix = `0${i.toString()}`;
    } else {
      phoneNumPosfix = i.toString();
    }
    users.push(new User({
      phone_num: `+141622231${phoneNumPosfix}`,
      password: PasswordService.cryptPasswordSync('55555555'),
      display_name: random_name({ gender: 'male' }),
      ethnicity: ethnicity[i % 7],
      date_of_birth: moment('2000-05-01', 'YYYY-MM-DD').subtract(i * 15, 'months').calendar(),
      gender: 'male',
      created_at: moment().toDate(),
      updated_at: moment().toDate(),
      picture_url: pictureUrl.male[i],
      sign: [signMap.get((i % 12) + 1),
        signMap.get(((i + 2) % 12) + 1),
        signMap.get(((i + 1) % 12) + 1),
        signMap.get(((i + 3) % 12) + 1)],
    }).save());
  }
}

function prepareSignsPromise() {
  const signs = [];
  for (let i = 0; i < signInfoArray.length; i += 1) {
    // console.log('i=', i, '  sign: ', signInfoArray[i].sign_name);
    signs.push(new Sign(signInfoArray[i]).save());
  }
  return signs;
}

function populate() {
  const signs = prepareSignsPromise();

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
    populatePresetUsers(users, signMap);
    // populateXNumUsers(users, signMap);
    populateFemaleUsers(users, signMap);
    populateMaleUsers(users, signMap);

    return Promise.all(users);
  }).catch(err => {
    if (err.code === 11000 || err.code === 11001) {
      return Promise.resolve();
    }
  });
}

module.exports = {
  populate,
  prepareSignsPromise,
  populateMaleUsers,
  populateFemaleUsers,
  populatePresetUsers,
  populateXNumUsers,
};

