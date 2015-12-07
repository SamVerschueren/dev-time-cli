# dev-time-cli [![Build Status](https://travis-ci.org/SamVerschueren/dev-time-cli.svg?branch=master)](https://travis-ci.org/SamVerschueren/dev-time-cli)

> Get the current local time of a GitHub user.


## Install

```
$ npm install --save dev-time-cli
```


## Usage

```
$ dev-time --help

  Usage
    $ dev-time <user>

  Options
    --format  The moment format of the output. [Default: DD MMM. YYYY - HH:mm:ss]
    --token   The GitHub authentication token.

  Examples
    $ dev-time SamVerschueren
    07 Dec. 2015 - 09:14:49
    $ dev-time SamVerschueren --format DD-MM-YYYY
    07-12-2015
```


## License

MIT © [Sam Verschueren](http://github.com/SamVerschueren)
