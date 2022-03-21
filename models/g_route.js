const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const directions = ['0', '1'];
const stop = new mongoose.Schema(
	{
		stop_id: String, 
		stop_name: String,
		stop_lat: Number,
		stop_lon: Number,
	},
	{ _id: false }
);
const gRouteSchema = new Schema(
	{
		route_id: String,
		route_short_name: String,
		route_long_name: String,
		direction_id: {
			type: String,
			enum: directions
		},
		g_route_description: String,
		g_route_alt_name_1: String,
		g_route_alt_name_2: String,
		g_stops: [stop],
	},
	{ versionKey: false }
);

// const GRoute = mongoose.model('GRoute', gRouteSchema, 'g_routes');
 const GRoute = mongoose.model('GRoute', gRouteSchema, 'g_routes_unique');

module.exports = GRoute;
