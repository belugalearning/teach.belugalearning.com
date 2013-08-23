(function (angular, $) {
  'use strict';

  angular.module('toolApp.controllers', [])
    .controller('MenuController', function ($scope, $rootScope) {

      $scope.MODE_OPTIONS = '0';
      $scope.MODE_VALUES = '1';

      var $tool = $('#tool');
      $tool.load(function () {
        $scope.$apply(function() {
          $scope.menuOptions = window.bl.contentService.getMenuOptions({ tool: 'sorting' });
        });
      });

      $scope.pickRandomValues = function (option) {
        var min = option.minOptions;
        var max = option.maxOptions;
        var indices = [];
        var indicesCount = Math.floor(Math.random() * max) + min;
        while (indices.length < indicesCount) {
          var i = Math.round(Math.random()*(option.options.length-1));
          if (indices.indexOf(i) < 0) {
            indices.push(i);
            option.options[i]._selected = true;
          }
        }
      };

      $scope.toggleAny = function (option) {
        $scope.deselectOptions(option.options);
        $scope.pickRandomValues(option);
      };

      $scope.checkOptionValid = function (option) {
        var count = 0;
        angular.forEach(option._siblings, function(opt) {
          if (opt._selected) {
            count++;
          }
        });
        if (count >= option._parent.minOptions && count <= option._parent.maxOptions) {
          return;
        }
        option._selected = false; // undo the selection
      };

      $scope.optionMode = function (option) {
        if (option.hasOwnProperty('options')) {
          return $scope.MODE_OPTIONS;
        }
        if (option.hasOwnProperty('value')) {
          return $scope.MODE_VALUES;
        }
      };

      $scope.mapSiblings = function (option) {
        if (angular.isUndefined(option)) {
          return [];
        }
        angular.forEach(option.options, function (opt) {
          opt._siblings = option.options;
          opt._parent = option;
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
