const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const directionEnum = ['0', '1'];
const tripsSchema = new Schema({
	route_id: String,
	service_id: String,
	trip_id: String,
	shape_id: String,
	trip_headsign: String,
	direction_id: {
		type: String,
		enum: directionEnum,
	},
});

const Trip = mongoose.model('Trip', tripsSchema);

module.exports = Trip;
