const config = require('config');
const port = config.get('port');

const express = require('express');
const app = express();

const mongoose = require('mongoose');

const cors = require('cors');

const api = require('./api/api.js');

const dbUrl = config.get('dbUrl');
mongoose.connect(dbUrl);
// mongoose.connect(process.env.DB_URL_LOCAL);
const db = mongoose.connection;
const morgan = require('morgan');
db.once('open', (_) => {
	console.log('Database connected:', dbUrl);
	// console.log('Database connected:', process.env.DB_URL_LOCAL);
});

db.on('error', (err) => {
	console.error('connection error:', err);
});
app.use(morgan('dev'));
app.use(cors());
app.use('/api', api);

app.get('/', async (req, res) => {
	return res.send('use /api');
});
// Handle invalid routes.
app.use((req, res, next) => {
	// console.log(req)
	const error = new Error(`${req.originalUrl && req.originalUrl} Not found`);
	error.status = 404;
	next(error);
});
app.use((error, _, res, next) => {
	// catch errors thrown elsewhere
	console.log('app.js caught error:', { ...error });
	res.status(error.status || 500);
	return res.json({
		error: {
			message: error.message || 'Generic server error.',
		},
	});
});

app.listen(port, () => console.log(`started on ${port}`));
module.exports = app;
