'use strict';

const assert = require('assert');
const Benchmark = require('benchmark');

const sharp = require('../../');
const fixtures = require('../fixtures');

sharp.cache(false);
sharp.simd(true);

const min = 320;
const max = 960;

const randomDimension = function () {
  return Math.ceil((Math.random() * (max - min)) + min);
};

new Benchmark.Suite('random').add('sharp', {
  defer: true,
  fn: function (deferred) {
    sharp(fixtures.inputJpg)
      .resize(randomDimension(), randomDimension())
      .toBuffer(function (err, buffer) {
        if (err) {
          throw err;
        } else {
          assert.notStrictEqual(null, buffer);
          deferred.resolve();
        }
      });
  }
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  const winner = this.filter('fastest').map('name');
  assert.strictEqual('sharp', String(winner), 'sharp was slower than ' + winner);
}).run();
