require('dotenv').config();
require('should');
const request = require('supertest');
const app = require('../../../app');
const { GALWAY_ROUTES_INFO } = require('../../../consts.js');
const agent = request.agent(app);

describe('Check /api/gstop/byrouteid/:routeid/:direction returns correct no. stops (as defined in GALWAY_ROUTES_INFO), ordered by stop_sequence', function () {
	for (const route in GALWAY_ROUTES_INFO) {
		it(`(${GALWAY_ROUTES_INFO[route].name}) should have ${GALWAY_ROUTES_INFO[route].numStops} stops listed in order of stop_sequence`, function (done) {
			agent
				.get(
					`/api/gstop/byrouteid/${GALWAY_ROUTES_INFO[route].routeName}/${GALWAY_ROUTES_INFO[route].direction}`
				)
				.expect(200)
				.end(function (err, results) {
					results.body.results.routes[0].should.have.length(
						GALWAY_ROUTES_INFO[route].numStops
					);
					// const stopSequences = results.body.results.routes[0].map((stop) => {
					// 	const relRouteData = stop.g_routes_data.find(
					// 		(routeData) =>
					// 			routeData.route_short_name ===
					// 				GALWAY_ROUTES_INFO[route].routeName &&
					// 			routeData.direction_id === GALWAY_ROUTES_INFO[route].direction
					// 	);
					// 	return relRouteData.typical_stop_sequence_on_route;
					// });
					// stopSequences.map((s, i) => s.should.equal(i + 1));
					done();
				});
		});
		it(`${GALWAY_ROUTES_INFO[route].routeName} should have the expected fields`, function (done) {
			agent
				.get(
					`/api/gstop/byrouteid/${GALWAY_ROUTES_INFO[route].routeName}/${GALWAY_ROUTES_INFO[route].direction}`
				)
				.expect(200)
				.end(function (err, results) {
					for (const r of results.body.results.routes[0]) {
						r.should.have.property('stop_id').which.is.a.String();
						r.should.have.property('stop_name').which.is.a.String();
						r.should.have.property('stop_lat').which.is.a.Number();
						r.should.have.property('stop_lon').which.is.a.Number();
						r.should.have.property('g_routes_data').which.is.an.Object();
						r.should.have.property('g_routes').which.is.an.Array();
					}
					done();
				});
		});
	}
});
describe('Check /api/gstop/bystopid', function () {
	const someStopId = '8460B5228201';
	const someOtherStopId = '8460B5230101'
	const fakeStopId = '123';
	it(`(/api/gstop/bystopid) should get all (348) gstops stops`, function (done) {
		agent
			.get(`/api/gstop/bystopid`)
			.expect(200)
			.end(function (err, results) {
				results.body.results.stops.should.have.length(348);

				done();
			});
	});
	it(`(/api/gstop/bystopid/:stopid) should get 1 stop`, function (done) {
		agent
			.get(`/api/gstop/bystopid/${someStopId}`)
			.expect(200)
			.end(function (err, results) {
				results.body.results.stops.should.have.length(1);
				done();
			});
	});
	it(`(/api/gstop/bystopid/:stopid,:stopid) should get 2 stops`, function (done) {
		agent
			.get(`/api/gstop/bystopid/${someStopId},${someOtherStopId}`)
			.expect(200)
			.end(function (err, results) {
				results.body.results.stops.should.have.length(2);
				done();
			});
	});
	it(`(/api/gstop/bystopid/:stopid,:stopid,fake) should still get 2 stops`, function (done) {
		agent
			.get(`/api/gstop/bystopid/${someStopId},${fakeStopId},${someOtherStopId}`)
			.expect(200)
			.end(function (err, results) {
				results.body.results.stops.should.have.length(2);
				done();
			});
	});
});
