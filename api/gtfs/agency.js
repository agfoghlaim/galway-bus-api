const express = require('express');
const Agency = require('../../models/agency.js');
const router = express.Router();

// /api/calendar?monday=0&start_date=20210101&end_date=20231230
router.get('/', async (req, res) => {
	const query = {};


	const agencies = await Agency.find(query, '-_id');
	return res.json({ results: agencies });
});
module.exports = router;