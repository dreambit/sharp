'use strict';

const fs = require('fs');

const async = require('async');
const assert = require('assert');
const Benchmark = require('benchmark');

// Contenders
const sharp = require('sharp');

sharp.concurrency(8)

const fixtures = require('../fixtures');

const width = 640;
const height = 392;

// Disable libvips cache to ensure tests are as fair as they can be
sharp.cache(true);

const inputJpgBuffer = fs.readFileSync(fixtures.inputJpg);

console.time('Time');

Promise.all(new Array(1000).fill(0).map(i => sharp(inputJpgBuffer).resize(width, height).toBuffer())).then(() => {
	console.timeEnd('Time');
});



