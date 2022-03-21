const express = require('express');
const router = express.Router();
const stopTimesController = require('./stop-times-controller.js');
const { wrapErrorHandler } = require('../../api-util.js');
// '/stoptimes/:routeid/:directionid'
router.get(
	'/bystopid/:stopid/',
	wrapErrorHandler(stopTimesController.getStopTimesByStopIdRouteId)
);
router.get(
	'/bystopid/:stopid/:date',
	wrapErrorHandler(stopTimesController.getStopTimesByStopIdRouteId)
);
router.get(
	'/bystopidrouteid/:stopid/:routeid/',
	wrapErrorHandler(stopTimesController.getStopTimesByStopIdRouteId)
);

// directionid will be '0', '1' or for (potentially) both directions - '2'
router.get(
	'/bystopidrouteid/:stopid/:routeid/:directionid',
	wrapErrorHandler(stopTimesController.getStopTimesByStopIdRouteId)
);
router.get(
	'/bystopidrouteid/:stopid/:routeid/:directionid/:date',
	wrapErrorHandler(stopTimesController.getStopTimesByStopIdRouteId)
);
router.get(
	'/bytripid/:tripid',
	wrapErrorHandler(stopTimesController.handleGetStopTimesByTripId)
);

module.exports = router;
