require('dotenv').config();
const should = require('should');
const request = require('supertest');
const app = require('../../../app');
const agent = request.agent(app);
const _ = require('lodash');

describe('RealTime for StopTimes controller, "/api/realtime/gstoptimes/"', function () {
	this.timeout(8000); // see https://mochajs.org/#timeouts. It can take ages to get a response from the feed.
	//api/realtime/gstoptimes/8460B5255401/404

	it(`should get an empty results array if stop is not found.`, function (done) {
		const fakeStopId = '123';

		agent
			.get(`/api/realtime/gstoptimes/${fakeStopId}`)
			// .get(`/api/realtime/gstoptimes/8460B5255401/401/0`)
			.expect(200)
			.end(function (err, results) {
				should.exists(results.body.results);
				results.body.results.should.have.length(0);
				done();
			});
	});
	it(`should get results containing a date and g_stop_times array.`, function (done) {
		const stopIdServedByBothDirectionsOfOneRoute = '8460B5255401';
		agent
			.get(`/api/realtime/gstoptimes/${stopIdServedByBothDirectionsOfOneRoute}`)
			// .get(`/api/realtime/gstoptimes/8460B5255401/401/0`)
			.expect(200)
			.end(function (err, results) {
				should.exists(results.body.results);
				results.body.results[0].should.have
					.property('date')
					.which.is.a.String();
				results.body.results[0].should.have
					.property('g_stop_times')
					.which.is.an.Array();

				done();
			});
	});
	it(`should get an empty results.length = 2 if stop is served by both directions and no route or direction is specified.`, function (done) {
		const stopIdServedByBothDirectionsOfOneRoute = '8460B5255401';
		agent
			.get(`/api/realtime/gstoptimes/${stopIdServedByBothDirectionsOfOneRoute}`)
			// .get(`/api/realtime/gstoptimes/8460B5255401/401/0`)
			.expect(200)
			.end(function (err, results) {
				should.exists(results.body.results);
				results.body.results.should.have.length(2);
				done();
			});
	});
	it(`should get an array with length 1 if stop is served by only one route/direction`, function (done) {
		const stopIdServedByOneRoute = '8460B5234601';
		agent
			.get(`/api/gstoptimes/bystopid/${stopIdServedByOneRoute}`)
			.expect(200)
			.end(function (err, results) {
				should.exists(results.body.results);
				results.body.results.should.have.length(1);
				done();
			});
	});
	it(`should get today's date`, function (done) {
		const stopIdServedByOneRoute = '8460B5234601';
		agent
			.get(`/api/gstoptimes/bystopid/${stopIdServedByOneRoute}`)
			.expect(200)
			.end(function (err, results) {
				should.exists(results.body.results);
				results.body.results[0].date.exists;
				results.body.results[0].date
					.substring(0, 16)
					.should.equal(new Date().toUTCString().substring(0, 16));
				done();
			});
	});
});
