const { validateRouteShortName } = require('../../api-util.js');
const { GRoute, GStop } = require('../../../models');

exports.getGStopsByRouteDirection = async function (req, res) {
	const routeShortName = validateRouteShortName(req.params.routeid);
	const directionId = req.params.directionid;

	const query = {};
	if (routeShortName) {
		query.route_short_name = { $in: routeShortName };
	}
	if (directionId) {
		query.direction_id = directionId;
	}
	const routes = await GRoute.find(query, '-_id');

	// Bail early if there are no routes.
	if (!routes || !routes.length) {
		return res.json({ results: { routes: [] } });
	}

	const potentiallyBothDirections = routes.map(async (route) => {
		// Use loop because route.g_stops are in order of stop sequence ($in is free for all).
		const getStops = route.g_stops.map(async (stop) => {
			return await GStop.findOne({ stop_id: stop.stop_id }, '-_id');
		});
		return await Promise.all(getStops);
	});

	const ans = await Promise.all(potentiallyBothDirections);

	const checkSortedByStopSequence = ans.map((route) => {
		return route.sort((a, b) => {
			return a._doc.g_stop_sequence - b._doc.g_stop_sequence;
		});
	});

	return res.json({ results: { routes: checkSortedByStopSequence } });
};

exports.getGStopsByStopId = async function (req, res) {
	const stopids = req.params.stopid ? req.params.stopid.split(',') : null;
	const query = {};
	if (stopids) {
		query.stop_id = { $in: stopids };
	}
	const stops = await GStop.find(query, '-_id');

	return res.json({ results: { stops } });
};
