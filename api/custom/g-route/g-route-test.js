require('dotenv').config();
const should = require('should');
const request = require('supertest');
const app = require('../../../app');
const agent = request.agent(app);
const _ = require('lodash');

describe('/api/groute', function () {
	it(`(/api/groute) should get all 20 route-directions`, function (done) {
		agent
			.get(`/api/groute`)
			.expect(200)
			.end(function (err, results) {
				should.exists(results.body.results);
				results.body.results.should.have.length(20);

				done();
			});
	});
	it(`should have the expected fields`, function (done) {
		agent
			.get(`/api/groute`)
			.expect(200)
			.end(function (err, results) {
				results.body.results.forEach((res, i) => {
					res.should.have.property('route_short_name').which.is.a.String();
					res.should.have.property('direction_id').which.is.a.String();
					res.should.have.property('route_long_name').which.is.a.String();
					res.should.have.property('g_trip_headsign').which.is.a.String();
					res.should.have.property('g_route_variations').which.is.an.Array();
					res.should.have.property('g_stops').which.is.an.Array();
					res.should.have.property('g_route_ids').which.is.an.Array();
				});
				done();
			});
	});
});
describe('/api/groute/:route_short_name', function () {
	const routeShortName = '405';
	const route_id_one = '10-405-e19-1';
	const route_id_two = '10-405-e20-1';
	it(`should get two routes - one for each direction`, function (done) {
		agent
			.get(`/api/groute/${routeShortName}`)
			.expect(200)
			.end(function (err, results) {
				should.exists(results.body.results);
				results.body.results.should.have.length(2);
				done();
			});
	});
	it(`should also get two routes - if the long version of the route_id is used`, function (done) {
		agent
			.get(`/api/groute/${route_id_one}`)
			.expect(200)
			.end(function (err, results) {
				should.exists(results.body.results);
				results.body.results.should.have.length(2);
				done();
			});
	});
	it(`should also get two routes - if the other long version of the route_id is used`, function (done) {
		agent
			.get(`/api/groute/${route_id_two}`)
			.expect(200)
			.end(function (err, results) {
				should.exists(results.body.results);
				results.body.results.should.have.length(2);
				done();
			});
	});
});
describe('/api/groute/:route_short_name/:direction_id', function () {
	const routeShortName = '401';
	const directionId = '1';
	it(`should get one route - for specified direction`, function (done) {
		agent
			.get(`/api/groute/${routeShortName}/${directionId}`)
			.expect(200)
			.end(function (err, results) {
				should.exists(results.body.results);
				results.body.results.should.have.length(1);
				results.body.results[0].direction_id.should.equal(directionId);
				results.body.results[0].route_short_name.should.equal(routeShortName);

				done();
			});
	});
});
