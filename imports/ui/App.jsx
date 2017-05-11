import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { ParkingLots } from '../api/parking_lots.js';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import ParkingLot from './ParkingLot.jsx';
 
// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);
 
    this.state = {
      hideCompleted: false,
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
 
        <ul>
          {this.renderParkingLots()}
        </ul>
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