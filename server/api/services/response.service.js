const Promise = require('bluebird');
const moment = require('moment');
module.exports.generateAccountResponse = user => {
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
      dateOfBirth: moment(user.date_of_birth).format('YYYY-MM-DD'),
      gender: user.gender,
      phoneNum: user.phone_num,
      pictureUrl: pictureUrlArray,
      pictureThumbnailUrl: pictureThumbnailUrlArray,
      description: user.description,
      signId: signResponse,
    };
  }
  return response;
};
