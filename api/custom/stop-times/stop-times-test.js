require('dotenv').config();
const should = require('should');
const request = require('supertest');
const app = require('../../../app');
const agent = request.agent(app);
const _ = require('lodash'); 


// TODO 	const stopIdWithNoSundayService = ''
describe('GStopTimes controller', function () {

	it(`should return an empty results[0].stop_times array if there are no services.`, function (done) {
		const fakeStopId = '123';
		agent
			.get(`/api/gstoptimes/bystopid/${fakeStopId}`)
			.expect(200)
			.end(function (err, results) {
	
				should.exists(results.body.results);
				results.body.results[0].g_stop_times.should.have.length(0);
				done();
			});
	});
	it(`should return an array with length 1 if stop is served by only one route`, function (done) {
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
	it(`should return an array with with 2 unique route/direction combinations if stop is served by 2 routes and neither one is specified`, function (done) {
		const stopIdServedByTwoRoutes = '8460B5235601';
		const otherStopIdServedByTwoRoutes = '8460B6355601';
		agent
			.get(`/api/gstoptimes/bystopid/${stopIdServedByTwoRoutes}`)
			.expect(200)
			.end(function (err, results) {
				should.exists(results.body.results);
				results.body.results.should.have.length(1);
				const strs = results.body.results[0].g_stop_times.reduce((acc,cur,all, i)=>{
					const str = `${cur.route_short_name}-${cur.direction_id}`;
					acc.push(str);
					return acc;
				},[])
				_.uniq(strs).length.should.equal(2);
				done();
			});
	});
	it(`should return an array with with 1 unique route/direction combination if stop is served by 2 routes and one IS specified`, function (done) {
		const stopIdServedByTwoRoutes = '8460B5235601';
		const route = '405';
		agent
			.get(`/api/gstoptimes/bystopidrouteid/${stopIdServedByTwoRoutes}/${route}`)
			.expect(200)
			.end(function (err, results) {
				should.exists(results.body.results);
				results.body.results.should.have.length(1);
				results.body.results[0].g_stop_times[0].route_short_name.should.equal(route);
				const strs = results.body.results[0].g_stop_times.reduce((acc,cur,all, i)=>{
					const str = `${cur.route_short_name}-${cur.direction_id}`;
					acc.push(str);
					return acc;
				},[])
				_.uniq(strs).length.should.equal(1);
				done();
			});
	});

	it(`should return date_used today as default`, function (done) {
		const stopId = '8460B526031';
		agent
			.get(`/api/gstoptimes/bystopid/${stopId}`)
			.expect(200)
			.end(function (err, results) {
				results.body.results[0].date
					.substring(0, 16)
					.should.equal(new Date().toUTCString().substring(0, 16));
				done();
			});
	});
});
