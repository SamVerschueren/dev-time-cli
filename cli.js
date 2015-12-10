#!/usr/bin/env node
'use strict';
const updateNotifier = require('update-notifier');
const meow = require('meow');
const moment = require('moment-timezone');
const devTime = require('dev-time');
const logSymbols = require('log-symbols');
const chalk = require('chalk');
const elegantSpinner = require('elegant-spinner');
const logUpdate = require('log-update');

const cli = meow(`
	Usage
	  $ dev-time <user> <user2> ...

	Options
	  -v, --verbose  Show UTC offset.
	  --format       The moment format of the output. [Default: HH:mm - D MMM. YYYY]
	  --token        The GitHub authentication token.

	Examples
	  $ dev-time SamVerschueren
	  19:47 - 8 Dec. 2015

	  $ dev-time SamVerschueren sindresorhus
	  SamVerschueren
	    19:47 - 8 Dec. 2015
	  sindresorhus
	    18:47 - 8 Dec. 2015

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

const result = {};
const frames = {};

cli.input.forEach(user => frames[user] = elegantSpinner());

function parseError(err) {
	if (/no contributions/.test(err.message)) {
		return `  ${logSymbols.error} ${chalk.red('error')} ${err.message}`;
	}

	return err.stack;
}

function render() {
	const output = [];

	cli.input.forEach(user => {
		if (cli.input.length === 1) {
			output.push(result[user]);
			return;
		}

		output.push(user);

		if (result[user]) {
			if (result[user] instanceof Error) {
				output.push(parseError(result[user]));
			} else {
				output.push(`  ${result[user]}`);
			}
		} else {
			output.push(`  ${chalk.gray.dim(frames[user]())}`);
		}
	});

	logUpdate(output.join('\n'));
}

if (cli.input.length > 1) {
	setInterval(render, 50);
}

Promise.all(cli.input.map(user =>
	devTime(user, cli.flags)
		.then(time => {
			const date = moment.utc(time).utcOffset(time);
			result[user] = date.format(cli.flags.format);

			if (cli.flags.verbose) {
				const sign = date.utcOffset() >= 0 ? '+' : '';
				result[user] += ` - UTC${sign}${date.utcOffset() / 60}`;
			}
		})
		.catch(err => result[user] = err)
)).then(() => {
	render();
	process.exit();
});
