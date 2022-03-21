const {
	filterByTripIds,
	matchStopsWithRTTrips,
	validateRouteShortName
} = require('../../api-util');

const {
	getStopTimesById,
	getStopTimesByTripId,
} = require('../stop-times/stop-times-controller');
const { handleGetRealTimeData } = require('../../../real-time.js');

const { GALWAY_ROUTES_LONG } = require('../../../consts');
const { Trip } = require('../../../models');

exports.getRTStopTimesByStopIdRouteId = async function (req, res) {
	const stopId = req.params.stopid;
	const directionId =
		req.params.directionid === '0'
			? ['0']
			: req.params.directionid === '1'
			? ['1']
			: ['0', '1'];

	const routeId = validateRouteShortName(req.params.routeid);

	const { stop_times_date, routes: routeStopTimes } = await getStopTimesById(
		stopId,
		routeId,
		directionId,
		null // ie. use today's date.
	);

	const feed = await handleGetRealTimeData(GALWAY_ROUTES_LONG);

	const appendRealTime = await routeStopTimes.map(async (routeStopTimes) => {
		// Filter feed for Trip Updates relating to this route.
		const matchingTrips = filterByTripIds(
			feed.results.entity,
			routeStopTimes.stop_times
		);

		// Append rt data to stopTimes. NOTE: timestamp object for feed vs string for cached feed. (?)
		const stopTimesWithRT = await matchStopsWithRTTrips(
			routeStopTimes.stop_times,
			matchingTrips,
			feed.results.header.timestamp.low || feed.results.header.timestamp
		);

		// date is date used to query calendar for service_ids. RT has it's own timestamp
		const data = { date: stop_times_date, g_stop_times: stopTimesWithRT };
		return data;
	});

	const ans = await Promise.all(appendRealTime);
	return res.json({ results: ans });
};

exports.getAllRT = async function (_, res) {
	const feed = await handleGetRealTimeData();

	return res.json(feed);
};

exports.getGalwayRT = async function (_, res) {
	const feed = await handleGetRealTimeData(GALWAY_ROUTES_LONG);

	return res.json(feed);
};

exports.getRTByTripId = async function (req, res) {
	const feed = await handleGetRealTimeData(null, [req.params.tripid]);

	return res.json(feed);
};

exports.handleGetRTByTripIdMatch = async function (req, res) {
	const ans = await exports.getRTByTripIdMatch(req.params.tripid);
	return res.json(ans);
};

// TODO this is lazy (copy of the above controller) , need to use in real-time-stop
exports.getRTByTripIdMatch = async function (tripId) {
	const feed = await handleGetRealTimeData(GALWAY_ROUTES_LONG);

	// TODO !!!
	const s = await getStopTimesByTripId(tripId);
	// return res.send(s);
	const stopTimes = s.map((a) => a._doc);
	const matchingTrips = filterByTripIds(feed.results.entity, stopTimes);

	const stopTimesWithRT = await matchStopsWithRTTrips(
		stopTimes,
		matchingTrips,
		feed.results.header.timestamp.low || feed.results.header.timestamp
	);
	const tripInfo = await Trip.findOne({ trip_id: tripId }, '-_id');

	// date is date used to query calendar for service_ids. RT has it's own timestamp
	const data = { trip: tripInfo, g_stop_times: stopTimesWithRT };

	return { results: data };
};
