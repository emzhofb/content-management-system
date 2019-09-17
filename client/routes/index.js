const express = require('express');
const router = express.Router();

const controller = require('../controllers/index');
const { isLoggedIn } = require('../middleware/auth');

/* GET home page. */
router.get('/', controller.getIndex);
router.get('/home', isLoggedIn, controller.getHome);
router.get('/data', isLoggedIn, controller.getData);
router.get('/datadate', isLoggedIn, controller.getDataDate);
router.get('/bar', controller.getBar);
router.get('/pie', controller.getPie);
router.get('/line', controller.getLine);

module.exports = router;
