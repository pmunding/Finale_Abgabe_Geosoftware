var express = require('express');
var router = express.Router();

/* GET create page. */
router.get('/', function(req, res, next) {
  res.render('wiki', { title: 'wiki' });
});

module.exports = router;

