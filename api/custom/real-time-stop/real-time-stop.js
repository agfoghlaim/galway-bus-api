const express = require('express');
const router = express.Router();
const realTimeStopController = require('../real-time-stop/real-time-stop-controller.js');
const { wrapErrorHandler } = require('../../api-util.js');


// realtimestop
router.get(
	'/:stopid',
	wrapErrorHandler(realTimeStopController.getRTStop)
	);

module.exports = router;
