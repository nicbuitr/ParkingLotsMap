	import { Meteor } from 'meteor/meteor';
	import { Mongo } from 'meteor/mongo';
	import { check } from 'meteor/check';
	 
	export const ParkingLots = new Mongo.Collection('parking_lots');

	if (Meteor.isServer) {
	  // This code only runs on the server
	  Meteor.publish('parkingLots', function parkingLotsPublication() {
	    return ParkingLots.find();
	  });
	}

	Meteor.methods({
	  'parkingLots.insert'(text) {
	    check(text, String);
	 
	    // Make sure the user is logged in before inserting a parkingLot
	    if (! Meteor.userId()) {
	      throw new Meteor.Error('not-authorized');
	    }
	 
	    ParkingLots.insert({
	      text,
	      createdAt: new Date(),
	      owner: Meteor.userId(),
	      username: Meteor.user().username,
	    });
	  },
	  'parkingLots.remove'(parkingLotId) {
	    check(parkingLotId, String);

	    const parkingLot = ParkingLots.findOne(parkingLotId);
	    if (parkingLot.private && parkingLot.owner !== Meteor.userId()) {
	      // If the parkingLot is private, make sure only the owner can delete it
	      throw new Meteor.Error('not-authorized');
	    }
	 
	    ParkingLots.remove(parkingLotId);
	  },
	  'parkingLots.setChecked'(parkingLotId, setChecked) {
	    check(parkingLotId, String);
	    check(setChecked, Boolean);

	    const parkingLot = ParkingLots.findOne(parkingLotId);
	    if (parkingLot.private && parkingLot.owner !== Meteor.userId()) {
	      // If the parkingLot is private, make sure only the owner can check it off
	      throw new Meteor.Error('not-authorized');
	    }
	 
	    ParkingLots.update(parkingLotId, { $set: { checked: setChecked } });
	  },
	  'parkingLots.setPrivate'(parkingLotId, setToPrivate) {
	    check(parkingLotId, String);
	    check(setToPrivate, Boolean);
		 
	    const parkingLot = ParkingLots.findOne(parkingLotId);
		 
	    // Make sure only the parkingLot owner can make a parkingLot private
	    if (parkingLot.owner !== Meteor.userId()) {
	      throw new Meteor.Error('not-authorized');
	    }
	 
	    ParkingLots.update(parkingLotId, { $set: { private: setToPrivate } });
	  },
	});