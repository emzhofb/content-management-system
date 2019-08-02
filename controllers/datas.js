const ObjectId = require('mongodb').ObjectId;
const Data = require('../models/data');

exports.postDataSearch = (req, res, next) => {
  const { letter, frequency } = req.body;
  const error = e => {
    throw e;
  };

  Data.find()
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
            letter: data.letter,
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

exports.getData = (req, res, next) => {
  const error = e => {
    throw e;
  };

  Data.find()
    .then(datas => {
      if (datas) {
        const newdata = [];
        datas.forEach(data => {
          newdata.push({
            _id: data._id,
            letter: data.letter,
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

exports.putData = (req, res, next) => {
  const { id } = req.params;
  const { letter, frequency } = req.body;
  const error = e => {
    throw e;
  };

  Data.findByIdAndUpdate(
    { _id: ObjectId(id) },
    { letter: letter, frequency: frequency }
  )
    .then(result => {
      if (result) {
        const newdata = {};
        newdata._id = result._id;
        newdata.letter = letter;
        newdata.frequency = frequency;

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

exports.postData = (req, res, next) => {
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
        const newdata = {};
        newdata._id = found._id;
        newdata.letter = found.letter;
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

exports.deleteData = (req, res, next) => {
  const { id } = req.params;
  const error = e => {
    throw e;
  };

  Data.findByIdAndDelete({ _id: ObjectId(id) })
    .then(result => {
      if (result) {
        const newdata = {};
        newdata._id = result._id;
        newdata.letter = result.letter;
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

exports.getFindData = (req, res, next) => {
  const { id } = req.params;
  const error = e => {
    throw e;
  };

  Data.findById({ _id: ObjectId(id) })
    .then(result => {
      if (result) {
        const newdata = {};
        newdata._id = result._id;
        newdata.letter = result.letter;
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
