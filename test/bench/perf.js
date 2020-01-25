'use strict';

const fs = require('fs');

const async = require('async');
const assert = require('assert');
const Benchmark = require('benchmark');

// Contenders
const sharp = require('sharp');

const fixtures = require('../fixtures');

const width = 640;
const height = 392;

// Disable libvips cache to ensure tests are as fair as they can be
sharp.cache(false);

async.series({
  jpeg: function (callback) {
    const inputJpgBuffer = fs.readFileSync(fixtures.inputJpg);
    const jpegSuite = new Benchmark.Suite('jpeg');
    // sharp
    jpegSuite.add('sharp-buffer-buffer', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer)
          .resize(width, height)
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-promise', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer)
          .resize(width, height)
          .toBuffer()
          .then(function (buffer) {
            assert.notStrictEqual(null, buffer);
            deferred.resolve();
          })
          .catch(function (err) {
            throw err;
          });
      }
    }).on('cycle', function (event) {
      console.log('jpeg ' + String(event.target));
    }).on('complete', function () {
      callback(null, this.filter('fastest').map('name'));
    }).run();
  },
  // Effect of applying operations
  operations: function (callback) {
    const inputJpgBuffer = fs.readFileSync(fixtures.inputJpg);
    const operationsSuite = new Benchmark.Suite('operations');
    operationsSuite.add('sharp-sharpen-mild', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer)
          .resize(width, height)
          .sharpen()
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-sharpen-radius', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer)
          .resize(width, height)
          .sharpen(3, 1, 3)
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-blur-mild', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer)
          .resize(width, height)
          .blur()
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-blur-radius', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer)
          .resize(width, height)
          .blur(3)
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-gamma', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer)
          .resize(width, height)
          .gamma()
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-normalise', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer)
          .resize(width, height)
          .normalise()
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-greyscale', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer)
          .resize(width, height)
          .greyscale()
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-greyscale-gamma', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer)
          .resize(width, height)
          .gamma()
          .greyscale()
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-progressive', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer)
          .resize(width, height)
          .jpeg({ progressive: true })
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-without-chroma-subsampling', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer)
          .resize(width, height)
          .jpeg({ chromaSubsampling: '4:4:4' })
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-rotate', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer)
          .rotate(90)
          .resize(width, height)
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-without-simd', {
      defer: true,
      fn: function (deferred) {
        sharp.simd(false);
        sharp(inputJpgBuffer)
          .resize(width, height)
          .toBuffer(function (err, buffer) {
            sharp.simd(true);
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-sequentialRead', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer, { sequentialRead: true })
          .resize(width, height)
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-crop-entropy', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer)
          .resize(width, height, {
            fit: 'cover',
            position: sharp.strategy.entropy
          })
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-crop-attention', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer)
          .resize(width, height, {
            fit: 'cover',
            position: sharp.strategy.attention
          })
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
      console.log('operations ' + String(event.target));
    }).on('complete', function () {
      callback(null, this.filter('fastest').map('name'));
    }).run();
  },
  // Comparative speed of kernels
  kernels: function (callback) {
    const inputJpgBuffer = fs.readFileSync(fixtures.inputJpg);
    (new Benchmark.Suite('kernels')).add('sharp-cubic', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer)
          .resize(width, height, { kernel: 'cubic' })
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-lanczos2', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer)
          .resize(width, height, { kernel: 'lanczos2' })
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-lanczos3', {
      defer: true,
      fn: function (deferred) {
        sharp(inputJpgBuffer)
          .resize(width, height, { kernel: 'lanczos3' })
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
      console.log('kernels ' + String(event.target));
    }).on('complete', function () {
      callback(null, this.filter('fastest').map('name'));
    }).run();
  },
  // PNG
  png: function (callback) {
    const inputPngBuffer = fs.readFileSync(fixtures.inputPng);
    const pngSuite = new Benchmark.Suite('png');
    // sharp
    pngSuite.add('sharp-buffer-file', {
      defer: true,
      fn: function (deferred) {
        sharp(inputPngBuffer)
          .resize(width, height)
          .toFile(fixtures.outputPng, function (err) {
            if (err) {
              throw err;
            } else {
              deferred.resolve();
            }
          });
      }
    }).add('sharp-buffer-buffer', {
      defer: true,
      fn: function (deferred) {
        sharp(inputPngBuffer)
          .resize(width, height)
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-file-file', {
      defer: true,
      fn: function (deferred) {
        sharp(fixtures.inputPng)
          .resize(width, height)
          .toFile(fixtures.outputPng, function (err) {
            if (err) {
              throw err;
            } else {
              deferred.resolve();
            }
          });
      }
    }).add('sharp-file-buffer', {
      defer: true,
      fn: function (deferred) {
        sharp(fixtures.inputPng)
          .resize(width, height)
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-progressive', {
      defer: true,
      fn: function (deferred) {
        sharp(inputPngBuffer)
          .resize(width, height)
          .png({ progressive: true })
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    }).add('sharp-adaptiveFiltering', {
      defer: true,
      fn: function (deferred) {
        sharp(inputPngBuffer)
          .resize(width, height)
          .png({ adaptiveFiltering: true })
          .toBuffer(function (err, buffer) {
            if (err) {
              throw err;
            } else {
              assert.notStrictEqual(null, buffer);
              deferred.resolve();
            }
          });
      }
    });
    pngSuite.on('cycle', function (event) {
      console.log(' png ' + String(event.target));
    }).on('complete', function () {
      callback(null, this.filter('fastest').map('name'));
    }).run();
  },
  // WebP
  webp: function (callback) {
    const inputWebPBuffer = fs.readFileSync(fixtures.inputWebP);
    (new Benchmark.Suite('webp')).add('sharp-buffer-buffer', {
      defer: true,
      fn: function (deferred) {
        sharp(inputWebPBuffer)
          .resize(width, height)
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
      console.log('webp ' + String(event.target));
    }).on('complete', function () {
      callback(null, this.filter('fastest').map('name'));
    }).run();
  }
}, function (err, results) {
  assert(!err, err);
  Object.keys(results).forEach(function (format) {
    if (results[format].toString().substr(0, 5) !== 'sharp') {
      console.log('sharp was slower than ' + results[format] + ' for ' + format);
    }
  });
  console.dir(sharp.cache());
});
