const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Sign', new Schema({
  sign_id: Number,
  sign_name: String,
  sign_icon_url: String,
}));