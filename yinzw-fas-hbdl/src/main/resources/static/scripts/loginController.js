'use strict';

angular.module('cn.edu.ncepu.login.controller', [])
	/**
	 * 列表页面controller
	 */
  .controller('loginController', ['$scope', '$http', '$location', function($scope, $http, $location) {
	  $scope.username='';
	  $scope.password='';
	  $scope.imageCodeSrc = "/yinzw/imgCode/getSysManageLoginCode";
	  $scope.validateCode = "";
	  $scope.imgCodeChecked = "0";//验证码未验证或验证失败
	  
	  //刷新验证码
	  $scope.flushValidateCode = function(){
		  $scope.src = $scope.imageCodeSrc + "?time=" + new Date(); 
	  };
	  $scope.flushValidateCode();
	  
	  //验证填入的验证码是否正确
	  $scope.checkValidateCode = function(){
		  $http({
				method:"post",
				url:"/yinzw/imgCode/checkimagecode",
				params:{
					"validateCode" : $scope.validateCode
				}
			}).success(
					function(data, status) {
						$scope.imgCodeChecked = "1";
						var msg = data.errorMsg;
						if(data.status === "error"){
							$scope.imgCodeChecked = "0";
							$scope.flushValidateCode();
						}
						console.log(status);
						console.log(data.status);
						console.log(msg);
					}).error(function(data, status) {
						console.log("验证码错误！");
						$scope.imgCodeChecked = "0";
						$scope.flushValidateCode();
						
			});
	  };
	  
	  //登录
	  $scope.login = function(){
		  console.log("login start");
		  if ($scope.form.$valid && $scope.imgCodeChecked == '1') {
				$http({
					method : 'post',
					url : '/yinzw/w0w/login',
					params : {
						'username': $scope.username,
						'password': $scope.password
					}
				}).success(function(data, status) {
					window.location.href = "/yinzw/index.html?token="+data.token;
				}).error(function(data, status) {
					$("span.tip").text(data.error).show();
				});
			} else {
				$("span.tip").text("用户名、密码未填写或者验证码错误").show();
			}
	  };
	  //注册
	  $scope.register = function() {
			window.location.href = "/yinzw/register.html";
		};
		
  }]);
