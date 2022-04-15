const config = require('config');
require('dotenv').config();

const port = config.get('port');
const dbUrl = config.get('dbUrl');

const express = require('express');
const app = express();

const mongoose = require('mongoose');

const cors = require('cors');

const api = require('./api/api.js');

mongoose.connect(dbUrl);
// mongoose.connect(process.env.DB_URL_LOCAL);
const db = mongoose.connection;
const morgan = require('morgan');
db.once('open', (_) => {
	console.log('Database connected:', dbUrl);
});

db.on('error', (err) => {
	console.error('connection error:', err);
});
app.use(morgan('dev'));
app.use(cors());
app.use('/api', api);

// Handle invalid routes.
app.use((req, res, next) => {
	const error = new Error(`${req.originalUrl && req.originalUrl} Not found`);
	error.status = 404;
	next(error);
});
app.use((error, req, res, next) => {
	// catch errors thrown elsewhere
	res.status(error.status || 500);
	return res.send({
		error: {
			status: error.status || 500,
			message: error.message || 'Generic server error.',
		},
	});
});

app.listen(port, () => console.log(`started on ${port}`));
module.exports = app;
