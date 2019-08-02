const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const datadateSchema = new Schema({
  letter: {
    type: Date
  },
  frequency: {
    type: Number
  }
});

module.exports = mongoose.model('DataDate', datadateSchema);
