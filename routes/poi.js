var express = require("express");
var router = express.Router();

const { MongoClient, ObjectId } = require("mongodb");
const client = new MongoClient("mongodb://127.0.0.1:27017"); // localhost == 127.0.0.1
const dbName = "Gebirge";
const collectionName = "poi";
const axios = require("axios").default; //für Wikipedia

var beschreibung;



/* GET POIS. */
router.get("/", async function (req, res, next) {
  //TODO
  await client.connect();
  console.log("client connected for get-request");
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  pois = await collection.find({}).toArray((err, result) => {
    if (err) {
      console.log(err);
      res.send("");
    }

    let markerArray = JSON.stringify(result);
    res.send(`
      {
        "type": "FeatureCollection",
        "features":${markerArray}
      }`);
  });
});

//Neue Pois an die Datenbank schicken
router.post("/", async function (req, res) {
  await client.connect();
  console.log("client connected for post-request");
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  //Aufruf der Axios Funktion und getBeschreibung

  pruefen(req.body.url); //Prüfen auf Links korrektheit und anschliessend Bechreibung holen 

  //Timeout um auf antwort des Axios zu warten 
  setTimeout(function () {
    var erg = beschreibung;
    console.log("------------------------------");
    console.log(erg);
    if (
      req.body.url == "" ||
      req.body.elevation == "" ||
      req.body.name == "" ||
      req.body.lat == "" ||
      req.body.lng == ""
    ) {
      console.log("insufficient parameters. redirecting");
      res.redirect("/create");
    } else {
      //Json poi erstellen 
      let poi = {
        type: "Feature",
        properties: {
          shape: "Marker",
          name: req.body.name,
          beschreibung: erg,
          url: req.body.url,
          elevation: req.body.elevation,
        },
        geometry: {
          type: "Point",
          coordinates: [req.body.lng, req.body.lat],
        },
      };

      // Der Datenbank hinzufügen 
      collection.insertOne(poi, function (err, result) {
        console.log(
          `Inserted ${result.insertedCount} document into the collection`
        );
        res.render("index", {
          title: "Home",
        });
      });
    }
  }, 1500);
});

router.delete("/", async function (req, res, next) {
  console.log(req.body);

  await client.connect();
  console.log("client connected for delete-request");
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  //delete each
  for (id of req.body.ids) {
    let objid = ObjectId(id);
    collection.deleteOne({ _id: objid });
  }

  //send redirect link
  res.send("/edit");
});

module.exports = router;

/************************************************************/
//Anfrage an die Wikipedia API mit Axios
/************************************************************/
function pruefen(x){
  if (!isValidHttpUrl(x)) {
    console.log("-----------------1----------------");
    console.log = "Keine Informationen verfügbar";
    // Prüfen, ob der Link kein wikipedialink ist
  } else if (x.indexOf("wikipedia") === -1) {
    console.log("-----------------2----------------");
    console.log = "Keine Informationen verfügbar";
  } else {
    console.log("-----------------3----------------");
    console.log(x)
    let y = x.split("/");
    console.log(y);
    let title = y[y.length - 1];
    console.log(title)
    getBeschreibung(title);
  }
}

/**
 * Ermittelt die Beschreibung aus Wikipedia mit Axios
 * Startwert ist die url 
 * @param {x} x 
 */
async function getBeschreibung(x) {
  (async () => {

    let title = x; //urlArray[urlArray.length - 1];

    let response = await axiosAbfrage(title);
    // Beschreibung aus der response rausfiltern
    const pageKey = Object.keys(response.data.query.pages)[0];
    beschreibung = response.data.query.pages[pageKey].extract;
    console.log("-----------------Beschreibung----------------");
    console.log(beschreibung);
  })();
}

/**
 * Axios request
 * @param {*} title 
 * @returns title
 */
async function axiosAbfrage(title) {
  return axios.get(
    "https://de.wikipedia.org/w/api.php?format=json&exintro=1&action=query&prop=extracts&explaintext=1&exsentences=2&origin=*&titles=" +
      title
  );
}

//prüfen ob der Link ein Link ist
function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
