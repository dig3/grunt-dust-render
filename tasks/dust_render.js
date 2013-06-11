/* global module: true, require: true */
/*
 * grunt-dust-render
 * https://github.com/dig3/grunt-dust-render
 *
 * Copyright (c) 2013 Diego Gadola
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {

  'use strict';
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var path = require("path"),
    fs = require("fs"),
    _ = grunt.util._;

  grunt.registerMultiTask('dust_render', 'Render dust templates to html.', function () {
    // Merge task-specific and/or target-specific options with these defaults.
    var dust,
      done = this.async(),
      options = this.options({
        punctuation: '.',
        separator: ', ',
        basePath: ".",
        defaultExt: ".dust",
        whitespace: false,
        context: {}
      });



    // find me some dust
    try {
      dust = require("dust");
    } catch (err) {
      dust = require("dustjs-linkedin");
    }

    function parseError(err, filePath) {
      grunt.fatal("Error parsing dust template: " + err + " " + filePath);
    }

    function onLoad(filePath, callback) {
      // Make sure the file to load has the proper extension
      if (!path.extname(filePath).length) {
        filePath += options.defaultExt;
      }

      if (filePath.charAt(0) !== "/") {
        filePath = options.basePath + "/" + filePath;
      }

      fs.readFile(filePath, "utf8", function (err, html) {
        if (err) {
          grunt.warn("Template " + err.path + " does not exist");
          return callback(err);
        }

        try {
          callback(null, html);
        } catch (e) {
          parseError(e, filePath);
        }
      });
    }

    // Load includes/partials from the filesystem properly
    dust.onLoad = onLoad;

    // Iterate over all specified file gruops asynchronously
    grunt.util.async.forEachSeries(this.files, function (f, n) {

      var template, context;

      // reset cache
      dust.cache = {};
      // pre-compile the template
      try {
        template = dust.compileFn(grunt.file.read(f.src));
      } catch (e) {
        parseError(e, f);
      }

      // preserve whitespace?
      if (options.whitespace) {
        dust.optimizers.format = function (ctx, node) {
          return node;
        };
      }

      // if context is a string assume it's the location to a file
      if (typeof options.context === "string") {
        context = grunt.file.readJSON(options.context);

      // if context is an array merge each item together
      } else if (Array.isArray(options.context)) {
        context = {};

        options.context.forEach(function (obj) {
          if (typeof obj === "string") {
            obj = grunt.file.readJSON(obj);
          }

          _.extend(context, obj);
        });
      }

      // render template and save as html
      template(context, function (err, html) {
        if (!err) {
          grunt.file.write(f.dest, html);
          grunt.log.writeln('File ' + f.dest.cyan + ' created.');
          n();
        } else {
          grunt.log.warn('Error compiling ' + f.src.red + ': ' + err);
          n(err);
        }
      });

    }, done);

  });

};
