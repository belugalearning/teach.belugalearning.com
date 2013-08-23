(function (angular, $) {
  'use strict';

  angular.module('toolApp.directives', [])
    .directive('confirmClick', function($compile, $rootScope) {
      return function(scope, element, attrs) {
        element.click(function () {
          if (window.confirm('Are you sure?')) {
            scope.$parent.$eval(attrs.confirmClick);
          }
          return false;
        });
      };
    });

})(angular, jQuery);
