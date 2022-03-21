const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const runningOrNot = ['0','1']
const calendarSchema = new Schema({
	// service_id: String, 
	service_id: String,
	monday: {
		type: String,
		enum: runningOrNot
	},
	tuesday: {
		type: String,
		enum: runningOrNot
	},
	wednesday: {
		type: String,
		enum: runningOrNot
	},
	thursday: {
		type: String,
		enum: runningOrNot
	},
	friday: {
		type: String,
		enum: runningOrNot
	},
	saturday: {
		type: String,
		enum: runningOrNot
	},
	sunday: {
		type: String,
		enum: runningOrNot
	},
	start_date: String,
	end_date: String,

})

const Calendar = mongoose.model('Calendar', calendarSchema, 'calendar'); // specify 'calendar' collection not 'calendars'!

module.exports = Calendar;