const { query } = require('express');
const express = require('express');
const StopTime = require('../../models/stop_time.js');
const router = express.Router();

// Use keys from StopTime to query eg /api/stimes?stop_id=8460B5230101&after=09&sort=arrival_time&order=1 => StopTimes for stop id 8460B5230101 after 12pm sorted by arrival_time increasing.
router.get('/', async (req, res) => {
	// console.log(req.query);
	const query = {};
	const sort = {};
	if (req.query.trip_id) {
		query.trip_id = req.query.trip_id;
	}
	if (req.query.arrival_time) {
		query.arrival_time = req.query.arrival_time;
	}
	if (req.query.departure_time) {
		query.departure_time = req.query.departure_time;
	}
	if (req.query.after) {
		const m = { $gte: req.query.after };
		query.departure_time = m;
	}
	if (req.query.before) {
		query.departure_time = { $lte: req.query.before };
	}
	if (req.query.sort) {
		sort[req.query.sort] = parseInt(req.query.order) || 1;
	}
	if (req.query.stop_id) {
		query.stop_id = req.query.stop_id;
	}
	if (req.query.stop_sequence) {
		query.stop_sequence = req.query.stop_sequence;
	}
	if (req.query.stop_headsign) {
		query.stop_headsign = req.query.stop_headsign;
	}
	if (req.query.pickup_type) {
		query.pickup_type = req.query.pickup_type;
	}
	if (req.query.drop_off_type) {
		query.drop_off_type = req.query.drop_off_type;
	}
	if (req.query.shape_dist_traveled) {
		query.shape_dist_traveled = req.query.shape_dist_traveled;
	}

	// Return empty if there are no query params (Too many results).
	if (Object.entries(query).length === 0) {
		return res.json({ results: [] });
	}
	const stopTimes = await StopTime.find(query, '-_id').sort(sort);

	return res.json({ results: stopTimes });
});
module.exports = router;
