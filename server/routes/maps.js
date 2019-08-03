const express = require('express');
const router = express.Router();

const { checkAuth } = require('../middleware/auth');
const mapController = require('../controllers/maps');

router.post('/search', checkAuth, mapController.postMapSearch);
router.get('/', checkAuth, mapController.getMap);
router.put('/:id', checkAuth, mapController.putMap);
router.post('/', checkAuth, mapController.postMap);
router.delete('/:id', checkAuth, mapController.deleteMap);
router.get('/:id', checkAuth, mapController.getFindMap);

module.exports = router;
