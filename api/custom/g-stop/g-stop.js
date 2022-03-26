const express = require('express');
const router = express.Router();
const gStopsController = require('./g-stop-controller');
const { wrapErrorHandler } = require('../../api-util.js');

// '/routestops'
router.get('/', wrapErrorHandler(gStopsController.getGStopsByRouteDirection));
router.get(
	'/byrouteid/:routeid',
	wrapErrorHandler(gStopsController.getGStopsByRouteDirection)
);
router.get(
	'/byrouteid/:routeid/:directionid',
	wrapErrorHandler(gStopsController.getGStopsByRouteDirection)
);
router.get(
	'/bystopid/:stopid',
	wrapErrorHandler(gStopsController.getGStopsByStopId)
);
router.get(
	'/bystopid/',
	wrapErrorHandler(gStopsController.getGStopsByStopId)
);

module.exports = router;
