const eingabe = document.querySelector("#textfeld_json").value; //Eingabe des Textfeldes
var alsJson;

/**
* @desc look at table and submit the delete request
*/
function addGeojson(){
    console.log(eingabe)
    if(isJsonString(eingabe)){
        alsJson = JSON.parse(eingabe);
        console.log(alsJson);
        console.log(alsJson.properties.url);
        
    } else {
        console.log("ist kein json");
    }
  }

//prüfen ob im Textfeld auch wirklich ein JSON ist
function isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  

  