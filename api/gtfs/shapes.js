const express = require('express');
const Shape = require('../../models/shape');
const router = express.Router();

router.get('/', async (req, res) => {
	const query = {};

	if (req.query.shape_id) {
		query.shape_id = req.query.shape_id;
	}

	const shapess = await Shape.find(query, '-_id').sort({
		shape_pt_sequence: 1,
	});

	return res.json({ results: shapess });
});
module.exports = router;
