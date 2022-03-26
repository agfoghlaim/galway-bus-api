const express = require('express');
const router = express.Router();
const gShapeController = require('./g-shape-controller.js');
const { wrapErrorHandler } = require('../../api-util.js');

router.get('/:tripid', wrapErrorHandler(gShapeController.handleGetGShape));

module.exports = router;
