// Karma configuration
// Generated on Mon Oct 02 2017 17:31:27 GMT-0400 (EDT)
/* globals module */

module.exports = function(config) {
  'use strict';

  config.set({
    plugins: [
      'karma-jquery',
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-coverage'
    ],
    basePath: '',
    frameworks: ['jasmine', 'jquery-3.2.1'],
    files: [
      '../src/*.js',
      '../node_modules/jasmine-ajax/lib/mock-ajax.js',
      '../node_modules/jasmine-fixture/dist/jasmine-fixture.min.js',
      'specs.js'
    ],
    exclude: [
    ],
    preprocessors: {
      '../src/*.js': ['coverage']
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity,
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        {
          type: 'json',
          subdir: '.',
          file: 'report.json'
        },
        {
          type: 'html',
          subdir: 'report-html'
        }
      ]
    }
  });
};
