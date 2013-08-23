(function (angular, $) {
  'use strict';

  angular.module('toolApp', [
      'toolApp.directives',
      'toolApp.controllers'
    ])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
    }]);
})(window.angular, jQuery);
