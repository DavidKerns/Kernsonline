const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
require('../configs/database');
const Schema   = mongoose.Schema;
const userSchema = new Schema({
  email      : {
    type: String,
    required: [true, 'Email  is required']
  },
  username   : {
    type: String,
    required: [true, 'A username is required']
  },
  password   : {
    type: String,
    required: [true, 'password is required']
  },
  role: {
    type: String,
     "default": 'sales',
      required: true
     },
  });


const User = mongoose.model('User', userSchema);
module.exports = User;
