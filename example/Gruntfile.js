/*global module:false*/
module.exports = function (grunt) {
  "use strict";

  grunt.loadTasks("../tasks");

  grunt.initConfig({
    dust_render: {
      /*home: {
        src: "src/home.dust",
        dest: "dist/home.html",
        options: {
          basePath: "src/",
          whitespace: true,
          context: {
            title: "Home Page"
          }
        }
      }*/
      /*all: {
        files: [
          {
            src: ["*"],
            dest: "dist/",
            ext: ".html"
          }
        ],
        options: {
          basePath: "src/",
          whitespace: true,
          context: {
            title: "Home Page"
          }
        }
      }*/
      dist: {
        files: [
          {
            cwd: "src",
            expand: true,
            src: ["*.dust"],
            dest: "dist",
            ext: '.html'
          }
        ],
        options: {
          basePath: "src"
        }
      },
      dist1: {
        files: [
          {
            cwd: "src",
            expand: true,
            src: ["h*.dust"],
            dest: "dist1",
            ext: '.html'
          }
        ],
        options: {
          basePath: "src/"
        }
      }
    }
  });

  grunt.registerTask("default", ["dust_render"]);
};
