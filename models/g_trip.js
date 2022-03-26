const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const directionEnum = ['0', '1'];
const lastStopInfoSchema = new mongoose.Schema(
	{
		stop_id: String,
		stop_lat: Number,
		stop_lon: Number,
		stop_name: String,
		arrival_time: String,
		stop_sequence: Number,
		shape_dist_traveled: Number,
	},
	{ _id: false }
);
const firstStopInfoSchema = new mongoose.Schema(
	{
		stop_id: String,
		stop_lat: Number,
		stop_lon: Number,
		stop_name: String,
		departure_time: String,
		stop_sequence: Number,
		shape_dist_traveled: Number,
	},
	{ _id: false }
);
const gTripSchema = new Schema(
	{
		route_id: String,
		route_short_name: String,
		service_id: String,
		trip_id: String,
		shape_id: String,
		trip_headsign: String,
		direction_id: {
			type: String,
			enum: directionEnum,
		},
		last_stop_info: lastStopInfoSchema,
		first_stop_info: firstStopInfoSchema,
	},
	{ versionKey: false }
);

const GTrip = mongoose.model('GTrip', gTripSchema, 'g_trips');

module.exports = GTrip;
