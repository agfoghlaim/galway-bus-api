require('dotenv').config();
require('should');
const request = require('supertest');
const app = require('../../../app');
const { GALWAY_ROUTES_INFO } = require('../../../consts.js');
const agent = request.agent(app);

describe('Check /api/routetimetable/:routeid/:direction', function () {
	for (const route in GALWAY_ROUTES_INFO) {
		//it(`rtshould list stops in order of stop_sequence`, function (done) {
		it(`(${GALWAY_ROUTES_INFO[route].name}) should list stops in order of stop_sequence`, function (done) {
			agent
				.get(`/api/routetimetable/401/1`)
				.expect(200)
				.end(function (err, results) {
					results.body.results.trips.map((route) => {
						route.stop_times.map((stop, i) =>
							stop.stop_sequence.should.equal(i + 1)
						);
					});

					done();
				});
		});
		it(`${GALWAY_ROUTES_INFO[route].routeName} should have the expected fields`, function (done) {
			agent
				.get(
					`/api/routetimetable/${GALWAY_ROUTES_INFO[route].routeName}/${GALWAY_ROUTES_INFO[route].direction}`
				)
				.expect(200)
				.end(function (err, results) {
					results.body.results.trips.forEach((trip) => {
						for (const s of trip.stop_times) {
							s.should.have.property('arrival_time').which.is.a.String();
							s.should.have.property('departure_time').which.is.a.String();
							s.should.have.property('stop_id').which.is.a.String();
							s.should.have.property('stop_sequence').which.is.a.Number();
							s.should.have.property('shape_dist_traveled').which.is.a.Number();
							s.should.have.property('stop_name').which.is.a.String();
						}
					});
					done();
				});
		});
	}
});
