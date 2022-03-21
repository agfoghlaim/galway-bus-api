// Kind of the output version of a stop_time - pickup/dropoff& stop_headsign not included. Lots of extra stuff not in the gtfs gtop_time. These should eventually match graphql typedefs.

// module.exports = class StopTimeOutModel {
// 	constructor({
// 		trip_id = null,
// 		arrival_time = null,
// 		departure_time = null,
// 		stop_id = null,
// 		stop_sequence = null,
// 		trip_headsign = null,
// 		direction_id = null,
// 		last_stop_id = null,
// 		last_stop_name = null,
// 		last_stop_arrival_time = null,
// 		last_stop_stop_sequence = null,
// 		shape_dist_traveled = null,
// 	}) {
// 		this.stop_time = {
// 			trip_id: String(trip_id),
// 			arrival_time: String(arrival_time),
// 			departure_time: String(departure_time),
// 			stop_id: String(stop_id),
// 			stop_sequence: Number(stop_sequence),
// 			trip_headsign: String(trip_headsign),
// 			direction_id: String(direction_id),
// 			last_stop_id: String(last_stop_id),
// 			last_stop_name: String(last_stop_name),
// 			last_stop_arrival_time: String(last_stop_arrival_time),
// 			last_stop_stop_sequence: Number(last_stop_stop_sequence),
// 			shape_dist_traveled: Number(shape_dist_traveled),
// 		};
// 	}
// };

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StopTimeSchema = new Schema(
	{
		trip_id: String,
		arrival_time: String,
		departure_time: String,
		stop_id: String,
		stop_sequence: Number,
		trip_headsign: String,
		direction_id: String,
		last_stop_id: String,
		last_stop_name: String,
		last_stop_arrival_time: String,
		last_stop_stop_sequence: Number,
		shape_dist_traveled: Number,
	},
	{ versionKey: false, _id: false }
);


const StopTimeOutModel = mongoose.model('StopTimeOutModel', StopTimeSchema);

module.exports = StopTimeOutModel;
