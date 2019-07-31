const express = require('express');
const router = express.Router();

const dataController = require('../controllers/datas');

router.post('/search', dataController.postDataSearch);
router.get('/', dataController.getData);
router.put('/:id', dataController.putData);
router.post('/', dataController.postData);
router.delete('/:id', dataController.deleteData);
router.get('/:id', dataController.getFindData);

module.exports = router;
