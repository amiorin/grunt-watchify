# grunt-watchify [![Build Status](https://travis-ci.org/amiorin/grunt-watchify.png?branch=master)](https://travis-ci.org/amiorin/grunt-watchify) [![Dependency Status](https://gemnasium.com/amiorin/grunt-watchify.png)](https://gemnasium.com/amiorin/grunt-watchify)

Grunt task for [node-browserify](https://github.com/substack/node-browserify).

## Getting Started
This plugin requires [Grunt](https://gruntjs.com) `~0.4.0` and Node `>=0.8.x`.

Install this grunt plugin with:

```sh
npm install grunt-watchify --save-dev
```

Then add this line to your project's `Gruntfile.js` Gruntfile:

```js
grunt.loadNpmTasks('grunt-watchify');
```

## Common errors
```sh
Running "watchify:source" (watchify) task
Fatal error: module "src/main.js" not found in require()
```

Is the ``src`` attribute starting with ``./``?
``grunt-watchify`` is different from ``grunt-browserify``. It follows the
[nodejs require.resolve() algorithm](http://nodejs.org/docs/v0.4.8/api/all.html#all_Together...).

```js
...
{
  src: './src/main.js'
  ...
}
...
```

## Differences with grunt-browserify
* ``grunt-watchify`` **watches** the dependencies like [watchify][0] and rebuilds
  the bundle, when one dependency is modified.
* ``grunt-watchify`` **caches** the dependencies making the rebuild process
  very fast (useful for big projects).
* The configuration is different. You have the ``options`` of browserify plus
  ``keepalive`` and ``callback``.
* The instance of browserify is passed to ``callback`` where you can use the
  api of browserify. Remember to return the instance.
* The ``keepalive`` is useful if you use ``grunt-watchify`` alone. It works like
  in [grunt-contrib-connect#keepalive](https://github.com/gruntjs/grunt-contrib-connect#keepalive).
```js
grunt.initConfig({
  watchify: {
    options: {
      // defaults options used in b.bundle(opts)
      detectGlobals: true,
      insertGlobals: false,
      ignoreMissing: false,
      debug: false,
      standalone: false,

      keepalive: false,
      callback: function(b) {
        // configure the browserify instance here
        b.add();
        b.require();
        b.external();
        b.ignore();
        b.transform();

        // return it
        return b;
      }
    },
    example: {
      src: './src/**/*.js',
      dest: 'app/js/bundle.js'
    }
  }
});
```
* The ``src`` makes difference between ``process`` and ``./process``:
```js
grunt.initConfig({
  watchify: {
    example: {
      src: ['process', './src/**/*.js'],
      dest: 'app/js/bundle.js'
    },
  }
});
```
**Your project files usually start with ``./``**.

* You can use the glob only with your project files and not for the modules in
  ``node_modules``.

## Examples
You find this example in the directory ``example``.
* ``grunt-watchify`` builds the ``bundle.js`` and watches the dependencies.
* ``grunt-contrib-watch`` watches the ``bundle.js`` and triggers
  ``livereload`` when it changes.
* ``grunt-contrib-connect`` serves the files.
* ``grunt-contrib-livereload`` is used only for the livereload snippet.

```js
/*
 * grunt-watchify
 * http://github.com/amiorin/grunt-watchify
 *
 * Copyright (c) 2013 Alberto Miorin, contributors
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

var lrSnippet  = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function(connect, dir) {
  return connect.static(path.resolve(dir));
};

module.exports = function(grunt) {
  grunt.initConfig({

    watchify: {
      example: {
        src: './src/**/*.js',
        dest: 'app/js/bundle.js'
      },
    },

    watch: {
      app: {
        files: 'app/js/bundle.js',
        options: {
          livereload: true
        }
      }
    },

    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, 'app')
            ];
          }
        }
      }
    }
  });

  grunt.loadTasks('../tasks');

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');

  grunt.registerTask('default', ['watchify', 'connect', 'watch']);
};
```
How can you start ``grunt``:
```sh
# with other tasks like connect and watch
# done() is called
grunt

# alone like watchify
# done() is *never* called
grunt watchify:example:keepalive
```

## Credits
* [browserify](https://github.com/substack/node-browserify) ;-)
* [watchify](https://github.com/substack/watchify) for the cache code
* [grunt-browserify](https://github.com/jmreidy/grunt-browserify) for the tests

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/amiorin/grunt-watchify/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

[0]: https://github.com/substack/watchify
