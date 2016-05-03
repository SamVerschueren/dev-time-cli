import test from 'ava';
import moment from 'moment-timezone';
import execa from 'execa';
import stripAnsi from 'strip-ansi';

test('error', async t => {
	await t.throws(execa('./cli.js'), /Provide a GitHub user/);
});

test('result', async t => {
	const {stdout} = await execa('./cli.js', ['SamVerschueren']);

	t.is(stripAnsi(stdout), `${moment().tz('Europe/Brussels').format('HH:mm - D MMM. YYYY')}\n`);
});

test('formatting', async t => {
	const {stdout} = await execa('./cli.js', ['SamVerschueren', '--format', 'DD-MM-YYYY']);

	t.is(stripAnsi(stdout), `${moment().format('DD-MM-YYYY')}\n`);
});
