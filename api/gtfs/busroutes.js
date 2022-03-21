const express = require('express');
const Route = require('../../models/route');
const router = express.Router();

router.get('/', async (req, res) => {
	const query = {};
	if (req.query.route_id) {
		query.route_id = req.query.route_id;
	}
	if (req.query.agency_id) {
		query.agency_id = req.query.agency_id;
	}
	if (req.query.route_short_name) {
		query.route_short_name = req.query.route_short_name;
	}
	if (req.query.route_long_name) {
		query.route_long_name = req.query.route_long_name;
	}
	if (req.query.route_type) {
		query.route_type = req.query.route_type;
	}

	// console.log(query)
	const route = await Route.find(query, '-_id');
	return res.json({ results: route });
});
module.exports = router;
