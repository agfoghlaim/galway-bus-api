const express = require('express');
const router = express.Router();

const prot = 'https';
const host = 'galway-bus.apis.ie';
router.get('/', function (req, res) {
	res.json({
		gstop: {
			base: `${prot}://${host}/api/gstop`,
			example: `${prot}://${host}/api/gstop/bystopid/8460B5228201`,
		},
		gstoptimes: {
			base: `${prot}://${host}/api/gstoptimes`,
			example: `${prot}://${host}/api/gstoptimes/bystopid/8460B5228201`,
		},
		groute: {
			base: `${prot}://${host}/api/groute`,
			example: `${prot}://${host}/api/groute/402`,
		},
		routetimetable: {
			base: `${prot}://${host}/api/routetimetable`,
			example: `${prot}://${host}/api/routetimetable/402/1`,
		},
		realtimestop: {
			base: `${prot}://${host}/api/realtimestop`,
			example: `${prot}://${host}/api/realtimestop/84605257301`,
		},
		realtime: {
			base: `${prot}://${host}/api/realtime`,
			example: `${prot}://${host}/api/realtime/gstoptimes/84605257301`,
		},
	});
});

router.use('/busroutes', require('./gtfs/busroutes.js'));

router.use('/stops', require('./gtfs/stops.js'));
router.use('/trips', require('./gtfs/trips.js'));
router.use('/agency', require('./gtfs/agency.js'));

router.use('/calendar', require('./gtfs/calendar.js'));
router.use('/calendardates', require('./gtfs/calendar_dates.js'));
router.use('/stoptimes', require('./gtfs/stoptimes.js'));
router.use('/shapes', require('./gtfs/shapes.js'));

// Custom
router.use('/gstop', require('./custom/g-stop/g-stop.js'));
router.use('/gstoptimes', require('./custom/stop-times/stop-times.js'));
router.use(
	'/routetimetable',
	require('./custom/route-timetable/route-timetable.js')
);

// Real Time
router.use('/realtime', require('./custom/real-time/real-time.js'));

// Get only gstoptimes for a stop that has rt data
router.use(
	'/realtimestop',
	require('./custom/real-time-stop/real-time-stop.js')
);

router.use('/groute', require('./custom/g-route/g-route.js'));

// shape
router.use('/shapebytripid', require('./custom/g-shape/g-shape.js'));

module.exports = router;
