const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pickUpEnum = ['0', '1', '2', '3'];
const dropOffEnum = ['0', '1', '2', '3'];
const gStopTimesSchema = new Schema({
	trip_id: String,
	arrival_time: String,
	departure_time: String,
	stop_id: String,
	stop_name: String,
	stop_lon: Number,
	stop_lat: Number,
	stop_sequence: Number,
	stop_headsign: String, // is empty string for BÉ
	pickup_type: {
		type: String,
		enum: pickUpEnum,
	},
	drop_off_type: {
		type: String,
		enum: dropOffEnum,
	},
	route_short_name: String,
	direction_id: String,
	trip_headsign: String,
	first_stop_id: String,
	first_stop_name: String,
	last_stop_id: String,
	last_stop_name: String,
	shape_dist_traveled: Number, // is meters for BÉ
	service_id: String,
	route_id: String,
}, { versionKey: false, _id: false });

const GStopTime = mongoose.model('GStopTime', gStopTimesSchema, 'g_stoptimes');

module.exports = GStopTime;
