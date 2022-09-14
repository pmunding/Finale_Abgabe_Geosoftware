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

    this.drawnItem = false;
    this.drawnItems = new L.FeatureGroup().addTo(this.map);

    this.addDrawControls();
    this.addDrawEvents();
  }

  /**
  * @desc function adds leaflet Draw draw controls to the map
  */
  addDrawControls(){
    this.drawControl = new L.Control.Draw({
      draw:{
        polyline: false,
        polygon: true,
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

      if(type === "marker"){
        this.drawnItem = layer;
        drawnItems.addLayer(layer);
        console.log("created marker");
        var popupString = `
          <form action="/poi" method="post">
            <input id="name" name="name" value="" placeholder="name" style="margin: 5px;">
            <input id="hoehe" name="elevation" value="" placeholder="elevation" style="margin: 5px;">
            <input id="url" name="url" value="" placeholder="url" style="margin: 5px;">
            <input type="hidden" id="lat" name="lat" value="${layer._latlng.lat}">
            <input type="hidden" id="lng" name="lng" value="${layer._latlng.lng}">
            <input type="submit" value="Submit">
          </form>
        `;
        layer.bindPopup(popupString).openPopup();
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
