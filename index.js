/*
 * grunt-watchify
 * http://github.com/amiorin/grunt-watchify
 *
 * Copyright (c) 2013 Alberto Miorin, contributors
 * Licensed under the MIT license.
 */

'use strict';

var fs         = require('fs');
var browserify = require('browserify');

module.exports = function (opts, gruntCb) {
  var b          = gruntCb(browserify(opts));
  var cache      = {};
  var pkgcache   = {};
  var watching   = {};
  var lastUpdate = 0;

  b.on('package', function (file, pkg) {
    pkgcache[file] = pkg;
  });

  b.on('dep', function (dep) {
    if (watching[dep.id]) {
      return;
    }
    watching[dep.id] = true;
    cache[dep.id] = dep;

    fs.watch(dep.id, function() {
      delete cache[dep.id];
      watching[dep.id] = false;

      var now = Date.now();
      if (now - lastUpdate > 2000) {
        b.emit('update');
        lastUpdate = now;
      }
    });
  });

  var bundle = b.bundle.bind(b);
  var first = true;
  b.bundle = function (_opts, cb) {
    if (b._pending) {
      return bundle(_opts, cb);
    }

    if (typeof _opts === 'function') {
      cb = _opts;
      _opts = {};
    }
    if (!_opts) {
      _opts = {};
    }
    if (!first) {
      _opts.cache = cache;
    }
    _opts.includePackage = true;
    _opts.packageCache = pkgcache;
    first = false;

    return bundle(_opts, cb);
  };

  return b;
};

