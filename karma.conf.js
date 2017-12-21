//jshint strict: false
module.exports = function(config) {
  config.set({

    files: [
	  'node_modules/jquery/dist/jquery.min.js',
      'node_modules/angular/angular.min.js',
      'node_modules/angular-animate/angular-animate.min.js',
	  'node_modules/angular-resource/angular-resource.min.js',
	  'node_modules/angular-ui-router/release/angular-ui-router.min.js',
	  'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
      'node_modules/angular-ui-indeterminate/dist/indeterminate.min.js',
      'node_modules/angular-ui-router/release/angular-ui-router.min.js',
      'node_modules/angular-sanitize/angular-sanitize.min.js',
      'node_modules/ng-dialog/js/ngDialog.min.js',
      'node_modules/hopscotch/dist/js/hopscotch.min.js',
	  'Controllers/*.js',
      'Controllers/**/*.js',
      'Components/**/*.js',
	  'Services/**/*.js',
	  'js/**/*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
    ]

  });
};