#!/usr/bin/env node
'use strict';
const updateNotifier = require('update-notifier');
const meow = require('meow');
const moment = require('moment-timezone');
const devTime = require('dev-time');

const cli = meow(`
	Usage
	  $ dev-time <user>

	Options
	  --format       The moment format of the output. [Default: HH:mm - D MMM. YYYY]
	  --token        The GitHub authentication token.
	  -v, --verbose  Show UTC offset.

	Examples
	  $ dev-time SamVerschueren
	  19:47 - 8 Dec. 2015
	  $ dev-time SamVerschueren -v
	  19:47 - 8 Dec. 2015 - UTC+1
	  $ dev-time SamVerschueren --format DD-MM-YYYY
	  07-12-2015
`, {
	string: ['_'],
	boolean: ['verbose'],
	alias: {
		v: 'verbose'
	},
	default: {
		format: 'HH:mm - D MMM. YYYY'
	}
});

updateNotifier({pkg: cli.pkg}).notify();

if (cli.input.length === 0) {
	console.error('Provide a GitHub user');
	process.exit(1);
}

devTime(cli.input[0], cli.flags).then(time => {
	const date = moment.utc(time).utcOffset(time);

	if (cli.flags.verbose) {
		const sign = date.utcOffset() >= 0 ? '+' : '';
		console.log(`${date.format(cli.flags.format)} - UTC${sign}${date.utcOffset() / 60}`);
	} else {
		console.log(date.format(cli.flags.format));
	}
});
