const { getServicesRunningToday } = require('../../api-util');

const { getRTByTripIdMatch } = require('../real-time/real-time-controller');
const { handleGetRealTimeData } = require('../../../real-time.js');

const { GALWAY_ROUTES_LONG } = require('../../../consts');
const { GStop, GTrip } = require('../../../models');

exports.getRTStop = async function (req, res) {
	const stopId = req.params.stopid;

	//1, get route data
	const stop = await GStop.find({ stop_id: stopId });
	// if (stop.length !== 1) return res.error(''); // todo handle properly
	if (stop.length !== 1) {
		return res.json({ results: [] });
	}
	const routeData = stop[0].g_routes_data;

	// 2. get Trips (running today)
	const { relevantServiceIds } = await getServicesRunningToday();
	const trips = await Promise.all(
		routeData.map(async (rd) => {
			return await GTrip.find({
				route_short_name: rd.route_short_name,
				direction_id: rd.direction_id,
				service_id: { $in: relevantServiceIds },
			}).distinct('trip_id');
		})
	);

	// 3. get realtime
	const feed = await handleGetRealTimeData(GALWAY_ROUTES_LONG);

	// 4. filter for trips with rt
	const rtList = feed.results.entity.map((ent) => ent.id);
	const filteredTrips = trips.map((trip) => {
		return trip.filter((t) => {
			return rtList.includes(t);
		});
	});

	// 5. Get rt for these trips(matched)
	const getMatched = filteredTrips.map(
		async (route) =>
			await Promise.all(
				route.map(async (trip) => await getRTByTripIdMatch(trip))
			)
	);
	const matched = await Promise.all(getMatched);

	// 6. Filter out matches that are relevant to requested stopid
	const filteredMatches = matched.map((match) => {
		return match.map((trip) => {
			return trip.results.g_stop_times.filter((st) => st.stop_id === stopId);
		});
	});
	const flat = filteredMatches.map((match) => {
		return match.map((m) => {
			return m[0];
		});
	});
	return res.json({ results: flat[0].length ? flat[0] : [] });
};
