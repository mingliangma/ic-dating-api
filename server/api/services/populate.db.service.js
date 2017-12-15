import Sign from '../../model/sign';
import User from '../../model/user';
import PasswordService from './password.service';

const moment = require('moment');
const random_name = require('node-random-name');
const Promise = require('bluebird');
const geolib = require('geolib');

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
    geometry: {
      type: 'Point',
      coordinates: [-79.4141207, 43.7659095],
    },
  }).save());

  // 0.98 KM away from Cindy
  console.log(`Janice is ${
    geolib.getDistance(
      { latitude: 43.7659095, longitude: -79.4141207 },
      { latitude: 43.7746177, longitude: -79.4163523 })
  }m away from Cindy`);

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
    geometry: {
      type: 'Point',
      coordinates: [-79.4163523, 43.7746177],
    },
  }).save());

  // 7.81 KM away from Cindy
  console.log(`Ashley is ${
    geolib.getDistance(
      { latitude: 43.7659095, longitude: -79.4141207 },
      { latitude: 43.7409218, longitude: -79.5048262 })
  }m away from Cindy`);
  users.push(new User({
    phone_num: '+16471112224',
    password: PasswordService.cryptPasswordSync('55555555'),
    display_name: 'Ashley',
    ethnicity: 'latin',
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
    geometry: {
      type: 'Point',
      coordinates: [-79.5048262, 43.7409218],
    },
  }).save());

  // 77.42 KM away from Cindy
  users.push(new User({
    phone_num: '+16471112225',
    password: PasswordService.cryptPasswordSync('55555555'),
    display_name: 'Allie',
    ethnicity: 'other',
    date_of_birth: '1997-02-02',
    gender: 'female',
    created_at: moment().toDate(),
    updated_at: moment().toDate(),
    description: 'I love workout',
    picture_url: ['https://s3.amazonaws.com/ic-dating/profiles/4/young-beautiful-brunette-woman-PVZ4V7Z.jpg',
      'https://s3.amazonaws.com/ic-dating/profiles/4/young-woman-flexing-muscles-with-dumbbell-in-gym-PCWR2LF.jpg'],
    sign: [signMap.get(10), signMap.get(11), signMap.get(12), signMap.get(2), signMap.get(1)],
    geometry: {
      type: 'Point',
      coordinates: [-80.0735749, 43.2607245],
    },
  }).save());

  // 35.55 KM away from Cindy
  users.push(new User({
    phone_num: '+16471112226',
    password: PasswordService.cryptPasswordSync('55555555'),
    display_name: 'Heather',
    ethnicity: 'asian',
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
    geometry: {
      type: 'Point',
      coordinates: [-79.7652711, 43.5724501],
    },
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
      geometry: {
        type: 'Point',
        coordinates: [-79.4163523, 43.7746177],
      },
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
      geometry: {
        type: 'Point',
        coordinates: [-79.4163523, 43.7746177],
      },
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
      geometry: {
        type: 'Point',
        coordinates: [-79.4163523, 43.7746177],
      },
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

    console.log('Populate database with sample users...');
    populatePresetUsers(users, signMap);
    // // populateXNumUsers(users, signMap);
    populateFemaleUsers(users, signMap);
    populateMaleUsers(users, signMap);

    return Promise.all(users);
  }).catch(err => {
    if (err.code === 11000 || err.code === 11001) {
      return Promise.resolve();
    }
  });
}

