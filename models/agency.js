const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agencySchema = new Schema({
	agency_id: String,
	agency_name: String,
	agency_url: String,
	agency_timezone: String,
	agency_lang: String,
});

const Agency = mongoose.model('Agency', agencySchema, 'agency');

module.exports = Agency;
