/*
 * grunt-watchify
 * http://github.com/amiorin/grunt-watchify
 *
 * Copyright (c) 2013 Alberto Miorin, contributors
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function(grunt) {
  var path  = require('path'),
      fs    = require('fs'),
      index = require('../index.js');

  grunt.registerMultiTask('watchify', 'watch mode for browserify builds', function() {
    var self     = this,
        _        = grunt.util._,
        done     = _.once(self.async()),
        outfile  = self.data.dest,
        dotfile  = path.join(path.dirname(outfile), '.' + path.basename(outfile)),
        destPath = path.dirname(path.resolve(outfile)),
        w;

    if (!grunt.file.exists(destPath)) {
      grunt.file.mkdir(destPath);
    }

    var options = self.options({
      detectGlobals: true,
      insertGlobals: false,
      ignoreMissing: false,
      debug: false,
      standalone: false,

      keepalive: false,
      callback: function(b) {
        return b;
      }
    });

    var keepAlive = this.flags.keepalive || options.keepalive,
        opts      = _.pick(options, 'detectGlobals', 'insertGlobals', 'debug', 'standalone');


    var bundle = function bundle() {
      var wb          = w.bundle(opts),
          writeStream = fs.createWriteStream(dotfile);

      wb.pipe(writeStream, {end: false});
      wb.on('error', function (err) {
        grunt.fail.warn(err);
      });
      wb.on('end', function() {
        writeStream.end();
        fs.rename(dotfile, outfile, function (err) {
          if (err) {
            grunt.fail.warn(err);
          }
          if (!keepAlive) {
            done();
          }
        });
      });
    };

    var files = [];
    if (!_.isArray(self.data.src)) {
      files = [self.data.src];
    }
    files = files.filter(function(filePath) {
      // node_modules
      return filePath[0] !== '.';
    });
    files = _.union(files, self.filesSrc);

    w = index(files, options.callback);
    w.on('update', bundle);
    bundle();

    if (keepAlive) {
      // This is now an async task. Since we don't call the "done"
      // function, this task will never, ever, ever terminate. Have fun!
      grunt.log.write('Waiting forever...\n');
    }
  });
};

