/*
 * grunt-watchify
 * http://github.com/amiorin/grunt-watchify
 *
 * Copyright (c) 2013 Alberto Miorin, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.initConfig({

    clean: {
      tests: ['tmp']
    },

    nodeunit: {
      tests: ['test/*_test.js']
    },

    watchify: {
      basic: {
        src: './test/fixtures/basic/*.js',
        dest: 'tmp/basic.js'
      },
      alias: {
        src: './test/fixtures/alias/*.js',
        dest: 'tmp/alias.js',
        options: {
          alias: 'test/fixtures/alias/toBeAliased.js:alias'
        }
      },
      sourceMaps: {
        src: './test/fixtures/basic/*.js',
        dest: 'tmp/sourceMaps.js',
        options: {
          debug: true
        }
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['clean', 'watchify', 'nodeunit']);
};
