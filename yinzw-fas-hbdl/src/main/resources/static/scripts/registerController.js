'use strict';

angular.module('registerApp', [])

  .controller('registerController', ['$scope', '$http','$location', function($scope, $http, $location) {
	  $scope.account='';
	  $scope.password='';
	  
	  $scope.companyName='';
	  $scope.leader='';
	  $scope.phone='';
	  $scope.postcode='';
	  $scope.oa='';
	  $scope.tin='';
	  $scope.bank='';
	  $scope.bankAddress='';
	  $scope.isGeneralTaxpayer='';
	  $scope.ps='';
	  

	  $scope.submit = function() {
		  $http({
				method:"post",
				url:"/yinzw/register/company",
				params:{
					'account':$scope.account,
					'password':$scope.password,
	
					'id':'1',
				    'name':  $scope.companyName,
					'leader': $scope.leader,
					'phone': $scope.phone,
					'postcode': $scope.postcode,
					'oa': $scope.oa,
					'tin': $scope.tin,
					'bank': $scope.bank,
					'bankAddress': $scope.bankAddress,
					'isGeneralTaxpayer': $scope.isGeneralTaxpayer,
					'ps': $scope.ps
				}
			}).success(
					function(data, status) {
						//$alert.tip("操作成功!");
						$scope.backToLogin();
					}).error(function(data, status) {
						//$alert.tip("操作失败!用户名已存在或数据格式不正确");
						$scope.data = data || "Request failed";
						$scope.status = status;
						
			});
		};
		
		$scope.backToLogin = function(){
			window.location.href = "/yinzw/login.html";
		};
  }]);
