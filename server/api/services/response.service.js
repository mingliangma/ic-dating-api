const Promise = require('bluebird');
const moment = require('moment');
const geolib = require('geolib');

module.exports.generateAccountResponse = (user, reqQuery) => {
  // console.log('reqQuery: ', reqQuery);
  let response = {};
  const signResponse = [];
  if (user) {
    if (user.sign.length > 0) {
      for (let i = 0; i < user.sign.length; i++) {
        // console.info(user.sign[0]);
        signResponse.push({
          signId: user.sign[i].sign_id,
          signName: user.sign[i].sign_name,
          signIconUrl: user.sign[i].sign_icon_url,
        });
      }
    }

    const pictureThumbnailUrlArray = [];
    const pictureUrlArray = [];
    if (user.picture_url.length > 0) {
      for (let i = 0; i < user.picture_url.length; i++) {
        const pictureUrl = user.picture_url[i];
        const pictureThumbnailUrl = `${pictureUrl.substring(0, pictureUrl.lastIndexOf('/'))}/resized/cropped-to-square${
          pictureUrl.substring(pictureUrl.lastIndexOf('/'))}`;
        const pictureMediumUrl = `${pictureUrl.substring(0, pictureUrl.lastIndexOf('/'))}/resized/large${
          pictureUrl.substring(pictureUrl.lastIndexOf('/'))}`;

        pictureThumbnailUrlArray.push(pictureThumbnailUrl);
        pictureUrlArray.push(pictureMediumUrl);
      }
    }
    response = {
      accountId: user._id.toString(),
      displayName: user.display_name,
      ethnicity: user.ethnicity,
      dateOfBirth: moment.utc(user.date_of_birth).format('YYYY-MM-DD'),
      gender: user.gender,
      phoneNum: user.phone_num,
      pictureUrl: pictureUrlArray,
      pictureThumbnailUrl: pictureThumbnailUrlArray,
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
