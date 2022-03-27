const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const request = require('request');
require('dotenv').config();

const NodeCache = require('node-cache');
const rtCache = new NodeCache({ stdTTL: 2000, checkperiod: 2020 });
const config = require('config');
const apiKey = config.get('apiKey');

/* 
// For Heroku. See comment in app.js
let apiKey = undefined;
if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'dev') {
	apiKey = config.get('apiKey');
} else {
	apiKey = process.env.HEROKU_API_KEY;
}
*/

const getRealTimeData = async function () {
	const requestSettings = {
		method: 'GET',
		url: 'https://gtfsr.transportforireland.ie/v1',
		encoding: null,
		headers: { 'x-api-key': apiKey },
	};

	return new Promise((resolve, reject) => {
		request(requestSettings, function (error, response, body) {
			if (response && !error && response.statusCode == 200) {
				const feed =
					GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
				resolve(feed);
			} else {
				console.log('error', error, response.statusCode);
				reject({
					errorIsTFI: true,
					status: response.statusCode,
					message: `Could not get GTFS-R feed from TFI. It responded with statuscode ${response.statusCode}, message "${response.statusMessage}"`,
				});
			}
		});
	});
};

exports.handleGetRealTimeData = async function (
	onlyTheseRoutes = [],
	onlyTheseTrips = []
) {
	const feed = await getFeedOrCache();
	if (onlyTheseRoutes && onlyTheseRoutes.length) {
		const altFeed = feed.entity.filter((entity) => {
			return onlyTheseRoutes.includes(entity.tripUpdate.trip.routeId);
		});
		return { results: { header: feed.header, entity: altFeed } };
	}

	if (onlyTheseTrips && onlyTheseTrips.length) {
		const altFeed = feed.entity.filter((entity) => {
			return onlyTheseTrips.includes(entity.id);
		});
		return { results: { header: feed.header, entity: altFeed } };
	}
	return feed;
};

async function getFeedOrCache() {
	if (rtCache.has('rt')) {
		console.log('Using cache.');
		return JSON.parse(rtCache.get('rt'));
	} else {
		console.log('Requesting...');
		const ans = await getRealTimeData();
		console.log('Stringify and set cache.');
		rtCache.set('rt', JSON.stringify(ans));
		return ans;
	}
}
