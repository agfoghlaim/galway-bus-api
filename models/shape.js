const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shapesSchema = new Schema({
	shape_id: String,
	shape_pt_lat: Number,
	shape_pt_lon: Number,
	shape_pt_sequence: Number,
	shape_dist_traveled: Number,
});

const Shape = mongoose.model('Shape', shapesSchema);

module.exports = Shape;
