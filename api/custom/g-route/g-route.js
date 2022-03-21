const express = require('express');
const router = express.Router();
const gRouteController = require('./g-route-controller.js');
const { wrapErrorHandler } = require('../../api-util.js');

// '/routeinfo' - gets all routes
router.get('/', wrapErrorHandler(gRouteController.handleGetGRoute));
router.get('/:routeid', wrapErrorHandler(gRouteController.handleGetGRoute));
router.get(
	'/:routeid/:directionid',
	wrapErrorHandler(gRouteController.handleGetGRoute)
);

module.exports = router;
