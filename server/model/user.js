// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
  _user_id: Schema.Types.ObjectId,
  phone_num: String,
  password: String,
  display_name: String,
  ethnicity: String,
  description: String,
  date_of_birth: Date,
  gender: String,
  picture_url: [String],
  sign_id: [Number],
}));
