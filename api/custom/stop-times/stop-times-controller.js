/* Stop times for one stop (defaults to today) */

const {
	getServicesRunningToday,
	dateCorrectlyFormatted,
	validateRouteShortName,
} = require('../../api-util');
const _ = require('lodash');
const { createError } = require('../../../util');
const { GTrip, GStop, GStopTime } = require('../../../models');

/**
 *
 * @param {string} relRouteId  must be long form ie route_id not route_short_name
 * @param {*} relevantServiceIds
 * @param {*} directionIds
 * @returns
 */
async function getTrips(relRouteId, relevantServiceIds, directionIds) {
	const tripsQuery = {
		route_short_name: relRouteId,
		service_id: { $in: relevantServiceIds },
		direction_id: directionIds,
	};
	const t = await GTrip.find(tripsQuery).distinct('trip_id');
	return t;
}

async function getGStopTimes(stopId, trips) {
	const match = {
		trip_id: { $in: trips },
	};
	if (stopId) {
		match.stop_id = stopId;
	}

	return await GStopTime.aggregate([
		{
			$match: match,
		},
		{ $sort: { departure_time: 1 } },
		{
			$project: {
				_id: 0,
			},
		},
	]);
}

function getRelevantRoutes(someGStop) {
	const allRouteDataIds = someGStop.g_routes_data.map(
		(d) => d.route_short_name
	);
	return _.uniq(allRouteDataIds); // could be both directions
}

exports.getStopTimesById = async function (
	stopId,
	routeId = null,
	directionIds = ['0', '1'],
	date = null
) {
	// There's an argument for moving this to getRelevantRoutes() but it makes sense to check that the stopId exists before continuing.
	const stop = await GStop.findOne({ stop_id: stopId }, '-_id');

	if (!stop) {
		return { stop_times_date: null, routes: [] };
	}

	// Get everything if no routeId passed.
	const relevantRoutes = routeId
		? validateRouteShortName(routeId)
		: getRelevantRoutes(stop);

	const { relevantServiceIds, dateUsed } = await getServicesRunningToday(date);

	const ans = await Promise.all(
		relevantRoutes.map(async (relRouteId) => {
			const dirAns = await Promise.all(
				directionIds.map(async (direction) => {
					const trips = await getTrips(
						relRouteId,
						relevantServiceIds,
						direction
					);

					const stopTimes = await getGStopTimes(stopId, trips);

					if (!stopTimes.length) {
						return [];
					}

					return {
						stop_times: stopTimes,
					};
				})
			);
			return { directions: dirAns };
		})
	);

	const flat = ans.reduce((acc, route) => {
		const flatter = route.directions.filter((dir) => {
			return dir.stop_times ? true : false;
		});
		if (flatter.length) {
			flatter.map((w) => acc.push(w));
		}
		return acc;
	}, []);

	return { stop_times_date: dateUsed, routes: flat };
};

exports.getStopTimesByTripId = async function (tripId) {
	return await GStopTime.find({ trip_id: tripId }, '-_id').sort(
		'stop_sequence'
	);
};

exports.getStopTimesByStopIdRouteId = async function (req, res, next) {
	const { stopid, date } = req.params;

	const directionid =
		req.params.directionid === '0'
			? ['0']
			: req.params.directionid === '1'
			? ['1']
			: ['0', '1'];

	if (date && !dateCorrectlyFormatted(date)) {
		return next(createError(400, 'format date yyyymmdd'));
	}

	const { stop_times_date, routes } = await exports.getStopTimesById(
		stopid,
		req.params.routeid,
		directionid,
		date,
		res
	);

	const ans = routes.map((r) => {
		return r.stop_times.map((s) => new GStopTime(s));
	});

	const concat = [];
	ans.forEach((route) => {
		route.forEach((st) => concat.push(new GStopTime(st)));
	});
	return res.json({
		results: [{ date: stop_times_date, g_stop_times: concat }],
	});
};

exports.handleGetStopTimesByTripId = async function (req, res) {
	const tripId = req.params.tripid;

	const stop_times = await GStopTime.find({ trip_id: tripId }, '-_id');
	res.json({
		results: {
			g_stop_times: stop_times,
		},
	});
};
