const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
  letter: {
    type: String
  },
  frequency: {
    type: Number
  }
});

module.exports = mongoose.model('Data', dataSchema);
