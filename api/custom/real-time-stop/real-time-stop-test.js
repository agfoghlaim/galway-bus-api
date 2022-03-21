require('dotenv').config();
const should = require('should');
const request = require('supertest');
const app = require('../../../app');
const agent = request.agent(app);
const _ = require('lodash');

describe('RealTime for single Stop, "/api/realtimestop/:stopid/"', function () {
	//api/realtime/gstoptimes/8460B5255401/404

	it(`should get an empty results array if stop is not found.`, function (done) {
		const fakeStopId = '123';

		agent
			.get(`/api/realtimestop/${fakeStopId}`)
			// .get(`/api/realtime/gstoptimes/8460B5255401/401/0`)
			.expect(200)
			.end(function (err, results) {
				should.exists(results.body.results);
				results.body.results.should.have.length(0);
				done();
			});
	});
	it(`should get results.`, function (done) {
		const stopId = '84605257301';

		agent
			.get(`/api/realtimestop/${stopId}`)
			// .get(`/api/realtime/gstoptimes/8460B5255401/401/0`)
			.expect(200)
			.end(function (err, results) {
				should.exists(results.body.results);
				results.body.results.should.not.have.length(0);
				results.body.results[0].should.have.property('rt').which.is.an.Object();
				results.body.results[0].rt.should.have
					.property('id')
					.which.is.a.String();
				results.body.results[0].rt.should.have
					.property('tripUpdate')
					.which.is.an.Object();

				done();
			});
	});
});
