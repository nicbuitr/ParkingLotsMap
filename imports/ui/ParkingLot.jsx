import React, { Component, PropTypes } from 'react';
import { ParkingLots } from '../api/parking_lots.js';
 
// ParkingLot component - represents a single todo item
export default class ParkingLot extends Component {
  
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    ParkingLots.update(this.props.parkingLot._id, {
      $set: { checked: !this.props.parkingLot.checked },
    });
  }

  deleteThisParkingLot() {
    ParkingLots.remove(this.props.parkingLot._id);
  }

  render() {
    // Give parkingLots a different className when they are checked off,
    // so that we can style them nicely in CSS
    const parkingLotClassName = this.props.parkingLot.checked ? 'checked' : '';
    return (
      <li className={parkingLotClassName}>
        <button className="delete" onClick={this.deleteThisParkingLot.bind(this)}>&times;</button>
         <input
          type="checkbox"
          readOnly
          checked={this.props.parkingLot.checked}
          onClick={this.toggleChecked.bind(this)}
        />
      	<span className="text">{this.props.parkingLot.text}</span>      	
      </li>
    );
  }
}
 
ParkingLot.propTypes = {
  // This component gets the parkingLot to display through a React prop.
  // We can use propTypes to indicate it is required
  parkingLot: PropTypes.object.isRequired,
};