var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  poiId = req.query.id || false; //kurz für "entweder req.params.poiId, oder false wenn es undefined ist."
  res.render('index', { title: 'Home', poiID: poiId });
});

module.exports = router;
