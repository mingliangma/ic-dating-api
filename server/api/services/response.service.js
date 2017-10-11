const Promise = require('bluebird');
const moment = require('moment');
const geolib = require('geolib');

const generateAccountResponse = (user, reqQuery) => {
  // console.log('reqQuery: ', reqQuery);
  let response = {};
  const signResponse = [];
  if (user) {
    if (user.sign.length > 0) {
      for (let i = 0; i < user.sign.length; i++) {
        console.info(user.sign[i]);
        signResponse.push({
          signId: user.sign[i].sign_id,
          signName: user.sign[i].sign_name,
          signIconUrl: user.sign[i].sign_icon_url,
        });
      }
    }
    response = {
      accountId: user._id.toString(),
      displayName: user.display_name,
      ethnicity: user.ethnicity,
      dateOfBirth: moment.utc(user.date_of_birth).format('YYYY-MM-DD'),
      gender: user.gender,
      phoneNum: user.phone_num,
      pictureUrl: getSquarePictureUrl(user.picture_url),
      pictureThumbnailUrl: getCompressedPictureUrl(user.picture_url),
      description: user.description,
      signId: signResponse,
    };

    if (reqQuery && reqQuery.latitude && reqQuery.longitude) {
      response.distance = geolib.getDistance(
        { latitude: Number(reqQuery.latitude), longitude: Number(reqQuery.longitude) },
        { longitude: user.geometry.coordinates[0], latitude: user.geometry.coordinates[1] });
    }
  }
  return response;
};

function getSquarePictureUrl(pictureUrlArray) {
  const modifiedPictureUrlArray = [];
  if (pictureUrlArray.length > 0) {
    for (let i = 0; i < pictureUrlArray.length; i++) {
      const pictureUrl = pictureUrlArray[i];

      const pictureLargeUrl = `${pictureUrl.substring(0, pictureUrl.lastIndexOf('/'))}/resized/large${
        pictureUrl.substring(pictureUrl.lastIndexOf('/'))}`;
      modifiedPictureUrlArray.push(pictureLargeUrl);
    }
  }
  return modifiedPictureUrlArray;
}

function getCompressedPictureUrl(pictureUrlArray) {
  const modifiedPictureUrlArray = [];
  if (pictureUrlArray.length > 0) {
    for (let i = 0; i < pictureUrlArray.length; i++) {
      const pictureUrl = pictureUrlArray[i];

      const pictureLargeUrl = `${pictureUrl.substring(0, pictureUrl.lastIndexOf('/'))}/resized/large${
        pictureUrl.substring(pictureUrl.lastIndexOf('/'))}`;
      modifiedPictureUrlArray.push(pictureLargeUrl);
    }
  }
  return modifiedPictureUrlArray;
}

module.exports = {
  generateAccountResponse,
  getCompressedPictureUrl,
  getSquarePictureUrl,
}
