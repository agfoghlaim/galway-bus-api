const express = require('express');
const router = express.Router();
const routeTimetableController = require('./route-timetable-controller.js');
const { wrapErrorHandler } = require('../../api-util.js');

// TODO dates
// '/routetimetable/:routeid/:directionid'
router.get('/:routeid/:directionid', wrapErrorHandler(routeTimetableController.getTimetable));

// router.get('/:routeid/:directionid', wrapErrorHandler(routeTimetableController.stopsTimetable ));
module.exports = router;

