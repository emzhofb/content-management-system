const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  local: {
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String,
    },
    token: {
      type: String
    }
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

module.exports = mongoose.model('User', userSchema);
