const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stopsSchema = new Schema({
	stop_id: String,
	stop_name: String,
	stop_lat: Number,
	stop_lon: Number,
});

const Stop = mongoose.model('Stop', stopsSchema);

module.exports = Stop;
