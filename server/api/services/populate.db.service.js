import Sign from '../../model/sign';
import User from '../../model/user';

const Promise = require('bluebird');

module.exports.populate = () => {
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

  const signMap = new Map();
  const signs = [];

  for (let i = 0; i < signInfoArray.length; i += 1) {
    console.log('i=', i, '  sign: ', signInfoArray[i].sign_name);
    signs.push(new Sign(signInfoArray[i]).save());
  }

  Promise.all(signs).then(results => {
    console.log('results: ', results);
    results.forEach(sign => {
      console.log('set signMap: ', sign.sign_id);
      signMap.set(sign.sign_id, sign);
    });

    new User({
      phone_num: '+11111111111',
      password: '',
      display_name: 'Cindy',
      ethnicity: 'caucasian',
      date_of_birth: '1993-02-02',
      gender: 'female',
      picture_url: ['https://s3.amazonaws.com/ic-dating/profiles/1/beautiful-sexy-woman-with-suspenders-PD7CDDJ.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/1/beautiful-woman-in-sunglasses-PHZVNKU.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/1/beautiful-woman-looking-at-the-sky-PY8W2BD.jpg'],
      sign: [signMap.get(1), signMap.get(2), signMap.get(3)],
    }).save();


    new User({
      phone_num: '+21111111111',
      password: '',
      display_name: 'Janice',
      ethnicity: 'native_american',
      date_of_birth: '1994-02-02',
      gender: 'female',
      picture_url: ['https://s3.amazonaws.com/ic-dating/profiles/2/beautiful-woman-PGKY5V2.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/2/beautiful-woman-using-smart-phone-and-listening-PRR5KSY.jpg'],
      sign: [signMap.get(4), signMap.get(5), signMap.get(6)],
    }).save();

    new User({
      phone_num: '+31111111111',
      password: '',
      display_name: 'Ashley',
      ethnicity: 'caucasian',
      date_of_birth: '1987-02-02',
      gender: 'female',
      picture_url: ['https://s3.amazonaws.com/ic-dating/profiles/1/beautiful-sexy-woman-with-suspenders-PD7CDDJ.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/3/beauty-woman-at-the-seaside-PKSLWYC.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/3/beauty-woman-at-the-seaside-PPJC9TA.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/3/beauty-woman-at-the-seaside-PQUDJC6.jpg'],
      sign: [signMap.get(7), signMap.get(8), signMap.get(9)],
    }).save();

    new User({
      phone_num: '+41111111111',
      password: '',
      display_name: 'Allie',
      ethnicity: 'caucasian',
      date_of_birth: '1997-02-02',
      gender: 'female',
      picture_url: ['https://s3.amazonaws.com/ic-dating/profiles/4/young-beautiful-brunette-woman-PVZ4V7Z.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/4/young-woman-flexing-muscles-with-dumbbell-in-gym-PCWR2LF.jpg'],
      sign: [signMap.get(10), signMap.get(11), signMap.get(12)],
    }).save();

    new User({
      phone_num: '+51111111111',
      password: '',
      display_name: 'Heather',
      ethnicity: 'caucasian',
      date_of_birth: '1991-02-02',
      gender: 'female',
      picture_url: ['https://s3.amazonaws.com/ic-dating/profiles/5/happy-beautiful-young-woman-standing-and-talking-PNGKKME.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/5/sensual-attractive-young-woman-with-red-lips-PA4LCMB.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/5/young-woman-cutting-vegetables-PKTD234.jpg',
        'https://s3.amazonaws.com/icdating/profiles/5/young-woman-exercising-in-the-rain-PCNHPT8.jpg',
        'https://s3.amazonaws.com/ic-dating/profiles/5/young-woman-leaning-against-art-sculpture-PVSFSJY.jpg'],
      sign: [signMap.get(5), signMap.get(9), signMap.get(2)],
    }).save();
  })
    .catch(err => {
      console.error(err.message);
    });
};

