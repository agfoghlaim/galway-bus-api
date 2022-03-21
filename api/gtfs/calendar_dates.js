const express = require('express');
const CalendarDate = require('../../models/calendar_date.js');
const router = express.Router();

// /api/calendar?monday=0&start_date=20210101&end_date=20231230
router.get('/', async (req, res) => {
	const query = {};
	if(req.query.service_ids) {
		const ids = req.query.service_ids.split(',');
		query.service_id = {$in: ids };

	}
	if(req.query.date) {
		query.date = req.query.date;
	}
	if(req.query.exception_type) {
		query.exception_type = req.query.exception_type;
	}

	const calendarDates = await CalendarDate.find(query, '-_id');
	return res.json({ results: calendarDates });
});
module.exports = router;


