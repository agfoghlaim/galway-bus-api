module.exports = class RouteTimetableModel {
	constructor({
		trip_id = null,
		arrival_time = null,
		departure_time = null,
		stop_id = null,
		stop_sequence = null,
		shape_dist_traveled = null,
		stop_name = null,
	}) {
		this.trip_id = String(trip_id);
		this.arrival_time = String(arrival_time);
		this.departure_time = String(departure_time);
		this.stop_id = String(stop_id);
		this.stop_name = String(stop_name);
		this.stop_sequence = Number(stop_sequence);
		this.shape_dist_traveled = Number(shape_dist_traveled);
	}
};