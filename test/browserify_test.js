'use strict';

var grunt = require('grunt');
var vm = require('vm');

function readFile(path) {
  return grunt.file.read(path);
}

function compareOutputs(fn1, fn2) {
  return (grunt.util.normalizelf(fn1.toString()) === grunt.util.normalizelf(fn2.toString()));
}

function moduleExported(context, modulePath) {
  var module = modulePath.match(/(\w+)\.js/)[1];
  return compareOutputs(context.exports[module], require(modulePath));
}

function getIncludedModules(file, context) {
  var c = context || {};
  var actual = readFile(file);
  c.required = function (exports) {
    c.exports = exports;
  };
  vm.runInNewContext(actual, c);
  return c;
}

module.exports = {
  basic: function (test) {
    test.expect(2);
    var context = getIncludedModules('tmp/basic.js');

    test.ok(moduleExported(context, './fixtures/basic/a.js'));
    test.ok(moduleExported(context, './fixtures/basic/b.js'));

    test.done();
  },

  alias: function (test) {
    test.expect(1);

    var context = getIncludedModules('tmp/alias.js');
    var aliasedFile = require('./fixtures/alias/toBeAliased.js');

    test.ok(compareOutputs(context.exports.alias, aliasedFile));

    test.done();
  },

  sourceMaps: function (test) {
    test.expect(1);

    var actual = readFile('tmp/sourceMaps.js');
    test.ok(actual.match(/\/\/@ sourceMappingURL=/));

    test.done();
  }
};

