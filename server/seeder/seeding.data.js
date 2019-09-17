const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const DataDate = require('../models/datadate');

mongoose.connect('mongodb://localhost:27017/cms', {
  useNewUrlParser: true,
  useCreateIndex: true
});

fs.readFile(path.resolve(__dirname, 'data.json'), (err, dataDate) => {
  DataDate.insertMany(JSON.parse(dataDate))
    .then(() => {
      mongoose.disconnect();
    })
    .catch(err => {
      console.log(err);
    });
});
