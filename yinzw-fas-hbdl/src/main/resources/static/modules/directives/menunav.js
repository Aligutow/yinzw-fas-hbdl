'use strict';

angular.module('cn.edu.ncepu.directives.menunav', [])
  .directive('menuNav', [function () {
    var directive = {
      templateUrl: 'modules/directives/menunav.html',
      restrict: 'E',
      scope: true,
      controller: 'menunavController'
    };
    return directive;
  }])
  .controller('menunavController', ['$scope', '$http', '$location',
    function ($scope, $http, $location) {
		$scope.menunav = function() {
			$http.get(
					"/yinzw/menu/menunav", {}).success(
					function(data, status) {
						console.log(data);
	  			        $scope.navlist = data;
					}).error(function(data, status) {
						$scope.data = data || "Request failed";
						$scope.status = status;
			});
		};	
		
		$scope.menunav();
  }]);