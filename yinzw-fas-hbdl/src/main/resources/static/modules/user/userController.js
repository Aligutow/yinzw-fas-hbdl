'use strict';

angular.module('cn.edu.ncepu.user.controller', [])
//自定义校验ensure-unique,校验数据唯一性
//.directive('ensureUnique', ['$http', function($http) {
//  return {
//    require: 'ngModel',
//    link: function(scope, ele, attrs,ctrl) {
//      scope.$watch(attrs.ngModel, function() {
//    	  var key = attrs.ensureId;
//    	  if(key==null||key==""){
//    		  key=-1;
//    	  }
//    	  var username = attrs.ensureUnique;
//        $http({
//          method: 'GET',
//          url: '/zx_auth_xt/V0/username',
//          params:{
//        	  "id":key,
//        	  "username":username
//          }
//        }).success(function(data) {
//        	if (data == "0") {
//        	       ctrl.$setValidity('unique', false);
//        	      } 
//        	else if (data == "1") {
//        	       ctrl.$setValidity('unique', true);
//        	      }
//        }).error(function(data, status, headers, config) {
//        	 console.log("查询失败！");
//        });
//      });
//    }
//  }
//}])
	/**
	 * 列表页面controller
	 */
  .controller('userListController', ['$scope', '$http', '$location', '$alert', 'userService', function($scope, $http, $location, $alert, userService) {
	$scope.items = [];
	$scope.maxSize = 5;
	$scope.pagesize = 5;
	$scope.totalItems = userService.totalItems;
	$scope.currentPage = userService.currentPage;
	//获取部门id与名称的对应关系
	$scope.orgMap = function() {//d
		$http.get(
				"/yinzw/org/orgMap", {}).success(
						function(data, status) {
							userService.orgMap = data;
							$scope.orgMap = userService.orgMap;
							console.log("orgmap:");
							console.log(data);
						}).error(function(data, status) {
							alert(data.error);
							$scope.data = data || "Request failed";
							$scope.status = status;
						});
	};
	$scope.orgMap();
	
	//获取角色id与名称的对应关系
	$scope.roleMap = function() {//d
		$http.get(
				"/yinzw/role/roleMap", {}).success(
						function(data, status) {
							userService.roleMap = data;
							$scope.roleMap = userService.roleMap;
						}).error(function(data, status) {
							alert(data.error);
							$scope.data = data || "Request failed";
							$scope.status = status;
						});
	};
	$scope.roleMap();
	
	
	
	
	$scope.pageChanged = function() {
		$scope.query($scope.currentPage);
	};
	$scope.searchItem = userService.searchItem;
	$scope.selectedUserId = userService.selectedUserId;
	
	//查询
	$scope.query = function(page) {//d
		page = page ? (page-1) : 0;
		var username = $scope.searchItem.username;
		var name = $scope.searchItem.name;
		$http({
			method:"GET",
			url:"/yinzw/w0w/users",
			params:{
				"page":page,
				"size":$scope.pagesize,
				"sort":"id,asc",
				"username":username,
				"name":name
			}
		}).success(
				function(data, status) {
					$scope.items = data.content;
					console.log("users:" + data);
					$scope.totalItems = data.totalElements;
				}).error(function(data, status) {
  					alert(data.error);
					$scope.data = data || "Request failed";
					$scope.status = status;
		});
	};
	
	//新增
	$scope.addUser = function() {//d
		userService.searchItem = $scope.searchItem;
		$location.path('/user/user_add');
	}
	
	//编辑
	$scope.editUser = function(item) {
		userService.editItem = item;
		userService.totalItems = $scope.totalItems;
		userService.currentPage = $scope.currentPage;
		userService.searchItem = $scope.searchItem;
		$location.path('/user/user_edit');
	};
	
	//删除
	$scope.delUser = function(item) {
		var id = item.userId;
		$http({
			method : 'delete',
			url : '/yinzw/w0w/user/'+id,
		}).success(function(data, status) {
			//alertTip("删除成功！", "success", "tip_div");
			$alert.tip("操作成功!");
			$scope.query($scope.currentPage);
		}).error(function(data, status) {
			alert(data.error);
			$scope.data = data || "Request failed";
			$scope.status = status;
		});
	}
	
	//查看
	$scope.viewUser = function(item) {
		userService.viewItem = item;
		userService.totalItems = $scope.totalItems;
		userService.currentPage = $scope.currentPage;
		userService.searchItem = $scope.searchItem;
		$location.path('/user/user_view');
	}
	
	
	//锁定账户
	$scope.lockUser = function(item) {
		var id = item.userId;
		var oper = item.locked == 0?"/lock":"/unlock";
		
		$http({
			method : 'put',
			url : '/yinzw/w0w/user/'+id+oper,
		}).success(function(data, status) {
			//alertTip("删除成功！", "success", "tip_div");
			$alert.tip("操作成功!");
			$scope.query($scope.currentPage);
		}).error(function(data, status) {
			alert(data.error);
			$scope.data = data || "Request failed";
			$scope.status = status;
		});
	}
	
	//禁用账户
	$scope.enableUser = function(item) {
		var id = item.userId;
		var oper = item.enabled == 1?"/forbidden":"/enable";
		$http({
			method : 'put',
			url : '/zx_auth_xt/V0/user/'+id+oper,
		}).success(function(data, status) {
			//alertTip("删除成功！", "success", "tip_div");
			$alert.tip("操作成功!");
			$scope.query($scope.currentPage);
		}).error(function(data, status) {
			alert(data.error);
			$scope.data = data || "Request failed";
			$scope.status = status;
		});
	}

	 //获取部门下拉列表树
	$scope.orgDropdownTree = function() {//d
		$http.get(
				"/yinzw/org/dropdowntree", {}).success(
				function(data, status) {
					userService.orgTreeData = data;
					console.log("部门树");
					console.log(data);
				}).error(function(data, status) {
  					alert(data.error);
					$scope.data = data || "Request failed";
					$scope.status = status;
		});
	};
	
	
	//获取组角色下拉列表树
	$scope.roleDropdownTree = function() {//d
		$http.get(
				"/yinzw/role/dropdowntree", {}).success(
						function(data, status) {
							userService.roleTreeData = data;
							console.log("角色树");
							console.log(data);
						}).error(function(data, status) {
							alert(data.error);
							$scope.data = data || "Request failed";
							$scope.status = status;
						});
	};
	$scope.orgDropdownTree();
	$scope.roleDropdownTree();
	
	
	
	
	$scope.clear = function(){
		$scope.searchItem = {
				userName:"",
				nickName:""
		};
	}
	
	$scope.query($scope.currentPage);
	
  }])
	/**
	 * 新增页面controller
	 */
  .controller('userAddController', ['$scope', '$http', '$location', '$alert', 'userService', function($scope, $http, $location, $alert, userService) {
	  	$scope.submitted = false;
	 
	  
	  	//组织机构下拉列表树设置初始值
	    $scope.orgTreeData = userService.orgTreeData;//d
	    $scope.selectedOrg = $scope.orgTreeData[0];
	    
	    //角色下拉树设置初始值
	    $scope.roleTreeData = userService.roleTreeData;//d
	    $scope.selectedRole = $scope.roleTreeData[0];
	    
	    
		// 清空功能
		$scope.clearForm = function() {//d
			$scope.addItem = {
				accountState : "1"
			};
		}
		$scope.submitted = false;
		// 新增
		$scope.saveAddUser = function() {//d
			if ($scope.addForm.$valid) {
				$scope.addItem.orgId = $scope.selectedOrg.id;
				$scope.addItem.roleId = $scope.selectedRole.id;
				$http({
					method : 'post',
					url : '/yinzw/w0w/user',
					data : $scope.addItem,
				}).success(
						function(data, status) {
							//$('#addModal').modal('hide');
							//alertTip("新增成功！", "success", "tip_div");
							$alert.tip("操作成功!");
							$scope.backToList();
						}).error(function(data, status) {
		  					alert(data.error);
							$scope.data = data || "Request failed";
							$scope.status = status;
				});
			} else {
				$scope.submitted = true;
			}
		}
		
		$scope.backToList = function() {//d
			$location.path('/user/list');
		};
		
		$scope.clearForm();//d
  }])
