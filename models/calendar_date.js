const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const calendarDateSchema = new Schema({
	service_id: String, 
	date: String,
	exception_type: String,
});

const CalendarDate = mongoose.model(
	'CalendarDate',
	calendarDateSchema,
	'calendar_dates'
);

module.exports = CalendarDate;
