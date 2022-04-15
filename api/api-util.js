require('dotenv').config();
const {
	GALWAY_ROUTES_SHORT,
	GALWAY_ROUTES_TO_SHORT_ARRAY_STRING,
	DAYS,
} = require('../consts.js');
const { CalendarDate, Calendar } = require('../models');

const { createError } = require('../util');

// Util
exports.getDateStringFromYYYYMMDD = function (yymmdd) {
	const string = yymmdd.trim();
	if (string.trim().length !== 8) {
		return false;
	}
	const y = string.substring(0, 4);
	const m = string.substring(4, 6);
	const d = string.substring(6, 8);
	const dateString = `${y}-${m}-${d}`;
	return dateString;
};
// Util
exports.dateCorrectlyFormatted = function (yyyymmdd) {
	if (!yyyymmdd) {
		return false;
	}
	const dateString = exports.getDateStringFromYYYYMMDD(yyyymmdd);

	if (dateString && new Date(dateString).toString() !== 'Invalid Date') {
		return true;
	}
	return false;
};

// API Util
exports.getServicesRunningToday = async function (yyyymmdd) {
	// in is either '20201212' or null;
	const dateToUse = yyyymmdd
		? yyyymmdd // eg.'20201212' or null
		: getNow(); // today in yyyymmdd format

	const dateString = exports.getDateStringFromYYYYMMDD(dateToUse);
	const date = new Date(dateString);
	const confirmDateUsed = date.toUTCString();
	const useDay = DAYS[date.getDay()];

	// const useDay = DAYS[new Date(dateString).getDay()];
	const exceptionsToday = await CalendarDate.find({ date: `${dateToUse}` });

	// TODO Enums...
	// if exceptions. exception_type: 2 => cancelled service
	// if exceptions.exception_type: 1 => extra service
	const addedServices = [];
	const removedServices = [];

	exceptionsToday.forEach((exception) => {
		if (exception.exception_type === '2') {
			removedServices.push(exception.service_id);
		}
		if (exception.exception_type === '1') {
			addedServices.push(exception.service_id);
		}
	});

	const servicesToday = await Calendar.find({
		[useDay]: '1',
		$expr: { $lte: [{ $toInt: '$start_date' }, Number(dateToUse)] },
		// eslint-disable-next-line no-dupe-keys
		$expr: { $gt: [{ $toInt: '$end_date' }, Number(dateToUse)] },
	});

	const servicesTodayIds = servicesToday
		.map((service) => {
			// check service id not listed in calendar_date exceptions
			if (!removedServices.includes(service.service_id)) {
				return service.service_id;
			}
		})
		.filter((service) => service !== undefined);

	const relevantServiceIds = servicesTodayIds.concat(addedServices);
	const ans = {
		dateUsed: confirmDateUsed,
		relevantServiceIds,
	};
	return ans;

	function getNow() {
		const x = new Date();
		const y = x.getFullYear().toString();
		let m = (x.getMonth() + 1).toString();
		let d = x.getDate().toString();

		// TODO test this (today is 12th nov - no leading zeros)
		d.length == 1 && (d = '0' + d);
		m.length == 1 && (m = '0' + m);

		return y + m + d;
	}
};

exports.filterByTripIds = function (feed, departuresToday) {
	const tripIds = departuresToday.map((dep) => dep.trip_id);

	const ans = feed.filter((s) => tripIds.includes(s.id));
	return ans;
};

