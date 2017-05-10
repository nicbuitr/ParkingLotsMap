import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { ParkingLots } from '../api/parking_lots.js';
 
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
 
    ParkingLots.insert({
      text,
      createdAt: new Date(), // current time
    });
 
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
    return filteredParkingLots.map((parkingLot) => (
      <ParkingLot key={parkingLot._id} parkingLot={parkingLot} />
    ));
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

            <form className="new-parking-lot" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new parking lot"
              />
            </form>
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
};
 
export default createContainer(() => {
  return {
    parkingLots: ParkingLots.find({}, { sort: { createdAt: 1 } }).fetch(),
    incompleteCount: ParkingLots.find({ checked: { $ne: true } }).count(),
  };
}, App);