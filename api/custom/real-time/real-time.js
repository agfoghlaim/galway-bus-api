const express = require('express');
const router = express.Router();
const realTimeController = require('../real-time/real-time-controller.js');
const { wrapErrorHandler } = require('../../api-util.js');

// TODO this amalgamates rt into stoptimes unlike other realtime routes. Should be called something different.

// Returns specific route.

// Returns all routes if stop is on more than one.
router.get(
	'/gstoptimes/:stopid',
	wrapErrorHandler(realTimeController.getRTStopTimesByStopIdRouteId)
	);

	router.get(
		'/gstoptimes/:stopid/:routeid',
		wrapErrorHandler(realTimeController.getRTStopTimesByStopIdRouteId)
	);

	// stop_id 8460B5255401 goes both directions on 404
	router.get(
		'/gstoptimes/:stopid/:routeid/:directionid',
		wrapErrorHandler(realTimeController.getRTStopTimesByStopIdRouteId)
	);

router.get('/galway', wrapErrorHandler(realTimeController.getGalwayRT));

router.get('/all', wrapErrorHandler(realTimeController.getAllRT));
router.get('/bytripid/:tripid', wrapErrorHandler(realTimeController.getRTByTripId));
router.get('/bytripidmatch/:tripid', wrapErrorHandler(realTimeController.handleGetRTByTripIdMatch));

module.exports = router;
