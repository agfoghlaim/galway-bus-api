const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// '3' = bus. Will always be 3.
const routeTypeEnum = ['1', '2', '3', '4', '5', '6', '7', '11', '12'];

const routesSchema = new Schema({
	route_id: String,
	agency_id: String,
	route_short_name: String,
	route_long_name: String,
	route_type: {
		type: String,
		enum: routeTypeEnum,
	},
});

const Route = mongoose.model('Route', routesSchema);

module.exports = Route;
