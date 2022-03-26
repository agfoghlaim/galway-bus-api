const express = require('express');
const Calendar = require('../../models/calendar');
const router = express.Router();

// /api/calendar?monday=0&start_date=20210101&end_date=20231230
router.get('/', async (req, res) => {
	const query = {};
	if (req.query.service_id) {
		query.service_id = {
			$in: [Number(req.query.service_id), String(req.query.service_id)],
		};
	}
	if (req.query.start_before) {
		query.start_before = { $lte: req.query.start_before };
	}
	if (req.query.end_after) {
		query.end_after = { $gt: req.query.end_after };
	}
	if (req.query.monday) {
		query.monday = req.query.monday;
	}
	if (req.query.tuesday) {
		query.tuesday = req.query.tuesday;
	}
	if (req.query.wednesday) {
		query.wednesday = req.query.wednesday;
	}
	if (req.query.thursday) {
		query.thursday = req.query.thursday;
	}
	if (req.query.friday) {
		query.friday = req.query.friday;
	}
	if (req.query.saturday) {
		query.saturday = req.query.saturday;
	}
	if (req.query.sunday) {
		query.sunday = req.query.sunday;
	}
	console.log(query);
	const calendar = await Calendar.find(query, '-_id');
	return res.json({ results: calendar });
});
module.exports = router;
// ?monday=1&start_date=20200101&end_date=20231212
