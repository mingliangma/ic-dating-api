// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
  _user_id: Schema.Types.ObjectId,
  phone_num: String,
  password: String,
  display_name: String,
  ethnicity: String,
  description: String,
  date_of_birth: Date,
  gender: String,
  picture_url: [String],
  sign: [{ type: Schema.Types.ObjectId, ref: 'Sign' }],
  hiding: [{ type: Schema.Types.ObjectId, ref: 'Hide' }],
});

userSchema.plugin(mongoosePaginate);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', userSchema);
