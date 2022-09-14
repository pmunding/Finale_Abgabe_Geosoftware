async function main(){
  //get pois und add to map
  const pois = await getPOI();
  mainMapInterface.addPois(pois)

  //fluff, dient nur dazu den marker zu öffnen der grade hingefügt wurde.
  let markerId = document.getElementById("markerID");
  
}

/**
* @desc get POIS
* @desc fetches all POI from server
*/
async function getPOI(){
  const response = await fetch('/poi').then(
    response => response.json()
  ).then(data => {
    return data
  }).catch((error) => {
    console.error('Error:', error);
  });;
  return response;
}


/** Class containing all methods for handling the map display on page */
class MapInterface{
  constructor(params){
    //initialise the map view from the given coordinates
    if( params.mapid === undefined ||
      params.baseMap === undefined ||
      params.baseMap.tileLayer === undefined
    ){
      console.log("couldn't initialise map-interface. invalid parameters");
      return false;
    }

    let mapid = params.mapid;
    let view = params.view || [0,0];
    let zoom = params.zoom || 6;
    let baseMap = params.baseMap;

    this.map = L.map(mapid).setView(view, zoom);
   

    //add basemaps
    this.baseMapLayer = L.tileLayer(
      baseMap.tileLayer, {
        maxZoom : baseMap.maxZoom || 15,
        attribution : baseMap.attribution || ""
      }
    );
    this.baseMapLayer.addTo(this.map);

    //create arrays that contain easily accessible references to all features of
    //each dataset
    //create groups wherein all the features of diffrent datasets will be contained
    this.poiIndex = [];
    this.poiGroup = new L.LayerGroup().addTo(this.map);

    this.drawnItems = new L.FeatureGroup().addTo(this.map);

  }

  /**
  * @desc function adds leaflet Draw draw controls to the map
  */
  addDrawControls(){
    this.drawControl = new L.Control.Draw({
      draw:{
        polyline: false,
        polygon: false,
        circle: false,
        rectangle: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: this.drawnItems
      }
    });
    this.map.addControl(this.drawControl);
  }

  /**
  * @desc function adds leaflet Draw Events.
  * In this case only the reactangle is considered.
  */
  addDrawEvents(){
    let drawnItems = this.drawnItems;
    let mapInterface = this;
    this.map.on(L.Draw.Event.CREATED, function(e){
      var type = e.layerType;
      var layer = e.layer;
      var polygon;

      if(type === "marker"){
        //do stuff
      }

    });
  }

  /**
  * @desc clear POIS
  * @desc removes all markers from the map when called
  */
  clearPois(){
    //empty the indices and featureGroups
    this.poiIndex = [];
    this.poiGroup.clearLayers();
  }

  /**
  * @desc adds pois to the map
  * @param {GeoJSON} featureCollection
  */
  addPois(featureCollection){
    const markerOpacity = 0.4;
    for(let feature of featureCollection.features){
      let markerCoords = [feature.geometry.coordinates[1],
      feature.geometry.coordinates[0]];
      let markerProperties = feature.properties;

      let marker = L.marker(markerCoords,
        //marker options
        {
          opacity : markerOpacity,
          riseOnHover: true
        }
      );

      //set cosmetics of the markers
      marker.on('mouseover', (e)=>{
        marker.setOpacity(1.0);
      });
      marker.on('mouseout', (e)=>{
        marker.setOpacity(markerOpacity);
      });

      //bind popup
      let popupString = `
      <b><a href="${markerProperties.url}">${markerProperties.url}</a></b>
      <br>${markerProperties.name}
      <br>${markerProperties.beschreibung}
      </ul>
      `;
      marker.markerID = feature._id || null;
      marker.bindPopup(popupString);

      //add the marker to markergroup, so it shows up on the map
      this.poiIndex.push(marker);
      this.poiGroup.addLayer(marker);
    }
  }

  /**
  * @desc opens a popup by the given mongodb _id
  * TODO: not sure if this works yet
  * @param {string} id
  */
  openPopup(id){
    //das setzt voraus dass featurecollection und poiGroup in selber reihenfolge sind
    for(let i = 0;  i < this.poiIndex.length; i++){
      if(this.poiIndex[i].markerID == id.value){
        this.poiIndex[i].openPopup();
      }
    }
  }
}



const mainMapInterface = new MapInterface(
  {
    mapid: "map",
    view: [51.96, 7.62],
    zoom: 12,
    baseMap: {
      tileLayer: 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  }
);








