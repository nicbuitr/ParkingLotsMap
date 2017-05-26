
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
4) Adecuar formulario para añadir nueva entrada con geoLocation
5) Organizar info del Popup
6) Encapsular en componentes de React
7) Organizar banner para que permita ser ocultado
8) Hacer Logo
9) Revisar el cumplimiento de los criterios requeridos para el proyecto 3 y 4
10) Agregar más parqueaderos.
11) Responsiveness*
12) Vídeo
<-- Check Hasta Acá. -->
/

/* global L*/
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import ReactDOMServer from 'react-dom/server';
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
            latlng: null,
            filters: [],
        };
    }
  
    handleSubmit(event) {
        event.preventDefault();
        this.state.latlng?Meteor.call('parkingLots.insert', this.state.latlng):alert('Latlng nulo.');
    }
  
    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
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

            L.control.locate({enableHighAccuracy: true}).addTo(map);
            map.on('locationfound',
            (e) => {
                this.state.latlng = e.latlng;
            });

            map.addControl( new L.Control.Search({
                url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
                jsonpParam: 'json_callback',
                propertyName: 'display_name',
                propertyLoc: ['lat','lon'],
                marker: L.circleMarker([0,0],{radius:30}),
                autoCollapse: true,
                autoType: false,
                zoom: 18,
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

        function updateProgressBar(processed, total, elapsed) {
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
            var popupContent = '';

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
                return L.marker(latlng, { title: feature.properties.name });
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
              <header id="header" className="collapse in">        
                <AccountsUIWrapper />
                <div className="col-md-12 text-center">
                    <img src="/img/logo.png" className="inline-img-responsive" alt="Parking Lots Map Logo"/>
                    <h4>Need a place to park? Find on this map the lot that fits you most!</h4>
                </div>
                { this.props.currentUser && this.props.currentUser._id == 'yCAY4Ae2ykQqJqqxj' ?
                  <div className="col-md-12 text-center">
                      <button aria-label="Add current location button" type="button" className="btn-primary btn-lg" onClick={this.handleSubmit.bind(this)}>Add Current Location</button>
                  </div> : ''
                }            
                {/**TODO Generar de forma dinámica los checkbox para filtrar */}  
                <div className="row" style={{visibility: 'hidden'}}>
                <label className="hide-completed">
                  <input type="checkbox" readOnly checked={this.state.hideCompleted} onClick={this.toggleHideCompleted.bind(this)}
                  />
                  Hide Completed ParkingLots
                </label>
                </div>

              </header>
                <button aria-label="Toggle show or hide header" type="button" className="banner-chevron btn-primary btn-lg leaflet-control" data-toggle="collapse" data-target="#header">
                    <span></span>
                </button>
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
        parkingLots: ParkingLots.find().fetch(),
        incompleteCount: ParkingLots.find({ checked: { $ne: false } }).count(),
        currentUser: Meteor.user(),
    };
}, App);