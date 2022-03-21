const express = require('express');
const Stop = require('../../models/stop');
const router = express.Router();

// TODO text search on stop_name (has to be on atlas).
router.get('/', async (req, res) => {
	const query = {};
	if (req.query.stop_id) {
		query.stop_id = req.query.stop_id;
	}
	if (req.query.stop_name) {
		query.stop_name = req.query.stop_name;
	}
	if (req.query.stop_lat) {
		query.stop_lat = req.query.stop_lat;
	}
	if (req.query.stop_lon) {
		query.stop_lon = req.query.stop_lon;
	}
	const stop = await Stop.find(query, '-_id');

	return res.json({ results: stop });
});
module.exports = router;
