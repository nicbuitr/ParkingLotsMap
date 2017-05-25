
/**TODO
1) Agregar y definir campos para parqueaderos:
  - Horario
  - Dirección
  - Nombre
  - Tarifas (Minuto, Hora, Plena, Mensualidad?)
  - Carro, Moto, Bicicleta?
  - Caracteristicas: Cubierto, 24/7, Aceptan Tarjetas, Baño, Espacios Para Discapacitados, Dejar Llave?, Casilleros, Guarda Cascos, Lavado
  - Operador
2) Obtener GeoLocation y añadir search bar
3) Organizar tamaño del popup
Check.
4) Adecuar formulario para añadir nueva entrada con geoLocation
4.5) Organizar info del Popup
5) Organizar banner para que permita ser ocultado
6) Hacer Logo
7) Revisar el cumplimiento de los criterios requeridos para el proyecto 3 y 4
8) Implementar login con API de Facebook
9) Agregar más parqueaderos.
10) Responsiveness*/

import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server'
import { ParkingLots } from '../api/parking_lots.js';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import ParkingLot from './ParkingLot.jsx';
 
// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);
 
    this.state = {
      hideCompleted: false,
      map: null,
      layer: null,
    };
  }
  
  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    Meteor.call('parkingLots.insert', text);
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
  
  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderParkingLots() {
    let filteredParkingLots = this.props.parkingLots;
    if (this.state.hideCompleted) {
      filteredParkingLots = filteredParkingLots.filter(parkingLot => !parkingLot.checked);
    }
    return filteredParkingLots.map((parkingLot) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = parkingLot.owner === currentUserId;
 
      return (
        <ParkingLot
          key={parkingLot._id}
          parkingLot={parkingLot}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  componentDidMount() {
      document.documentElement.lang = 'en';

      let map = this.state.map;

      if (!this.state.map){
        map = L.map('map').setView([4.625826,-74.0923325], 11);
        //map = L.map('map').setView([39.74739, -105], 12);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibmljYnVpdHIiLCJhIjoiY2oydHJmODRrMDBiYTMzanhxbzk2YnFudiJ9.KRyluyVgDk_ShZOYEuW1Wg', {
          maxZoom: 18,
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>, ' +
            'App by &copy; 2017 <a href="https://github.com/nicbuitr/ParkingLotsMap">Nicol&aacute;s Buitrago C</a>',
          id: 'mapbox.streets'
        }).addTo(map);
/*        map.locate({setView: true}) /* This will return map so you can do chaining 
        .on('locationfound', function(e){
            var circle = L.circleMarker(e.latlng, {
            radius: 8,
            fillColor: "white",
            color: "#1b76c8",
            weight: 4,
            opacity: 1,
            fillOpacity: 0.8
          }).bindPopup('Your are here.');
            map.addLayer(circle);
        })
       .on('locationerror', function(e){
            console.log(e);
            alert("Location access denied.");
        });*/


        let lc = L.control.locate().addTo(map);
        map.on('locationfound',
          (e) => {
            console.log("locationFound: "+e.latlng);
          });

        map.addControl( new L.Control.Search({
            url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
            jsonpParam: 'json_callback',
            propertyName: 'display_name',
            propertyLoc: ['lat','lon'],
            marker: L.circleMarker([0,0],{radius:30}),
            autoCollapse: true,
            autoType: false,
            minLength: 2
          }) );
      }
    if (this.state.layer){
      if (map.hasLayer(this.state.layer)) {
          map.removeLayer(this.state.layer);
      }
    }

  
  var progress = document.getElementById('progress');
  var progressBar = document.getElementById('progress-bar');

  function updateProgressBar(processed, total, elapsed, layersArray) {
    if (elapsed > 1000) {
      // if it takes more than a second to load, display the progress bar:
      progress.style.display = 'block';
      progressBar.style.width = Math.round(processed/total*100) + '%';
    }

    if (processed === total) {
      // all markers processed - hide the progress bar:
      progress.style.display = 'none';
    }
  }

  var markers = L.markerClusterGroup({ chunkedLoading: true, chunkProgress: updateProgressBar });
  var markerList = [];

  function onEachFeature(feature, layer) {
    var popupContent = "";

    if (feature.properties && feature.properties.popupContent) {
      popupContent += feature.properties.popupContent;
    }
    popupContent = ReactDOMServer.renderToString(<ParkingLot key={'parking_lot_'+feature._id} feature={feature} />);
    layer.bindPopup(popupContent);
    markerList.push(layer);
  }

  L.geoJSON(this.props.parkingLots, {

    filter: function (feature, layer) {
      if (feature.properties) {
        // If the property "underConstruction" exists and is true, return false (don't render features under construction)
        return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
      }
      return false;
    },
    onEachFeature: onEachFeature,

    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, { title: feature.id });
    }
  });


    markers.addLayers(markerList);
    map.addLayer(markers);
    this.state.layer = markers;
    this.state.map = map;
  }

 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Parking Lots ({this.props.incompleteCount})</h1>
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed ParkingLots
          </label>
          
          <AccountsUIWrapper />
          { this.props.currentUser ?

            <form className="new-parking-lot" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new parking lot"
              />
            </form> : ''
          } 
        </header>
 
        <div id="progress"><div id="progress-bar"></div></div>
        <div id='map'></div>
        {this.state.map?this.componentDidMount():''}
      </div>
    );
  }
}

App.propTypes = {
  parkingLots: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};
 
export default createContainer(() => {
  Meteor.subscribe('parkingLots');
  return {
    parkingLots: ParkingLots.find({}, { sort: { createdAt: 1 } }).fetch(),
    incompleteCount: ParkingLots.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);