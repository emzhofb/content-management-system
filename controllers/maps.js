const ObjectId = require('mongodb').ObjectId;
const Map = require('../models/map');

exports.postMapSearch = (req, res, next) => {
  const { title } = req.body;
  const error = e => {
    throw e;
  };

  Map.find()
    .or([{ $or: [{ title: title }] }])
    .then(result => {
      if (result[0]) {
        const newdata = [];
        result.forEach(data => {
          newdata.push({
            _id: data._id,
            title: data.title,
            lat: data.lat,
            lng: data.lng
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

exports.getMap = (req, res, next) => {
  const error = e => {
    throw e;
  };

  Map.find()
    .then(datas => {
      if (datas) {
        const newdata = [];
        datas.forEach(data => {
          newdata.push({
            _id: data._id,
            title: data.title,
            lat: data.lat,
            lng: data.lng
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

exports.putMap = (req, res, next) => {
  const { id } = req.params;
  const { title, lat, lng } = req.body;
  const error = e => {
    throw e;
  };

  Map.findByIdAndUpdate(
    { _id: ObjectId(id) },
    { title: title, lat: lat, lng: lng }
  )
    .then(result => {
      if (result) {
        const newdata = {};
        newdata._id = result._id;
        newdata.title = result.title;
        newdata.lat = result.lat;
        newdata.lng = result.lng;

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

exports.postMap = (req, res, next) => {
  const { title, lat, lng } = req.body;
  const map = new Map({ title: title, lat: lat, lng: lng });
  const error = e => {
    throw e;
  };

  map
    .save()
    .then(() => {
      return Map.findOne({ title: title });
    })
    .then(found => {
      if (found) {
        const data = {};
        data._id = found._id;
        data.title = found.title;
        data.lat = found.lat;
        data.lng = found.lng;

        return res.status(201).json({
          success: true,
          message: 'data has been added',
          data: data
        });
      }

      error("can't add data");
    })
    .catch(err => {
      res.status(406).json({ message: err });
    });
};

exports.deleteMap = (req, res, next) => {
  const { id } = req.params;
  const error = e => {
    throw e;
  };

  Map.findByIdAndDelete({ _id: ObjectId(id) })
    .then(result => {
      if (result) {
        const newdata = {};
        newdata._id = result._id;
        newdata.title = result.title;
        newdata.lat = result.lat;
        newdata.lng = result.lng;

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

exports.getFindMap = (req, res, next) => {
  const { id } = req.params;
  const error = e => {
    throw e;
  };

  Map.findById({ _id: ObjectId(id) })
    .then(result => {
      if (result) {
        const newdata = {};
        newdata._id = result._id;
        newdata.title = result.title;
        newdata.lat = result.lat;
        newdata.lng = result.lng;

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
