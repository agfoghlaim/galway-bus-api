module.exports = {
	GALWAY_ROUTES_SHORT: [401, 402, 404, 405, 407, 409, 410, 411, 412, 414],
	GALWAY_ROUTES_LONG: [
		'10-401-e19-1',
		'10-402-e19-1',
		'10-404-e19-1',
		'10-405-e19-1',
		'10-407-e19-1',
		'10-409-e19-1',
		'10-401-e20-1',
		'10-402-e20-1',
		'10-404-e20-1',
		'10-405-e20-1',
		'10-407-e20-1',
		'10-409-e20-1',
		'34-410-y11-2',
		'34-411-y11-2',
		'34-412-y11-2',
		'34-414-y11-3',
	],

	// GALWAY_ROUTES: {
	// 	401: '10-401-e19-1',
	// 	402: '10-402-e19-1',
	// 	404: '10-404-e19-1',
	// 	405: '10-405-e19-1',
	// 	407: '10-407-e19-1',
	// 	409: '10-409-e19-1',
	// },
	GALWAY_ROUTES_TO_SHORT_ARRAY_STRING: {
		'10-401-e19-1': ['401'],
		'10-402-e19-1': ['402'],
		'10-404-e19-1': ['404'],
		'10-405-e19-1': ['405'],
		'10-407-e19-1': ['407'],
		'10-409-e19-1': ['409'],
		'10-401-e20-1': ['401'],
		'10-402-e20-1': ['402'],
		'10-404-e20-1': ['404'],
		'10-405-e20-1': ['405'],
		'10-407-e20-1': ['407'],
		'10-409-e20-1': ['409'],
		'34-410-y11-2': ['410'],
		'34-411-y11-2': ['411'],
		'34-412-y11-2': ['412'],
		'34-414-y11-3': ['414'],
	},

	DAYS: {
		0: 'sunday',
		1: 'monday',
		2: 'tuesday',
		3: 'wednesday',
		4: 'thursday',
		5: 'friday',
		6: 'saturday',
	},

	// Used in test
	GALWAY_ROUTES_INFO: {
		4010: {
			routeName: '401',
			name: 'Ballybrit - Salthill /401/0',
			direction: '0',
			numStops: 37,
			4010: 37,
		},
		4011: {
			routeName: '401',
			name: 'Salthill - Ballybrit /401/1',
			direction: '1',
			numStops: 38,
			4011: 38,
		},
		4020: {
			routeName: '402',
			name: 'Seacrest - Merlin /402/0',
			direction: '0',
			numStops: 42,
			4020: 42,
		},
		4021: {
			routeName: '402',
			name: 'Merlin - Seacrest /402/1',
			direction: '1',
			numStops: 38,
			4021: 38,
		},
		4040: {
			routeName: '404',
			name: 'Oranmore - Westside /404/0',
			direction: '0',
			numStops: 34,
			4040: 34,
		},
		4041: {
			routeName: '404',
			name: 'Westside - Oranmore /404/1',
			direction: '1',
			numStops: 28,
			4041: 28,
		},
		4050: {
			routeName: '405',
			name: 'Gort na Bro  Tuam Rd) /405/0',
			direction: '0',
			numStops: 28,
			4050: 28,
		},
		4051: {
			routeName: '405',
			name: 'Tuam Rd - Gor na Bro) /405/1',
			direction: '1',
			numStops: 28,
			4051: 28,
		},
		4070: {
			routeName: '407',
			name: 'Eyre Sq - Ballinfoyle) /407/0',
			direction: '0',
			numStops: 16,
			4070: 16,
		},
		4071: {
			routeName: '407',
			name: 'Ballinfoyle - Eyre Sq) /407/1',
			direction: '1',
			numStops: 16,
			4071: 16,
		},
		4090: {
			routeName: '409',
			name: 'Eyre Sq - Parkmore) /409/0',
			direction: '0',
			numStops: 22,
			4090: 22,
		},
		4091: {
			routeName: '409',
			name: 'Parkmore - Eyre Sq) /409/1',
			direction: '1',
			numStops: 21,
			4091: 21,
		},
	},
};
