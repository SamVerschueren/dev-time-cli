import test from 'ava';
import moment from 'moment';
import execa from 'execa';

test('error', async t => {
	await t.throws(execa('./cli.js'), 'Provide a GitHub user');
});

test('result', async t => {
	const {stdout} = await execa('./cli.js', ['SamVerschueren']);

	t.is(stdout, moment().format('DD MMM. YYYY - HH:mm:ss'));
});

test('formatting', async t => {
	const {stdout} = await execa('./cli.js', ['SamVerschueren', '--format', 'DD-MM-YYYY']);

	t.is(stdout, moment().format('DD-MM-YYYY'));
});
