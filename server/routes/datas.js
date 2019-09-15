const express = require('express');
const router = express.Router();

const { checkAuth } = require('../middleware/auth');
const dataController = require('../controllers/datas');

router.post('/search', checkAuth, dataController.postDataSearch);
router.get('/', dataController.getData);
router.put('/:id', checkAuth, dataController.putData);
router.post('/', checkAuth, dataController.postData);
router.delete('/:id', checkAuth, dataController.deleteData);
router.get('/:id', checkAuth, dataController.getFindData);

module.exports = router;
