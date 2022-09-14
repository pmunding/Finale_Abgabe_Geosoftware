var express = require("express");
var router = express.Router();

const { MongoClient, ObjectId } = require("mongodb");
const client = new MongoClient("mongodb://127.0.0.1:27017"); // localhost == 127.0.0.1
const dbName = "Gebirge";
const collectionName = "poi";
const axios = require("axios").default; //für Wikipedia

var beschreibung; //Beschreibung Filtern

/* GET edit page. */
router.get('/', async function(req, res, next) {
  res.render('manuell', { title: 'manuell'});
});


router.post('/hallo', function (req, res) {
  res.send('POST request to the homepage');
});


module.exports = router;