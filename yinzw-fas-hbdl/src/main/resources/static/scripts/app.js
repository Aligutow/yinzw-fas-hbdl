'use strict';

angular.module('fasApp',[
	'ngRoute',
    'ui.bootstrap',
    'tree.dropdown', //下拉列表树
    'com.devnup.alert',// 提示框
    'cn.edu.ncepu.directives.menunav',//左侧菜单控件
    'cn.edu.ncepu.user.controller',
    'cn.edu.ncepu.user.service',
//    'cn.edu.ncepu.menu.controller',
//    'cn.edu.ncepu.menu.service',
    'cn.edu.ncepu.org.controller',
    'cn.edu.ncepu.org.service',
    'cn.edu.ncepu.application.controller',
    'cn.edu.ncepu.project.controller',
    'cn.edu.ncepu.progress.controller'
    
])

//请求拦截器
.factory('requestInterceptor', function() {
	return {
		'request' : function(req){
			//console.log("请求的url：" + req.url);
			//console.log("请求的方式：" + req.method);
			//console.log("请求的Accept头属性：" + req.headers.Accept);//“Accept” 头属性能被浏览器用来指定响应的media 类型，表示自己可以接受的类型。
			return req;
		}
	};
})

//响应拦截器
.factory('responseInterceptor', function() {
        return {
            'responseError': function(response) {
            	if (response.status == '401') {
            		console.log("跳转到登陆页面");
            		window.location.href = "/yinzw/login.html";
            	}
                return response;
            },
            'response' : function(resp){
            	//console.log(resp);
            	//console.log("响应的url：" + resp.config.url);
            	//console.log("响应的状态：" + resp.status);
//				if(resp.config.url == '/login'){
//					
//					Auth.setToken(resp.data.token);
//				}
				return resp;
			}
        };
    })
   //向后台获取当前登录用户信息的同时触发后台拦截器，判断当前用户是否登录 
  .controller('appController', function($scope, $http, $rootScope) {//'$scope', '$http', 
	  //从后台获取当前登录用户
	  $scope.getUserInfo = function() {
		  $http.get(
					"/yinzw/w0w/userInfo", {}
				  ).success(function(data, status) {
					  console.log(typeof(data));
					  console.log(data instanceof Array);
					  console.log("--------------");
					    $scope.userInfo = {};
						$scope.userInfo.name = data.name;
						$scope.userInfo.privatetoken = data.privatetoken;
						var token = $scope.userInfo.privatetoken;
					}).error(function(data, status) {
	  					alert(data.error);
						$scope.data = data || "Request failed";
						$scope.status = status;
			});
		  $http.get(
				  "/yinzw/w0w/test", {}
		  ).success(function(data, status) {
			  console.log(typeof(data));
			  console.log(data instanceof Array);
			  console.dir(data);
			  //console.log(data)
		  }).error(function(data, status) {
			  alert(data.error);
			  $scope.data = data || "Request failed";
			  $scope.status = status;
		  });
	  }
	 $scope.getUserInfo();
  })
    
.config(function ($routeProvider, $httpProvider) {//'$routeProvider', '$httpProvider',
	$httpProvider.interceptors.push('requestInterceptor');//将拦截器注册到config中
	$httpProvider.interceptors.push('responseInterceptor');
	
	//用户列表
	$routeProvider.when('/user/list', {
        templateUrl: 'modules/user/views/user_list.html',
        controller: 'userListController'
      });
	
	//用户新增
	$routeProvider.when('/user/user_add', {
        templateUrl: 'modules/user/views/user_add.html',
        controller: 'userAddController'
      });
	
	
	//部门列表
	$routeProvider.when('/org/list', {
        templateUrl: 'modules/org/views/org_list.html',
        controller: 'orgListController'
      });
	//部门新增
	$routeProvider.when('/org/org_add', {
        templateUrl: 'modules/org/views/org_add.html',
        controller: 'orgAddController'
      });
	//部门修改
	$routeProvider.when('/org/org_edit', {
        templateUrl: 'modules/org/views/org_edit.html',
        controller: 'orgEditController'
      });
	//部门查看
	$routeProvider.when('/org/org_view', {
        templateUrl: 'modules/org/views/org_view.html',
        controller: 'orgViewController'
      });
	
	
	
	//差旅报销单
	$routeProvider.when('/reim_travel/list', {
		templateUrl: 'modules/application/views/reim_table_travel.html',
		controller: 'reimTravelController'
	});
	
	
	
	//项目管理
	$routeProvider.when('/project/list', {
		templateUrl: 'modules/project/views/project_list.html',
		controller: 'projectListController'
	});
	
	
	//审批进度
	$routeProvider.when('/reim/progress', {
		templateUrl: 'modules/progress/views/progress.html',
		controller: 'progressController'
	});
	
	//欢迎页面
	$routeProvider.when('/', {
		templateUrl: 'welcome.html',
		//controller: 'progressController'
	});
	
//	.otherwise({
//        redirectTo: '/a'
//      });
	
});
  