//  	/**
//	 * 编辑页面controller
//	 */
//  .controller('userEditController', ['$scope', '$http', '$location', '$alert', 'userService', function($scope, $http, $location, $alert, userService) {
//		$scope.editItem = userService.editItem;
//		$scope.editItem.enabled = userService.editItem.enabled;
//		$scope.editItem.locked = userService.editItem.locked;
//		if(typeof($scope.editItem.userId) != "undefined"){
//			//组织机构下拉列表树设置初始值
//		    $scope.orgTreeData = userService.orgTreeData;
//		    $scope.selectedOrg = {id:$scope.editItem.orgEntity.orgId, name:$scope.editItem.orgEntity.orgName};
//		    $scope.submitted = false;
//		  	$scope.saveEditUser = function() {
//				var id = $scope.editItem.userId;
//				$scope.editItem.orgEntity = {orgId: $scope.selectedOrg.id};
//				if ($scope.editForm.$valid) {
//				$http({
//					method : 'put',
//					url : '/zx_auth_xt/V0/user/'+id,
//					data : $scope.editItem,
//					contentType : 'application/json',
//				}).success(function(data, status) {
//					//$('#updateModal').modal('hide')
//					//alertTip("修改成功！", "success", "tip_div");
//					$alert.tip("操作成功!");
//					$scope.backToList();
//				}).error(function(data, status) {
//						alert(data.error);
//					$scope.data = data || "Request failed";
//					$scope.status = status;
//				});
//				} else {
//		              $scope.submitted = true;
//			       }
//			}
//		}else{
//			$location.path('/user/user_list');
//		}
//		$scope.backToList = function() {
//			$location.path('/user/user_list');
//		}
//  }])
//  	/**
//	 * 详情页面controller
//	 */
//  .controller('userViewController', ['$scope', '$http', '$location', '$alert', 'userService', function($scope, $http, $location, $alert, userService) {
//	  $scope.viewItem = userService.viewItem;
//	  if(typeof($scope.viewItem.userName) == "undefined"){
//		  $location.path('/user/user_list');
//	  }
//	  $scope.viewItem.enabled = userService.viewItem.enabled.toString();
//	  $scope.viewItem.locked = userService.viewItem.locked.toString();
//	  
//	  $scope.backToList = function() {
//		  $location.path('/user/user_list');
//	  }
//  }])
//    /**
//	 * 用户角色管理页面controller
//	 */
//  .controller('userRolesListController', ['$scope', '$http', '$location', '$alert', 'userService', function($scope, $http, $location, $alert, userService) {
//	  var selectedUserId = userService.selectedUserId;
//	  	$scope.items = [];
//		$scope.maxSize = 5;
//		$scope.pagesize = 5;
//		$scope.totalItems = userService.totalItems;
//		$scope.currentPage = userService.currentPage;
//		$scope.pageChanged = function() {
//			$scope.queryUserRoles($scope.currentPage);
//		};
//		if(selectedUserId != 0){
//		//查询
//	  	$scope.queryUserRoles = function(page) {
//	  		page = page ? (page-1) : 0;
//	  		$http.get(
//	  				"/zx_auth_xt/V0/user/"+selectedUserId+"/roles?page="+page+"&size="+$scope.pagesize
//	  				+ "&sort=roleId,asc", {}).success(
//	  				function(data, status) {
//	  					$scope.items = data;
//	  					$scope.totalItems = data.totalItems;
//	  				}).error(function(data, status) {
//	  					alert(data.error);
//	  					$scope.data = data || "Request failed";
//	  					$scope.status = status;
//	  		});
//	  	};
//	  	//查询用户基本信息
//	  	$scope.queryUser = function() {
//	  		$http.get(
//	  				"/zx_auth_xt/V0/user/"+selectedUserId, {}).success(
//	  				function(data, status) {
//	  					$scope.useritem = data;
//	  				}).error(function(data, status) {
//	  					alert(data.error);
//	  					$scope.data = data || "Request failed";
//	  					$scope.status = status;
//	  		});
//	  	}
//		//保存用户角色
//		$scope.saveUserRoles = function() {
//			var roleIds = [];
//	  		for (var i=0; i<$scope.items.length; i++) {
//	  			if ($scope.items[i].poweron) {
//	  				roleIds.push($scope.items[i].roleId);
//	  			}
//	  		}
//			$http({
//				method : 'post',
//				url : '/zx_auth_xt/V0/user/'+selectedUserId+'/roles',
//				data : roleIds,
//			}).success(
//					function(data, status) {
//						//$('#addModal').modal('hide');
//						//alertTip("新增成功！", "success", "tip_div");
//						$alert.tip("操作成功!");
//						$scope.backToList();
//					}).error(function(data, status) {
//	  					alert(data.error);
//						$scope.data = data || "Request failed";
//						$scope.status = status;
//			});
//		}
//		//列表复选框
//        $scope.checkedAll = false;
//	  	$scope.checkAll = function() {
//	  		$scope.checkedAll = !$scope.checkedAll;
//	  		for (var i=0; i<$scope.items.length; i++) {
//	  			$scope.items[i].poweron = $scope.checkedAll;
//	  		}
//	  	};
//		}else{
//	  		$location.path('/user/user_list');
//	  	}
//		$scope.backToList = function() {
//			$location.path('/user/user_list');
//		}
//		$scope.queryUser();
//		$scope.queryUserRoles($scope.currentPage);
//  }])
//  /**
//	 * 用户菜单查看页面controller
//	 */
//.controller('userMenusTreeController', ['$scope', '$http', '$location', '$alert', 'userService', function($scope, $http, $location, $alert, userService) {
//	var selectedUserId = userService.selectedUserId;
//	if(selectedUserId != 0){
//	//查询
//  	$scope.queryUserMenus = function() {
//  		$http.get(
//  				"/zx_auth_xt/V0/user/"+selectedUserId+"/menus", {}).success(
//  				function(data, status) {
//  					$scope.items = data;
//  			        var menuTree = $('#menuTree').treeview({
//	  			          data: $scope.items,
//	  			          showIcon: false,
//	  			          //levels:2, //展开级别(默认值2)
//	  			          showCheckbox: true,
////	  			          onNodeChecked: function(event, node) {
////
////	  			          },
////	  			          onNodeUnchecked: function (event, node) {
////	  			        	  
////	  			          }
//	  			        });
////  			        $('#menuTree').treeview('disableAll');
//  				}).error(function(data, status) {
//  					alert(data.error);
//  					$scope.data = data || "Request failed";
//  					$scope.status = status;
//  		});
//  	};
//  	//查询用户基本信息
//  	$scope.queryUser = function() {
//  		$http.get(
//  				"/zx_auth_xt/V0/user/"+selectedUserId, {}).success(
//  				function(data, status) {
//  					$scope.useritem = data;
//  				}).error(function(data, status) {
//  					alert(data.error);
//  					$scope.data = data || "Request failed";
//  					$scope.status = status;
//  		});
//  	}
//	}else{
//		$location.path('/user/user_list');
//	}
//	$scope.backToList = function() {
//		$location.path('/user/user_list');
//	}
//	$scope.queryUser();
//	$scope.queryUserMenus();
//}]);
//





