var express = require('express');
var router = express.Router();
const mainController = require('../controllers');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'URL shortener with Nodejs' });
});

router.get('/:code', mainController.getUrl);

module.exports = router;
