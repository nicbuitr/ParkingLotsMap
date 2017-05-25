import React, { Component, PropTypes } from 'react';
 
// ParkingLot component - represents a single todo item
export default class ParkingLot extends Component {
    constructor(props) {
        super(props);
    }
  

    openTab(evt, tabName) {
        evt.preventDefault();
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName('tabcontent');
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = 'none';
        }
        tablinks = document.getElementsByClassName('tablinks');
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(' active', '');
        }
        document.getElementById(tabName).style.display = 'block';
        evt.currentTarget.className += ' active';
    }

    render() {
        let feature = this.props.feature;
        let featureProps = feature.properties;
        let ret;
        if (feature.properties && feature.properties.name) {
            ret = (
        <div key={'popup_info_'+feature._id} className="popup-info">
          <div key={'initial_div_'+feature._id} id={'initial_div_'+feature._id} className="tab">
            <div className="content">
               <h4><strong>{featureProps.name}</strong></h4>
               <p> Operator: {featureProps.operator}</p>
               <p> Address: {featureProps.address}</p>
             </div>
           </div>
          <div key={'sviframe_div_'+feature._id} id={'street_view_lot_'+feature._id} className="tab">
            <div className="content">
               <h4><strong>{featureProps.name}</strong></h4>
               <p> Operator: {featureProps.operator}</p>
               <p> Address: {featureProps.address}</p>
               <hr/>
                <div className="popup-iframe">
                    <iframe key={'sviframe_'+feature._id} width="275" height="200" frameBorder="0" style={{border:0}} 
                    src={'https://www.google.com/maps/embed/v1/streetview?key=AIzaSyB2z6ukJIFTaOKN_cIsPKtDCQB_EkMQBuU&location='+feature.geometry.coordinates[1]+', '+feature.geometry.coordinates[0]+'&heading='+(feature.geometry.heading?feature.geometry.heading:0)+'&pitch='+(feature.geometry.pitch?feature.geometry.pitch:0)+'&fov='+(feature.geometry.fov?feature.geometry.fov:100)}
                     allowFullScreen=""></iframe>
                 </div>
             </div>
           </div>
           <div key={'info_lot_'+feature._id} id={'info_lot_'+feature._id} className="tab">
             <div className="content">
               <h4><strong>{featureProps.name}</strong></h4>
               <p> Operator: {featureProps.operator}</p>
               <p> Address: {featureProps.address}</p>
               <hr/>
                <div className="tabcontent">
                   <p> Operation Days: {featureProps.operationDays}</p>
                   <p> Operation Hours: {featureProps.operationHours}</p>
                   <p> Cars Admited: {featureProps.cars?'Yes':'No'}</p>
                   <p> Motorcycles Admited: {featureProps.motorcycles?'Yes':'No'}</p>
                   <p> Bicycles Admited: {featureProps.bicycles?'Yes':'No'}</p>
                 </div>
             </div>
           </div>
           <div key={'rates_lot_'+feature._id} id={'rates_lot_'+feature._id} className="tab">
             <div className="content">
               <h4><strong>{featureProps.name}</strong></h4>
               <p> Operator: {featureProps.operator}</p>
               <p> Address: {featureProps.address}</p>
               <hr/>
                <div className="tabcontent">
                 <p> Car Minute Rate: {featureProps.carRates.minute}</p>
                 <p> Car Hour Rate: {featureProps.carRates.hour}</p>
                 <p> Car Day Rate: {featureProps.carRates.day}</p>
                 <p> Car Month Rate: {featureProps.carRates.month}</p>
                 <p> Motorcycle Minute Rate: {featureProps.motorcycleRates.minute}</p>
                 <p> Motorcycle Hour Rate: {featureProps.motorcycleRates.hour}</p>
                 <p> Motorcycle Day Rate: {featureProps.motorcycleRates.day}</p>
                 <p> Motorcycle Month Rate: {featureProps.motorcycleRates.month}</p>
                 <p> Bicycle Minute Rate: {featureProps.bicycleRates.minute}</p>
                 <p> Bicycle Hour Rate: {featureProps.bicycleRates.hour}</p>
                 <p> Bicycle Day Rate: {featureProps.bicycleRates.day}</p>
                 <p> Bicycle Month Rate: {featureProps.bicycleRates.month}</p>
                 </div>
              </div>
           </div>
           <div key={'amenities_lot_'+feature._id} id={'amenities_lot_'+feature._id} className="tab">
             <div className="content">
               <h4><strong>{featureProps.name}</strong></h4>
               <p> Operator: {featureProps.operator}</p>
               <p> Address: {featureProps.address}</p>
               <hr/>
                <div className="tabcontent">
                   <p>24/7: {featureProps.amenities.fulltime?'Yes':'No'}</p>
                   <p>Covered: {featureProps.amenities.covered?'Yes':'No'}</p>
                   <p>Credit Card Accepted: {featureProps.amenities.ccAccepted?'Yes':'No'}</p>
                   <p>Debit Card Accepted: {featureProps.amenities.dcAccepted?'Yes':'No'}</p>
                   <p>Restroom: {featureProps.amenities.restroom?'Yes':'No'}</p>
                   <p>Handicap Spaces: {featureProps.amenities.handicapSpaces?'Yes':'No'}</p>
                   <p>Leave Key Required: {featureProps.amenities.leaveKeyReqd?'Yes':'No'}</p>
                   <p>Lockers: {featureProps.amenities.lockers?'Yes':'No'}</p>
                   <p>Helmet Storage: {featureProps.amenities.helmetStorage?'Yes':'No'}</p>
                   <p>Carwash: {featureProps.amenities.carWash?'Yes':'No'}</p>
                   <p>Motowash: {featureProps.amenities.motoWash?'Yes':'No'}</p>
                   <p>Bicyclewash: {featureProps.amenities.bicycleWash?'Yes':'No'}</p>
                   <p>Bicycle Repair Area: {featureProps.amenities.bicycleRepairArea?'Yes':'No'}</p>
                   <hr/>
                   <p>24/7: {featureProps.amenities.fulltime?'Yes':'No'}</p>
                   <p>Covered: {featureProps.amenities.covered?'Yes':'No'}</p>
                   <p>Credit Card Accepted: {featureProps.amenities.ccAccepted?'Yes':'No'}</p>
                   <p>Debit Card Accepted: {featureProps.amenities.dcAccepted?'Yes':'No'}</p>
                   <p>Restroom: {featureProps.amenities.restroom?'Yes':'No'}</p>
                   <p>Handicap Spaces: {featureProps.amenities.handicapSpaces?'Yes':'No'}</p>
                   <p>Leave Key Required: {featureProps.amenities.leaveKeyReqd?'Yes':'No'}</p>
                   <p>Lockers: {featureProps.amenities.lockers?'Yes':'No'}</p>
                   <p>Helmet Storage: {featureProps.amenities.helmetStorage?'Yes':'No'}</p>
                   <p>Carwash: {featureProps.amenities.carWash?'Yes':'No'}</p>
                   <p>Motowash: {featureProps.amenities.motoWash?'Yes':'No'}</p>
                   <p>Bicyclewash: {featureProps.amenities.bicycleWash?'Yes':'No'}</p>
                   <p>Bicycle Repair Area: {featureProps.amenities.bicycleRepairArea?'Yes':'No'}</p>
                 </div>
               </div>
           </div>
       </div>
        );
        }
        else{
            ret = (
       <div key={'popup_info_'+feature._id} className="popup-info">
          <div key={'sviframe_div_'+feature._id} id={'street_view_lot_'+feature._id} className="tab">
            <div className="content">
               <h4><strong>{featureProps.name}</strong></h4>
               <p> Operator: {featureProps.operator}</p>
               <p> Address: {featureProps.address}</p>
               <hr/>
                <div className="popup-iframe">
                    <iframe key={'sviframe_'+feature._id} width="275" height="200" frameBorder="0" style={{border:0}} 
                    src={'https://www.google.com/maps/embed/v1/streetview?key=AIzaSyB2z6ukJIFTaOKN_cIsPKtDCQB_EkMQBuU&location='+feature.geometry.coordinates[1]+', '+feature.geometry.coordinates[0]+'&heading='+(feature.geometry.heading?feature.geometry.heading:0)+'&pitch='+(feature.geometry.pitch?feature.geometry.pitch:0)+'&fov='+(feature.geometry.fov?feature.geometry.fov:100)}
                     allowFullScreen=""></iframe>
                 </div>
             </div>
           </div>
       </div>
        );
        }
        return (
      <span>
        <div className="tabs">
           <ul className="tabs-link">
              <a href={'#street_view_lot_'+feature._id}><li className="tab-link left-edge">StreetView</li></a>
              <a href={'#info_lot_'+feature._id}><li className="tab-link">Info</li></a>
              <a href={'#rates_lot_'+feature._id}><li className="tab-link">Rates</li></a>
              <a href={'#amenities_lot_'+feature._id}><li className="tab-link right-edge">Amenities</li></a>
           </ul>
        </div>
        <div key={'popup_content_'+feature._id} id={'popup_content_'+feature._id} className='popup-content'>
          {ret}
      </div>
    </span>
        );
    }
}
 
ParkingLot.propTypes = {
  // This component gets the parkingLot to display through a React prop.
  // We can use propTypes to indicate it is required
  //parkingLot: PropTypes.object.isRequired,
  //showPrivateButton: React.PropTypes.bool.isRequired,
};