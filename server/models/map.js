const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mapSchema = new Schema({
  title: {
    type: String
  },
  lat: {
    type: Number
  },
  lng: {
    type: Number
  }
});

module.exports = mongoose.model('Map', mapSchema);
