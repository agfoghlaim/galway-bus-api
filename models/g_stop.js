const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const directions = ['0', '1'];
const gRouteData = new mongoose.Schema(
	{
		route_id: String,
		route_short_name: String,
		direction_id: {
			type: String,
			enum: directions,
		},
		g_route_headsign: String,

		// Stops could have a different stop_sequence for half trips early in the morning or late at night - 'typical' means on a full trip.
		typical_stop_sequence_on_route: Number,

	},
	{ _id: false }
);
const gStopSchema = new Schema(
	{
		stop_id: String,
		stop_name: String,
		stop_lat: Number,
		stop_lon: Number,
		g_routes_data: [gRouteData],
		g_routes: [String],
	},
	{ versionKey: false, _id: false }
);

const GStop = mongoose.model('GStop', gStopSchema, 'g_stops');

module.exports = GStop;
