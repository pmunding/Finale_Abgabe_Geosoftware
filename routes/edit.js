var express = require('express');
var router = express.Router();

const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb://127.0.0.1:27017"); // localhost == 127.0.0.1
const dbName = "Gebirge";
const collectionName = "poi";

/* GET edit page. */
router.get('/', async function(req, res, next) {
  res.render('edit', { title: 'Edit'});
});

module.exports = router;
