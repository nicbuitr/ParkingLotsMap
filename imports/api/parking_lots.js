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
    'parkingLots.insert'(latlng) {
        check(latlng.lng, Number);
        check(latlng.lat, Number);
     
        // Make sure the user is logged in before inserting a parkingLot
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
     
        ParkingLots.insert({          
            geometry: {
                type: 'Point',
                coordinates: [latlng.lng, latlng.lat],
                heading: 213.62,
                pitch: 0,
                fov: 100
            },
            type: 'Feature',
            properties: {
                popupContent: 'This is a TEST Parking Lot',
                underConstruction: false,
                name: 'Parqueadero SD',
                operator: 'Sequrity Park',
                address: 'Calle 22 # 2-1 A 2-99',
                operationDays: 'Mon-Sat',
                operationHours: '8am-10pm',
                cars: true,
                motorcycles: true,
                bicycles: true,
                carRates: {
                    minute: 60000,
                    hour: 3000,
                    day: 20000,
                    month: 150000
                },
                motorcycleRates: {
                    minute: 30000,
                    hour: 1000,
                    day: 10000,
                    month: 75000
                },
                bicycleRates: {
                    minute: 10000,
                    hour: 500000,
                    day: 3000,
                    month: 25000
                },
                amenities: [
                    '24/7',
                    'Covered',
                    'Cards Accepted',
                    'Restroom',
                    'Handicap Spaces',
                    'No Vehicle Reacomodation',
                    'Lockers',
                    'Helmet Storage',
                    'Car Wash',
                    'Moto Wash',
                    'Bicycle Wash',
                    'Bicycle Repair Area'
                ]
            },
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
        alert('Insertado con éxito.');
    },
/*    'parkingLots.remove'(parkingLotId) {
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
      },*/
});