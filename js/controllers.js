(function (angular, $) {
  'use strict';

  angular.module('toolApp.controllers', [])
    .controller('MenuController', function ($scope, $rootScope) {

      var $tool = $('#tool');
      $tool.load(function () {
        $scope.$apply(function() {
          $scope.menuOptions = window.bl.contentService.getMenuOptions({ tool: 'sorting' });
        });
      });

      $scope.mapSiblings = function (option) {
        if (angular.isUndefined(option)) {
          return [];
        }
        angular.forEach(option.options, function (opt) {
          opt._siblings = option.options;
        });
        return option.options;
      };

      $scope.noOptionsSelected = function (option) {
        var optionsSelected = false;
        angular.forEach(option.options, function(opt) {
          if (opt._selected) {
            optionsSelected = true;
          }
        });
        return !optionsSelected;
      };

      $scope.deselectOptions = function (options) {
        angular.forEach(options, function (opt) {
          opt._selected = false;
          if (!angular.isUndefined(opt.options)) {
            $scope.deselectOptions(opt.options);
          }
        });
      };
      $scope.setOptionSelected = function (option, $parent) {
        $scope.deselectOptions(option._siblings);
        option._selected = true;
      };
    });
})(window.angular, jQuery);