exports.matchStopsWithRTTrips = function (
	departuresToday,
	matchingTrips,
	timestamp
) {
	const departuresWithRealTimeAppended = departuresToday.map((dep) => {
		// Get any trips in the feed that match this departure. [] or [FeedEntity]
		const relevantTrips = matchingTrips.filter((trip) => {
			if (trip.id === dep.trip_id) {
				return trip;
			}
			return false;
		});

		// Copy the departure
		const depWithRT = { ...dep };
		depWithRT.rt = relevantTrips[0] || null; // TODO remove this eventually.
		depWithRT.rt_timestamp = timestamp;
		// depWithRT.rtDate = new Date(timestamp * 1000).toISOString()

		return depWithRT;
	});

	// Now we have Departure{...departure, rt:{TripUpdate}, rtTimestamp}. Need to go through departures and get specifics out of dep.rt. Set {...departure, departure_delay, arrival_delay, rt_info}
	const ans = [];
	departuresWithRealTimeAppended.map((dep) => {
		const thisDeparture = {
			...dep,
		};

		// Scenario 1. No Realtime
		if (!dep.rt) {
			thisDeparture.departure_delay = null;
			thisDeparture.arrival_delay = null;
			thisDeparture.rt_info = 'No Realtime data available';
			ans.push(thisDeparture);
			return;
		}

		// Scenario 2. Realtime listed specifically for this stop
		const isListed = dep.rt.tripUpdate.stopTimeUpdate.filter(
			(update) => Number(update.stopSequence) === Number(dep.stop_sequence)
		);

		// TODO intermittant error '.delay of undefined'
		if (isListed.length) {
			//dodge...
			thisDeparture.departure_delay =
				isListed[0].departure && typeof isListed[0].departure.delay === 'number'
					? isListed[0].departure.delay
					: null;

			// thisDeparture.departure_delay = isListed[0].departure.delay;
			thisDeparture.arrival_delay = isListed[0].arrival
				? isListed[0].arrival.delay
				: null;
			thisDeparture.rt_info = `Realtime data listed for this stop.`;
			ans.push(thisDeparture);
			return;
		}

		// Scenario 3. Propogate Realtime listed for first previous stop
		const relUpdates = dep.rt.tripUpdate.stopTimeUpdate.filter((update) => {
			return update.stopSequence < Number(dep.stop_sequence);
		});

		if (relUpdates.length) {
			const relUpdate = relUpdates[relUpdates.length - 1];

			thisDeparture.departure_delay =
				typeof relUpdate.departure.delay === 'number'
					? relUpdate.departure.delay
					: null;

			thisDeparture.arrival_delay = relUpdate.arrival
				? relUpdate.arrival.delay
				: null;
			thisDeparture.rt_info = `Realtime data propogated from stop ${relUpdate.stopSequence} in route (this is stop ${dep.stop_sequence} in route).`;
			ans.push(thisDeparture);
			return;
		}

		// Scenario 4. First Reattime is listed AFTER stop sequence.
		// NOTE: This is not tested (it can happen because google gtfs docs mentions)
		if (
			dep.rt &&
			dep.stop_sequence < dep.rt.tripUpdate.stopTimeUpdate[0].stopSequence
		) {
			thisDeparture.departure_delay = null;
			thisDeparture.arrival_delay = null;
			thisDeparture.rt_info = `No realtime data available for this stop (${dep.stop_sequence}).`;
			ans.push(thisDeparture);
			return;
		}

		// Default to this (something is wrong.)
		console.log('api-util.js: Returning no rt data but something is wrong...');
		thisDeparture.departure_delay = null;
		thisDeparture.arrival_delay = null;
		thisDeparture.rt_info = 'No Realtime data available*';
		ans.push(thisDeparture);
		return;
	});
	return ans;
};

exports.wrapErrorHandler = (controller) => {
	return function (req, res, next) {
		return controller(req, res, next).catch((e) => {
			// Mongodb errors.
			if (e.ok === 0) {
				console.error('Mongo Error: ', e.message);
				next(createError(500, 'Database Error.')); // app.js handles
			}

			// Real time request error from TFI.
			if (e.errorIsTFI) {
				console.error('Server Error: ', e.message, e.status);
				// next(createError(e.status, e.message)); // app.js handles

				// TODO need to check this when gtfs-r feed is 500ing.
				return res.json(createError(e.status, e.message))
			}

			// All other errors.
			console.error('Server Error: ', e.message, e.status);
			next(createError(500, 'Server Error.')); // app.js handles
		});
	};
};

exports.validateRouteShortName = function (routeId) {
	if (GALWAY_ROUTES_SHORT.includes(parseInt(routeId))) {
		// already short
		const ans = routeId.toString();
		return [ans];
	}
	const short = GALWAY_ROUTES_TO_SHORT_ARRAY_STRING[routeId];
	if (short) {
		const ans = short.toString();
		return [ans];
	}
};

exports.maybeAddOffset = async function (
	GRoute,
	routeShortName,
	direction,
	trips
) {
	const route = await GRoute.findOne({
		route_short_name: routeShortName,
		// route_id: routeId,
		direction_id: direction,
	});
	const stopsOnRoute = route.g_stops;
	const numStopsOnRoute = route.g_stops.length;

	// For half routes add offset info.
	const withOffset = trips.map((trip) => {
		const offsetDets = {};
		const stops = [...trip.stop_times];
		const lastIndex = trip.stop_times.length - 1;

		// If it is a 'half' trip.
		if (trip.stop_times.length !== numStopsOnRoute) {
			offsetDets.first_stop_id = trip.stop_times[0].stop_id;
			offsetDets.first_stop_name = trip.stop_times[0].stop_name;
			offsetDets.last_stop_id = trip.stop_times[lastIndex].stop_id;
			offsetDets.last_stop_name = trip.stop_times[lastIndex].stop_name;

			// If the trip does NOT begin at the expected first stop...
			if (trip.stop_times[0].stop_id !== stopsOnRoute[0].stop_id) {
				// set first_stop_offset.
				offsetDets.first_stop_offset = numStopsOnRoute - trip.stop_times.length;
			}
		}
		return {
			trip_id: trip.trip_id,
			offset_dets: { ...offsetDets },
			stop_times: stops,
		};
	});
	return withOffset;
};
