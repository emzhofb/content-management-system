const moment = require('moment');
const ObjectId = require('mongodb').ObjectId;
const DataDate = require('../models/datadate');

exports.postSearchDatadate = (req, res, next) => {
  const { letter, frequency } = req.body;
  const error = e => {
    throw e;
  };

  DataDate.find()
    .or([
      { $or: [{ letter: letter }, { frequency: frequency }] },
      { $or: [{ letter: letter }] },
      { $or: [{ frequency: frequency }] }
    ])
    .then(result => {
      if (result[0]) {
        const newdata = [];
        result.forEach(data => {
          newdata.push({
            _id: data._id,
            letter: moment(data.letter).format('YYYY-MM-DD'),
            frequency: data.frequency
          });
        });

        return res.status(200).json(newdata);
      }

      error("data can't be found!");
    })
    .catch(err => {
      res.status(406).json({ message: err });
    });
};

exports.getDataDate = (req, res, next) => {
  const error = e => {
    throw e;
  };

  DataDate.find()
    .then(datas => {
      if (datas) {
        const newdata = [];
        datas.forEach(data => {
          newdata.push({
            _id: data._id,
            letter: moment(data.letter).format('YYYY-MM-DD'),
            frequency: data.frequency
          });
        });

        return res.status(200).json(newdata);
      }

      error("data can't be found!");
    })
    .catch(err => {
      res.status(406).json({ message: err });
    });
};

exports.putDataDate = (req, res, next) => {
  const { id } = req.params;
  const { letter, frequency } = req.body;
  const error = e => {
    throw e;
  };

  DataDate.findByIdAndUpdate(
    { _id: ObjectId(id) },
    { letter: letter, frequency: frequency }
  )
    .then(result => {
      if (result) {
        const newdata = {};
        newdata._id = result._id;
        newdata.letter = moment(result.letter).format('YYYY-MM-DD');
        newdata.frequency = result.frequency;

        return res.status(205).json({
          success: true,
          message: 'data has been updated',
          data: newdata
        });
      }

      error("can't update data");
    })
    .catch(err => {
      res.status(406).json({ message: err });
    });
};

exports.postDataDate = (req, res, next) => {
  const { letter, frequency } = req.body;
  const datadate = new DataDate({ letter: letter, frequency: frequency });
  const error = e => {
    throw e;
  };

  datadate
    .save()
    .then(found => {
      if (found) {
        const newdata = {};
        newdata._id = found._id;
        newdata.letter = moment(found.letter).format('YYYY-MM-DD');
        newdata.frequency = found.frequency;

        return res.status(201).json({
          success: true,
          message: 'data has been added',
          data: newdata
        });
      }

      error("can't add data");
    })
    .catch(err => {
      res.status(406).json({ message: err });
    });
};

exports.deleteDataDate = (req, res, next) => {
  const { id } = req.params;
  const error = e => {
    throw e;
  };

  DataDate.findByIdAndDelete({ _id: ObjectId(id) })
    .then(result => {
      if (result) {
        const newdata = {};
        newdata._id = result._id;
        newdata.letter = moment(result.letter).format('YYYY-MM-DD');
        newdata.frequency = result.frequency;

        return res.status(202).json({
          success: true,
          message: 'data has been deleted',
          data: newdata
        });
      }

      error("can't delete data");
    })
    .catch(err => {
      res.status(406).json({ message: err });
    });
};

exports.getFindDataDate = (req, res, next) => {
  const { id } = req.params;
  const error = e => {
    throw e;
  };

  DataDate.findById({ _id: ObjectId(id) })
    .then(result => {
      if (result) {
        const newdata = {};
        newdata._id = result._id;
        newdata.letter = moment(result.letter).format('YYYY-MM-DD');
        newdata.frequency = result.frequency;

        return res.status(202).json({
          success: true,
          message: 'data found',
          data: newdata
        });
      }

      error("can't find the data");
    })
    .catch(err => {
      res.status(406).json({ message: err });
    });
};
