const express = require('express');
const router = express.Router();

const { checkAuth } = require('../middleware/auth');
const datadateController = require('../controllers/datadates');

router.post('/search', checkAuth, datadateController.postSearchDatadate);
router.get('/', checkAuth, datadateController.getDataDate);
router.put('/:id', checkAuth, datadateController.putDataDate);
router.post('/', checkAuth, datadateController.postDataDate);
router.delete('/:id', checkAuth, datadateController.deleteDataDate);
router.get('/:id', checkAuth, datadateController.getFindDataDate);

module.exports = router;
