import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { ParkingLots } from '../api/parking_lots.js';
import classnames from 'classnames';
 
// ParkingLot component - represents a single todo item
export default class ParkingLot extends Component {
  
  toggleChecked() {
    // Set the checked property to the opposite of its current value
 	Meteor.call('parkingLots.setChecked', this.props.parkingLot._id, !this.props.parkingLot.checked);
  }

  deleteThisParkingLot() {
   	Meteor.call('parkingLots.remove', this.props.parkingLot._id);
  }

  togglePrivate() {
    Meteor.call('parkingLots.setPrivate', this.props.parkingLot._id, ! this.props.parkingLot.private);
  }

  render() {
    // Give parkingLots a different className when they are checked off,
    // so that we can style them nicely in CSS
    const parkingLotClassName = classnames({
      checked: this.props.parkingLot.checked,
      private: this.props.parkingLot.private,
    });
    return (
      <li className={parkingLotClassName}>
        <button className="delete" onClick={this.deleteThisParkingLot.bind(this)}>&times;</button>
         <input
          type="checkbox"
          readOnly
          checked={this.props.parkingLot.checked}
          onClick={this.toggleChecked.bind(this)}
        />

        { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.parkingLot.private ? 'Private' : 'Public' }
          </button>
        ) : ''}

        <span className="text">
          <strong>{this.props.parkingLot.username}</strong>: {this.props.parkingLot.text}
        </span>    	
      </li>
    );
  }
}
 
ParkingLot.propTypes = {
  // This component gets the parkingLot to display through a React prop.
  // We can use propTypes to indicate it is required
  parkingLot: PropTypes.object.isRequired,
  showPrivateButton: React.PropTypes.bool.isRequired,
};