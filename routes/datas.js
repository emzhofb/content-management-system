const express = require('express');
const router = express.Router();

const dataController = require('../controllers/datas');

router.post('/', dataController.addData);
router.delete('/:id', dataController.deleteData);

module.exports = router;
