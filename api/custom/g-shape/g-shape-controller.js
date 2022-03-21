// get shape with a trip id. Use gtfs/models shape
const { Shape, GTrip } = require('../../../models');

exports.handleGetGShape = async function (req, res) {
	const { tripid } = req.params;
	const trip = await GTrip.findOne({ trip_id: tripid }, '-_id');
	if (!trip) {
		return res.json({ results: [] });
	}
	const shapeId = trip.shape_id;
	const shape = await Shape.find({ shape_id: shapeId }, '-_id').sort(
		'shape_pt_sequence'
	);
	return res.json({ results: shape });
};
