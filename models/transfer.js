const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transferSchema = new Schema({
	from_stop_id: String,
	to_stop_id: String,
	transfer_type: String,
	min_transfer_time: Number,

});

const Transfer = mongoose.model('Transfer', transferSchema);

module.exports = Transfer;
