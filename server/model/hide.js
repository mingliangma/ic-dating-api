// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Hide', new Schema({
  initiator: { type: Schema.Types.ObjectId, ref: 'User' }, // the user who initiates the hide action
  receiver: { type: Schema.Types.ObjectId, ref: 'User' }, // //the user who receives the hide action
  created_at: Date,
}));
