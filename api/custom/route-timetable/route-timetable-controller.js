/* Today's timetable for one route. */
const {
	getServicesRunningToday,
	validateRouteShortName,
	maybeAddOffset
} = require('../../api-util');
const GTrip = require('../../../models/g_trip');
const { StopTime, GRoute } = require('../../../models');

// '/routetimetable/:routeid/:directionid'
exports.getTimetable = async (req, res) => {
	const routeShortName = validateRouteShortName(req.params.routeid);

	const direction = req.params.directionid;

	const { relevantServiceIds } = await getServicesRunningToday();

	// Trips running 'today'.

	const tripIds = await GTrip.find(
		{
			route_short_name: { $in: routeShortName },
			direction_id: direction,
			service_id: { $in: relevantServiceIds },
		},
		'-_id'
	).distinct('trip_id');

	const trips = await Promise.all(
		tripIds.map(async (tripId) => {
			const thisTrip = {};

			const stopTime = await StopTime.aggregate([
				{ $match: { trip_id: tripId } },
				{ $sort: { stop_sequence: 1 } },
				{
					$lookup: {
						from: 'stops',
						foreignField: 'stop_id',
						localField: 'stop_id',
						as: 'stopInfo',
					},
				},
				{ $unwind: '$stopInfo' },
				{
					$addFields: {
						stop_name: '$stopInfo.stop_name',
					},
				},
				{
					$project: {
						_id: 0,
						stopInfo: 0,
						stop_headsign: 0,
						pickup_type: 0,
						drop_off_type: 0,
						trip_id: 0,
					},
				},
			]);
			thisTrip.trip_id = tripId;
			thisTrip.stop_times = stopTime;
			return thisTrip;
		})
	);
	trips.sort((a, b) => {
		return a.stop_times[0].departure_time.localeCompare(
			b.stop_times[0].departure_time
		);
	});
	
	const withOffset = await maybeAddOffset(GRoute, routeShortName, direction, trips);

	return res.status(200).json({ results: { trips: withOffset } });
};
