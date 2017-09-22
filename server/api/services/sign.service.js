import Sign from '../../model/sign';

module.exports.populateSignTable = () => {
  new Sign({
    sign_id: 1,
    sign_name: 'clubbing',
    sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/clubbing_a.png',
  }).save();

  new Sign({
    sign_id: 2,
    sign_name: 'coffee',
    sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/coffee_a.png',
  }).save();

  new Sign({
    sign_id: 3,
    sign_name: 'eat',
    sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/eat_a.png',
  }).save();

  new Sign({
    sign_id: 4,
    sign_name: 'excercise',
    sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/excercise_a.png',
  }).save();

  new Sign({
    sign_id: 5,
    sign_name: 'gay',
    sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/gay_a.png',
  }).save();

  new Sign({
    sign_id: 6,
    sign_name: 'jog',
    sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/jog_a.png',
  }).save();

  new Sign({
    sign_id: 7,
    sign_name: 'mahjong',
    sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/mahjong_a.png',
  }).save();

  new Sign({
    sign_id: 8,
    sign_name: 'money',
    sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/money_a.png',
  }).save();

  new Sign({
    sign_id: 9,
    sign_name: 'shopping',
    sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/shopping_a.png',
  }).save();

  new Sign({
    sign_id: 10,
    sign_name: 'sleep',
    sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/sleep_a.png',
  }).save();

  new Sign({
    sign_id: 11,
    sign_name: 'walk_dog',
    sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/walk_dog_a.png',
  }).save();

  new Sign({
    sign_id: 12,
    sign_name: 'watch_movie',
    sign_icon_url: 'https://s3.amazonaws.com/ic-dating/signs/watch_movie_a.png',
  }).save();
};
