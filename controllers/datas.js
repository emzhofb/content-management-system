const ObjectId = require('mongodb').ObjectId;
const Data = require('../models/data');

exports.addData = (req, res, next) => {
  const { letter, frequency } = req.body;
  const data = new Data({ letter: letter, frequency: frequency });
  const error = e => {
    throw e;
  };

  data
    .save()
    .then(() => {
      return Data.findOne({ letter: letter });
    })
    .then(found => {
      if (found) {
        return res.status(201).json({
          success: true,
          message: 'data has been added',
          data: found
        });
      }

      error("can't add data");
    })
    .catch(err => {
      res.status(406).json({ message: err });
    });
};

exports.deleteData = (req, res, next) => {
  const { id } = req.params;
  const error = e => {
    throw e;
  };

  Data.findByIdAndDelete({ _id: ObjectId(id) })
    .then(result => {
      if (result) {
        return res.status(202).json({
          success: true,
          message: 'data has been deleted',
          data: result
        });
      }

      error("Can't delete data");
    })
    .catch(err => {
      res.status(406).json({ message: err });
    });
};
