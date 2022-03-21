const express = require('express');
const router = express.Router();


router.use('/busroutes', require('./gtfs/busroutes.js'));

router.use('/stops', require('./gtfs/stops.js'));
router.use('/trips', require('./gtfs/trips.js'));
router.use('/agency', require('./gtfs/agency.js'));

router.use('/calendar', require('./gtfs/calendar.js'));
router.use('/calendardates', require('./gtfs/calendar_dates.js'));
router.use('/stoptimes', require('./gtfs/stoptimes.js'));
router.use('/shapes', require('./gtfs/shapes.js'));
// Fancy
// router.use('/routelist', require('./custom/route-list/route-list.js'));
router.use('/gstop', require('./custom/g-stop/g-stop.js'));
router.use('/gstoptimes', require('./custom/stop-times/stop-times.js'));
router.use(
	'/routetimetable',
	require('./custom/route-timetable/route-timetable.js')
);
router.use('/', require('./custom/stop-times/stop-times.js'));

/**
 * Real Time
 */
router.use('/realtime', require('./custom/real-time/real-time.js'));
router.use('/realtimestop', require('./custom/real-time-stop/real-time-stop.js'));

router.use('/groute', require('./custom/g-route/g-route.js'));

// shape
router.use('/shapebytripid', require('./custom/g-shape/g-shape.js'));


module.exports = router;