function previewResponse() {
  const response = {
    list: [{
      accountId: '59e77dc64026ee152e37a1b2',
      displayName: 'Cindy',
      ethnicity: 'caucasian',
      dateOfBirth: '1993-02-02',
      gender: 'female',
      phoneNum: '+16471112222',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/1/resized/large/beautiful-sexy-woman-with-suspenders-PD7CDDJ.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/1/resized/large/beautiful-woman-in-sunglasses-PHZVNKU.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/1/resized/large/beautiful-woman-looking-at-the-sky-PY8W2BD.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/1/resized/large/beautiful-sexy-woman-with-suspenders-PD7CDDJ.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/1/resized/large/beautiful-woman-in-sunglasses-PHZVNKU.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/1/resized/large/beautiful-woman-looking-at-the-sky-PY8W2BD.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/1/beautiful-sexy-woman-with-suspenders-PD7CDDJ.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/1/beautiful-woman-in-sunglasses-PHZVNKU.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/1/beautiful-woman-looking-at-the-sky-PY8W2BD.jpg',
      ],
      description: 'I know I cant be your only match, but at least Im the hottest one.',
      signId: [
        {
          signId: 1,
          signName: 'clubbing',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/clubbing_a.png',
        },
        {
          signId: 2,
          signName: 'coffee',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/coffee_a.png',
        },
        {
          signId: 3,
          signName: 'eat',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/eat_a.png',
        },
      ],
      distance: 0,
    },
    {
      accountId: '59e77dc64026ee152e37a1b3',
      displayName: 'Janice',
      ethnicity: 'native_american',
      dateOfBirth: '1994-02-02',
      gender: 'female',
      phoneNum: '+16471112223',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/2/resized/large/beautiful-woman-PGKY5V2.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/2/resized/large/beautiful-woman-using-smart-phone-and-listening-PRR5KSY.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/2/resized/large/beautiful-woman-PGKY5V2.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/2/resized/large/beautiful-woman-using-smart-phone-and-listening-PRR5KSY.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/2/beautiful-woman-PGKY5V2.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/2/beautiful-woman-using-smart-phone-and-listening-PRR5KSY.jpg',
      ],
      description: 'If you dont look like your photos, you will have to buy me drinks until you do',
      signId: [
        {
          signId: 4,
          signName: 'excercise',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/excercise_a.png',
        },
        {
          signId: 5,
          signName: 'gay',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/gay_a.png',
        },
        {
          signId: 6,
          signName: 'jog',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/jog_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1b4',
      displayName: 'Ashley',
      ethnicity: 'latin',
      dateOfBirth: '1987-02-02',
      gender: 'female',
      phoneNum: '+16471112224',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/3/resized/large/beauty-woman-at-the-seaside-PKSLWYC.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/3/resized/large/beauty-woman-at-the-seaside-PPJC9TA.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/3/resized/large/beauty-woman-at-the-seaside-PQUDJC6.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/3/resized/large/beauty-woman-at-the-seaside-PKSLWYC.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/3/resized/large/beauty-woman-at-the-seaside-PPJC9TA.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/3/resized/large/beauty-woman-at-the-seaside-PQUDJC6.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/3/beauty-woman-at-the-seaside-PKSLWYC.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/3/beauty-woman-at-the-seaside-PPJC9TA.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/3/beauty-woman-at-the-seaside-PQUDJC6.jpg',
      ],
      description: 'THis sounds fun... \n Please message me for all hook ups =) \n Love meeting new people \n\n All about positivity and passion. Busy chasing my dreams... can you keep up?',
      signId: [
        {
          signId: 7,
          signName: 'mahjong',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/mahjong_a.png',
        },
        {
          signId: 8,
          signName: 'money',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/money_a.png',
        },
        {
          signId: 9,
          signName: 'shopping',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/shopping_a.png',
        },
      ],
      distance: 7815,
    },
    {
      accountId: '59e77dc64026ee152e37a1b5',
      displayName: 'Allie',
      ethnicity: 'other',
      dateOfBirth: '1997-02-02',
      gender: 'female',
      phoneNum: '+16471112225',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/4/resized/large/young-beautiful-brunette-woman-PVZ4V7Z.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/4/resized/large/young-woman-flexing-muscles-with-dumbbell-in-gym-PCWR2LF.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/4/resized/large/young-beautiful-brunette-woman-PVZ4V7Z.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/4/resized/large/young-woman-flexing-muscles-with-dumbbell-in-gym-PCWR2LF.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/4/young-beautiful-brunette-woman-PVZ4V7Z.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/4/young-woman-flexing-muscles-with-dumbbell-in-gym-PCWR2LF.jpg',
      ],
      description: 'I love workout',
      signId: [
        {
          signId: 10,
          signName: 'sleep',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/sleep_a.png',
        },
        {
          signId: 11,
          signName: 'walk_dog',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/walk_dog_a.png',
        },
        {
          signId: 12,
          signName: 'watch_movie',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/watch_movie_a.png',
        },
        {
          signId: 2,
          signName: 'coffee',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/coffee_a.png',
        },
        {
          signId: 1,
          signName: 'clubbing',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/clubbing_a.png',
        },
      ],
      distance: 77418,
    },
    {
      accountId: '59e77dc64026ee152e37a1b6',
      displayName: 'Heather',
      ethnicity: 'asian',
      dateOfBirth: '1991-02-02',
      gender: 'female',
      phoneNum: '+16471112226',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/5/resized/large/happy-beautiful-young-woman-standing-and-talking-PNGKKME.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/5/resized/large/sensual-attractive-young-woman-with-red-lips-PA4LCMB.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/5/resized/large/young-woman-cutting-vegetables-PKTD234.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/5/resized/large/young-woman-exercising-in-the-rain-PCNHPT8.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/5/resized/large/young-woman-leaning-against-art-sculpture-PVSFSJY.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/5/resized/large/happy-beautiful-young-woman-standing-and-talking-PNGKKME.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/5/resized/large/sensual-attractive-young-woman-with-red-lips-PA4LCMB.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/5/resized/large/young-woman-cutting-vegetables-PKTD234.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/5/resized/large/young-woman-exercising-in-the-rain-PCNHPT8.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/5/resized/large/young-woman-leaning-against-art-sculpture-PVSFSJY.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/5/happy-beautiful-young-woman-standing-and-talking-PNGKKME.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/5/sensual-attractive-young-woman-with-red-lips-PA4LCMB.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/5/young-woman-cutting-vegetables-PKTD234.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/5/young-woman-exercising-in-the-rain-PCNHPT8.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/5/young-woman-leaning-against-art-sculpture-PVSFSJY.jpg',
      ],
      signId: [
        {
          signId: 5,
          signName: 'gay',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/gay_a.png',
        },
        {
          signId: 9,
          signName: 'shopping',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/shopping_a.png',
        },
        {
          signId: 2,
          signName: 'coffee',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/coffee_a.png',
        },
      ],
      distance: 35554,
    },
    {
      accountId: '59e77dc64026ee152e37a1b8',
      displayName: 'Bev Krupansky',
      ethnicity: 'black',
      dateOfBirth: '1999-07-01',
      gender: 'female',
      phoneNum: '+14162223301',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/girl-nature-smile-beauty-160998.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/girl-nature-smile-beauty-160998.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/girl-nature-smile-beauty-160998.jpg',
      ],
      signId: [
        {
          signId: 2,
          signName: 'coffee',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/coffee_a.png',
        },
        {
          signId: 4,
          signName: 'excercise',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/excercise_a.png',
        },
        {
          signId: 3,
          signName: 'eat',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/eat_a.png',
        },
        {
          signId: 5,
          signName: 'gay',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/gay_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1b9',
      displayName: 'Asley Gamons',
      ethnicity: 'latin',
      dateOfBirth: '1998-09-01',
      gender: 'female',
      phoneNum: '+14162223302',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-206302.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-206302.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-206302.jpg',
      ],
      signId: [
        {
          signId: 3,
          signName: 'eat',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/eat_a.png',
        },
        {
          signId: 5,
          signName: 'gay',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/gay_a.png',
        },
        {
          signId: 4,
          signName: 'excercise',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/excercise_a.png',
        },
        {
          signId: 6,
          signName: 'jog',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/jog_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1ba',
      displayName: 'Jose Neman',
      ethnicity: 'indian',
      dateOfBirth: '1997-11-01',
      gender: 'female',
      phoneNum: '+14162223303',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-206434.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-206434.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-206434.jpg',
      ],
      signId: [
        {
          signId: 4,
          signName: 'excercise',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/excercise_a.png',
        },
        {
          signId: 6,
          signName: 'jog',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/jog_a.png',
        },
        {
          signId: 5,
          signName: 'gay',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/gay_a.png',
        },
        {
          signId: 7,
          signName: 'mahjong',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/mahjong_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1bb',
      displayName: 'Thomasena Manas',
      ethnicity: 'native_american',
      dateOfBirth: '1997-01-01',
      gender: 'female',
      phoneNum: '+14162223304',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-206542.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-206542.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-206542.jpg',
      ],
      signId: [
        {
          signId: 5,
          signName: 'gay',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/gay_a.png',
        },
        {
          signId: 7,
          signName: 'mahjong',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/mahjong_a.png',
        },
        {
          signId: 6,
          signName: 'jog',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/jog_a.png',
        },
        {
          signId: 8,
          signName: 'money',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/money_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1bc',
      displayName: 'Loise Bowe',
      ethnicity: 'caucasian',
      dateOfBirth: '1996-03-01',
      gender: 'female',
      phoneNum: '+14162223305',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-218724.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-218724.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-218724.jpg',
      ],
      signId: [
        {
          signId: 6,
          signName: 'jog',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/jog_a.png',
        },
        {
          signId: 8,
          signName: 'money',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/money_a.png',
        },
        {
          signId: 7,
          signName: 'mahjong',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/mahjong_a.png',
        },
        {
          signId: 9,
          signName: 'shopping',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/shopping_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1bd',
      displayName: 'Danuta Loughery',
      ethnicity: 'other',
      dateOfBirth: '1995-05-01',
      gender: 'female',
      phoneNum: '+14162223306',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-220418.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-220418.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-220418.jpg',
      ],
      signId: [
        {
          signId: 7,
          signName: 'mahjong',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/mahjong_a.png',
        },
        {
          signId: 9,
          signName: 'shopping',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/shopping_a.png',
        },
        {
          signId: 8,
          signName: 'money',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/money_a.png',
        },
        {
          signId: 10,
          signName: 'sleep',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/sleep_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1be',
      displayName: 'Jamila Yeates',
      ethnicity: 'asian',
      dateOfBirth: '1994-07-01',
      gender: 'female',
      phoneNum: '+14162223307',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-235534.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-235534.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-235534.jpg',
      ],
      signId: [
        {
          signId: 8,
          signName: 'money',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/money_a.png',
        },
        {
          signId: 10,
          signName: 'sleep',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/sleep_a.png',
        },
        {
          signId: 9,
          signName: 'shopping',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/shopping_a.png',
        },
        {
          signId: 11,
          signName: 'walk_dog',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/walk_dog_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1bf',
      displayName: 'Madalyn Bridgman',
      ethnicity: 'black',
      dateOfBirth: '1993-09-01',
      gender: 'female',
      phoneNum: '+14162223308',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-253758.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-253758.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-253758.jpg',
      ],
      signId: [
        {
          signId: 9,
          signName: 'shopping',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/shopping_a.png',
        },
        {
          signId: 11,
          signName: 'walk_dog',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/walk_dog_a.png',
        },
        {
          signId: 10,
          signName: 'sleep',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/sleep_a.png',
        },
        {
          signId: 12,
          signName: 'watch_movie',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/watch_movie_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1c0',
      displayName: 'May Evon',
      ethnicity: 'latin',
      dateOfBirth: '1992-11-01',
      gender: 'female',
      phoneNum: '+14162223309',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-265888.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-265888.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-265888.jpg',
      ],
      signId: [
        {
          signId: 10,
          signName: 'sleep',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/sleep_a.png',
        },
        {
          signId: 12,
          signName: 'watch_movie',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/watch_movie_a.png',
        },
        {
          signId: 11,
          signName: 'walk_dog',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/walk_dog_a.png',
        },
        {
          signId: 1,
          signName: 'clubbing',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/clubbing_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1c1',
      displayName: 'Ona Palchetti',
      ethnicity: 'indian',
      dateOfBirth: '1992-01-01',
      gender: 'female',
      phoneNum: '+14162223310',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-274645.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-274645.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-274645.jpg',
      ],
      signId: [
        {
          signId: 11,
          signName: 'walk_dog',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/walk_dog_a.png',
        },
        {
          signId: 1,
          signName: 'clubbing',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/clubbing_a.png',
        },
        {
          signId: 12,
          signName: 'watch_movie',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/watch_movie_a.png',
        },
        {
          signId: 2,
          signName: 'coffee',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/coffee_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1c2',
      displayName: 'Barbie Oman',
      ethnicity: 'native_american',
      dateOfBirth: '1991-03-01',
      gender: 'female',
      phoneNum: '+14162223311',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-289225.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-289225.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-289225.jpg',
      ],
      signId: [
        {
          signId: 12,
          signName: 'watch_movie',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/watch_movie_a.png',
        },
        {
          signId: 2,
          signName: 'coffee',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/coffee_a.png',
        },
        {
          signId: 1,
          signName: 'clubbing',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/clubbing_a.png',
        },
        {
          signId: 3,
          signName: 'eat',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/eat_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1c3',
      displayName: 'Jacqualine Medsker',
      ethnicity: 'caucasian',
      dateOfBirth: '1990-05-01',
      gender: 'female',
      phoneNum: '+14162223312',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-295821.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-295821.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-295821.jpg',
      ],
      signId: [
        {
          signId: 1,
          signName: 'clubbing',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/clubbing_a.png',
        },
        {
          signId: 3,
          signName: 'eat',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/eat_a.png',
        },
        {
          signId: 2,
          signName: 'coffee',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/coffee_a.png',
        },
        {
          signId: 4,
          signName: 'excercise',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/excercise_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1c4',
      displayName: 'Sharika Farah',
      ethnicity: 'other',
      dateOfBirth: '1989-07-01',
      gender: 'female',
      phoneNum: '+14162223313',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-300945.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-300945.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-300945.jpg',
      ],
      signId: [
        {
          signId: 2,
          signName: 'coffee',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/coffee_a.png',
        },
        {
          signId: 4,
          signName: 'excercise',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/excercise_a.png',
        },
        {
          signId: 3,
          signName: 'eat',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/eat_a.png',
        },
        {
          signId: 5,
          signName: 'gay',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/gay_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1c5',
      displayName: 'Adeline Solid',
      ethnicity: 'asian',
      dateOfBirth: '1988-09-01',
      gender: 'female',
      phoneNum: '+14162223314',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-323245.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-323245.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-323245.jpg',
      ],
      signId: [
        {
          signId: 3,
          signName: 'eat',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/eat_a.png',
        },
        {
          signId: 5,
          signName: 'gay',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/gay_a.png',
        },
        {
          signId: 4,
          signName: 'excercise',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/excercise_a.png',
        },
        {
          signId: 6,
          signName: 'jog',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/jog_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1c6',
      displayName: 'Bell Brumm',
      ethnicity: 'black',
      dateOfBirth: '1987-11-01',
      gender: 'female',
      phoneNum: '+14162223315',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-573297.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/resized/large/pexels-photo-573297.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/women/pexels-photo-573297.jpg',
      ],
      signId: [
        {
          signId: 4,
          signName: 'excercise',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/excercise_a.png',
        },
        {
          signId: 6,
          signName: 'jog',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/jog_a.png',
        },
        {
          signId: 5,
          signName: 'gay',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/gay_a.png',
        },
        {
          signId: 7,
          signName: 'mahjong',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/mahjong_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1c8',
      displayName: 'Mike Nicholson',
      ethnicity: 'black',
      dateOfBirth: '1999-02-01',
      gender: 'male',
      phoneNum: '+14162223101',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/resized/large/guy1.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/resized/large/guy1.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/guy1.jpg',
      ],
      signId: [
        {
          signId: 2,
          signName: 'coffee',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/coffee_a.png',
        },
        {
          signId: 4,
          signName: 'excercise',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/excercise_a.png',
        },
        {
          signId: 3,
          signName: 'eat',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/eat_a.png',
        },
        {
          signId: 5,
          signName: 'gay',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/gay_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1c9',
      displayName: 'Patrick Eidt',
      ethnicity: 'latin',
      dateOfBirth: '1997-11-01',
      gender: 'male',
      phoneNum: '+14162223102',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/resized/large/handsome-guy-in-the-park-PJ8U7VV.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/resized/large/handsome-guy-in-the-park-PJ8U7VV.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/handsome-guy-in-the-park-PJ8U7VV.jpg',
      ],
      signId: [
        {
          signId: 3,
          signName: 'eat',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/eat_a.png',
        },
        {
          signId: 5,
          signName: 'gay',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/gay_a.png',
        },
        {
          signId: 4,
          signName: 'excercise',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/excercise_a.png',
        },
        {
          signId: 6,
          signName: 'jog',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/jog_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1ca',
      displayName: 'Roscoe Coote',
      ethnicity: 'indian',
      dateOfBirth: '1996-08-01',
      gender: 'male',
      phoneNum: '+14162223103',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/resized/large/hipster-guy-walking-down-the-street-urban-style-P4HY28P.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/resized/large/hipster-guy-walking-down-the-street-urban-style-P4HY28P.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/hipster-guy-walking-down-the-street-urban-style-P4HY28P.jpg',
      ],
      signId: [
        {
          signId: 4,
          signName: 'excercise',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/excercise_a.png',
        },
        {
          signId: 6,
          signName: 'jog',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/jog_a.png',
        },
        {
          signId: 5,
          signName: 'gay',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/gay_a.png',
        },
        {
          signId: 7,
          signName: 'mahjong',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/mahjong_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1cb',
      displayName: 'Eugene Iwanowski',
      ethnicity: 'native_american',
      dateOfBirth: '1995-05-01',
      gender: 'male',
      phoneNum: '+14162223104',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/resized/large/young-handsome-attractive-bearded-model-man-PAFDUGZ.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/resized/large/young-handsome-attractive-bearded-model-man-PAFDUGZ.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/young-handsome-attractive-bearded-model-man-PAFDUGZ.jpg',
      ],
      signId: [
        {
          signId: 5,
          signName: 'gay',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/gay_a.png',
        },
        {
          signId: 7,
          signName: 'mahjong',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/mahjong_a.png',
        },
        {
          signId: 6,
          signName: 'jog',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/jog_a.png',
        },
        {
          signId: 8,
          signName: 'money',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/money_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1cc',
      displayName: 'Loyd Divita',
      ethnicity: 'caucasian',
      dateOfBirth: '1994-02-01',
      gender: 'male',
      phoneNum: '+14162223105',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/resized/large/portrait-young-guy-on-the-street-PM36UG9.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/resized/large/portrait-young-guy-on-the-street-PM36UG9.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/portrait-young-guy-on-the-street-PM36UG9.jpg',
      ],
      signId: [
        {
          signId: 6,
          signName: 'jog',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/jog_a.png',
        },
        {
          signId: 8,
          signName: 'money',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/money_a.png',
        },
        {
          signId: 7,
          signName: 'mahjong',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/mahjong_a.png',
        },
        {
          signId: 9,
          signName: 'shopping',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/shopping_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1cd',
      displayName: 'Edmundo Duceman',
      ethnicity: 'other',
      dateOfBirth: '1992-11-01',
      gender: 'male',
      phoneNum: '+14162223106',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/resized/large/young-handsome-guy-PEJJ8W3.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/resized/large/young-handsome-guy-PEJJ8W3.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/young-handsome-guy-PEJJ8W3.jpg',
      ],
      signId: [
        {
          signId: 7,
          signName: 'mahjong',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/mahjong_a.png',
        },
        {
          signId: 9,
          signName: 'shopping',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/shopping_a.png',
        },
        {
          signId: 8,
          signName: 'money',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/money_a.png',
        },
        {
          signId: 10,
          signName: 'sleep',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/sleep_a.png',
        },
      ],
      distance: 984,
    },
    {
      accountId: '59e77dc64026ee152e37a1ce',
      displayName: 'Eloy Mogren',
      ethnicity: 'asian',
      dateOfBirth: '1991-08-01',
      gender: 'male',
      phoneNum: '+14162223107',
      pictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/resized/large/young-stylish-guy-with-bicycle-outdoors-P92YSYC.jpg',
      ],
      pictureThumbnailUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/resized/large/young-stylish-guy-with-bicycle-outdoors-P92YSYC.jpg',
      ],
      originalPictureUrl: [
        'https://s3.amazonaws.com/ic-dating/profiles/guy/young-stylish-guy-with-bicycle-outdoors-P92YSYC.jpg',
      ],
      signId: [
        {
          signId: 8,
          signName: 'money',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/money_a.png',
        },
        {
          signId: 10,
          signName: 'sleep',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/sleep_a.png',
        },
        {
          signId: 9,
          signName: 'shopping',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/shopping_a.png',
        },
        {
          signId: 11,
          signName: 'walk_dog',
          signIconUrl: 'https://s3.amazonaws.com/ic-dating/signs/walk_dog_a.png',
        },
      ],
      distance: 984,
    }],
    totalPages: 1,
    totalItems: 30,
    limit: 30,
    page: 1,
  };

  return response;
}

module.exports = {
  populate,
  prepareSignsPromise,
  populateMaleUsers,
  populateFemaleUsers,
  populatePresetUsers,
  populateXNumUsers,
  previewResponse,
};

