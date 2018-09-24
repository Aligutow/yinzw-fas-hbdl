'use strict';

angular.module('cn.edu.ncepu.project.controller', [])

.controller('projectListController', ['$scope', '$http', '$location', '$alert', function($scope, $http, $location, $alert) {
	$scope.items = [];
	$scope.maxSize = 5;
	$scope.pagesize = 5;
	$scope.totalItems = orgService.totalItems;
	$scope.currentPage = orgService.currentPage;
	$scope.pageChanged = function() {
		$scope.query($scope.currentPage);
	};
	$scope.searchItem = orgService.searchItem;
	
	
	
	
}])