const express = require('express');
const router = express.Router();
const routeTimetableController = require('./route-timetable-controller.js');
const { wrapErrorHandler } = require('../../api-util.js');

// TODO dates - it only gets today's timetable

router.get(
	'/:routeid/:directionid',
	wrapErrorHandler(routeTimetableController.getTimetable)
);

module.exports = router;
