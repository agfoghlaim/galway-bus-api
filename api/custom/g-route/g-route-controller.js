const {  validateRouteShortName } = require('../../api-util');
const { GRoute } = require('../../../models');

exports.getGRoute = async function (routes = null, dirs) {

	const routeShortNames = validateRouteShortName(routes);
	const directions =
		(dirs && dirs === '0') || dirs === '1' ? [dirs] : ['0', '1'];

	const query = {};
	if (routeShortNames) {
		query.route_short_name = { $in: routeShortNames };
	}
	if (directions) {
		query.direction_id = { $in: directions };
	}

	const gRoutes = await GRoute.find(query, '-_id').sort({
		route_short_name: 1,
	});

	return gRoutes;
};

exports.handleGetGRoute = async function (req, res) {
	const routeInfoAlt = await exports.getGRoute(
		req.params.routeid,
		req.params.directionid
	);
	return res.json({ results: routeInfoAlt });
};
