const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pickUpEnum = ['0', '1', '2', '3'];
const dropOffEnum = ['0', '1', '2', '3'];
const stopTimesSchema = new Schema({
	trip_id: String,
	arrival_time: String,
	departure_time: String,
	stop_id: String,
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
	shape_dist_traveled: Number, // is meters for BÉ
});

const StopTime = mongoose.model('StopTime', stopTimesSchema, 'stop_times');

module.exports = StopTime;
