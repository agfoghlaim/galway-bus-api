const express = require('express');
const Trip = require('../../models/trip');
const router = express.Router();

router.get('/', async (req, res) => {
	const query = {};

	if (req.query.route_id) {
		query.route_id = req.query.route_id;
	}
	if (req.query.service_id) {
		query.service_id = req.query.service_id;
	}
	if (req.query.trip_id) {
		query.trip_id = req.query.trip_id;
	}
	if (req.query.shape_id) {
		query.shape_id = req.query.shape_id;
	}
	if (req.query.trip_headsign) {
		query.trip_headsign = req.query.trip_headsign;
	}
	if (req.query.direction_id) {
		query.direction_id = req.query.direction_id;
	}

	const trips = await Trip.find(query, '-_id');

	return res.json({ results: trips });
});
module.exports = router;
