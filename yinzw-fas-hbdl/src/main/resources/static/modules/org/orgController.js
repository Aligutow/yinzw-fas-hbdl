'use strict';

angular.module('cn.edu.ncepu.org.controller', [])
	/**
	 * 列表页面controller
	 */
  .controller('orgListController', ['$scope', '$http', '$location', '$alert', 'orgService', function($scope, $http, $location, $alert, orgService) {
	$scope.items = [];
	$scope.maxSize = 5;
	$scope.pagesize = 5;
	$scope.index = 0;
	$scope.totalItems = orgService.totalItems;
	$scope.currentPage = orgService.currentPage;
	$scope.pageChanged = function() {
		$scope.query($scope.currentPage);
	};
	$scope.searchItem = orgService.searchItem;
	$scope.selectNodeId = orgService.selectNodeId;	
	//查询
	$scope.query = function(page) {//d
		page = page ? (page-1) : 0;
		var name = $scope.searchItem.name;
		$http({
			method:"get",
			url:"/yinzw/org/orgs",
			params:{
				"page":page,
				"size":$scope.pagesize,
				"sort":"managerId,asc",
				"orgName":name
			}
		}).success(
				function(data, status) {
					$scope.items = data.content;
					$scope.totalItems = data.totalElements;
				}).error(function(data, status) {
					$scope.data = data || "Request failed";
					$scope.status = status;
		});
	};
	
	//新增
	$scope.addOrg = function() {//d
		orgService.searchItem = $scope.searchItem;
		orgService.selectNodeId = $scope.selectNodeId;
		$location.path('/org/org_add');
	}
	
	//编辑
	$scope.editOrg = function(item) {
		orgService.editItem = item;
		orgService.totalItems = $scope.totalItems;
		orgService.currentPage = $scope.currentPage;
		orgService.searchItem = $scope.searchItem;
		orgService.selectNodeId = $scope.selectNodeId;
		$location.path('/org/org_edit');
	};
	
	//删除
	$scope.delOrg = function(item) {
		var id = item.id + '';
		$http({
			method : 'delete',
			url : '/yinzw/org/del/'+id,
		}).success(function(data, status) {
			//alertTip("删除成功！", "success", "tip_div");
			$alert.tip("操作成功!");
			$scope.query($scope.currentPage);
		}).error(function(data, status) {
			$scope.data = data || "Request failed";
			$scope.status = status;
		});
	}
	
	$scope.clear = function(){
		$scope.searchItem.name = "";
		$scope.searchItem.jglbdm = "";
	}
	$scope.query($scope.currentPage);
	
	
	
  }])
	/**
	 * 新增页面controller
	 */
  .controller('orgAddController', ['$scope', '$http', '$location', '$alert', 'orgService', function($scope, $http, $location, $alert, orgService) {
	  // 清空功能
		$scope.clearForm = function() {//d
			$scope.addItem = {
				name : ""
			};
		}
	
		//返回
		$scope.backToList = function() {//d
			$location.path('/org/list');
		}
	
		// 新增保存		
		$scope.saveAddOrg = function() {//d
			if ($scope.addForm.$valid) {
				$http({
					method : 'post',
					url : '/yinzw/org/add',
					data : $scope.addItem,
				}).success(
						function(data, status) {
							//$('#addModal').modal('hide');
							$alert.tip("操作成功!");
							$scope.backToList();
						}).error(function(data, status) {
							$scope.data = data || "Request failed";
							$scope.status = status;
				});
			} else {//待优化
	              $scope.submitted = true;
		    }
		};
		
		
		
		//$scope.clearForm();
  }])
  	/**
	 * 编辑页面controller
	 */
  .controller('orgEditController', ['$scope', '$http', '$location', '$alert', 'orgService', function($scope, $http, $location, $alert, orgService) {
		$scope.editItem = orgService.editItem;
		
		if(typeof($scope.editItem.orgId) != "undefined"){
			//组织机构下拉列表树设置初始值
			$scope.oldxzqhid = $scope.editItem.xzqhEntity.xzqhId;//行政区划编号
			$scope.oldjglbdm= $scope.editItem.jglbdm;//机构类别代码
			$scope.oldbmdm = $scope.editItem.bmdm;//部门代码
			//行政区划下拉列表树设置初始值
		    $scope.xzqhTreeData = orgService.xzqhTreeData;
		    $scope.selectedXzqh = {id:$scope.editItem.xzqhEntity.xzqhId, name:$scope.editItem.xzqhEntity.xzqhmc};
		    $scope.backToList = function() {
				$location.path('/org/org_list');
			}
			if( $scope.selectedXzqh==null|| $scope.selectedXzqh==undefined||$scope.selectedXzqh==""){
				$scope.backToList();
			} 
			
			//读取机构类型数据字典
			$scope.jglbList = [];
			$scope.getDicts = function() {
				$http.get("/zx_auth_xt/V0/member/dicts?typeIds=JGLBDM").success(
						function(data, status) {
							$scope.jglbList = data.JGLBDM;
						}).error(function(data, status) {
							$scope.data = data || "Request failed";
							$scope.status = status;
				});
			};
			$scope.getDicts();
 
			//判断是否选择机构类别
			$scope.chooseJglbdm = function(jglbdm){
				 if(jglbdm==null||jglbdm==undefined||jglbdm==""){
					 $alert.info({message:"请优先选择机构类别！"});
					  $scope.submitted = true;
				 }else{
					  $scope.submitted = false;
				 }
			}
			$scope.editItem.enabled = orgService.editItem.enabled.toString();
			$scope.editItem.parentId = orgService.selectNodeId;
			$scope.submitted = false;
			$scope.isShowPic  =false;//显示生成编码层
			//编辑保存
		  	$scope.saveEditOrg = function() {
		  		$('#saveBtn').attr("disabled",true);//保存按钮置灰
				var id = $scope.editItem.orgId;
				$scope.editItem.xzqhEntity = {xzqhId: $scope.selectedXzqh.id};//选择的行政区划编号
				if ($scope.editForm.$valid) {
					$alert.warning({
		                message: '修改部门信息后将重新生成验证码以及公共信用信息资源目录编码，确定要修改信息吗？',
		                confirm: function () {  
		                	$scope.isShowPic = true;
							$http({
								method : 'put',
								url : '/zx_auth_xt/V0/org/'+id,
								data : $scope.editItem,
								contentType : 'application/json',
							}).success(function(data, status) {
								//$('#updateModal').modal('hide')
								if($scope.oldxzqhid!= $scope.editItem.xzqhEntity.xzqhId||$scope.oldjglbdm!=$scope.editItem.jglbdm||$scope.oldbmdm!=$scope.editItem.bmdm){
//									alert($scope.oldxzqhid+"@@@"+ $scope.editItem.xzqhEntity.xzqhId);
//									alert($scope.oldjglbdm+"@@@"+$scope.editItem.jglbdm);
//									alert($scope.oldbmdm+"@@@"+$scope.editItem.bmdm);
									$http({
										method : 'post',
										url : '/zx_auth_xt/V0/org/makeJym', 
										params:{"orgid":$scope.editItem.orgId}
									}).success(function(data, status) {
										$scope.isShowPic = false; 
										
									}).error(function(data, status) {
										$scope.data = data || "Request failed";
										$scope.status = status;
									}); 
								} 
								$alert.tip("操作成功");
								$scope.backToList();
							}).error(function(data, status) {
								$scope.data = data || "Request failed";
								$scope.status = status;
							});
		                }, cancel: function () {
		                }
					});
				} else {
		              $scope.submitted = true;
		              $('#saveBtn').attr("disabled",false);//保存按钮启用
			    }
			}
		}else{
			$location.path('/org/org_list');
		}
		 
  }])
  	/**
	 * 详情页面controller
	 */
  .controller('orgViewController', ['$scope', '$http', '$location', '$alert', 'orgService', function($scope, $http, $location, $alert, orgService) {
	  	$scope.viewItem = orgService.viewItem;
	  	if(typeof($scope.viewItem.orgId) != "undefined"){
	  	$scope.viewItem.enabled = orgService.viewItem.enabled.toString();
	  	}else{
	  		$location.path('/org/org_list');
	  	}
		$scope.backToList = function() {
			$location.path('/org/org_list');
		}
		
		
		//读取机构类型数据字典
		$scope.jglbList = [];
		$scope.getDicts = function() {
			$http.get("/zx_auth_xt/V0/member/dicts?typeIds=JGLBDM").success(
					function(data, status) {
						$scope.jglbList = data.JGLBDM;
					}).error(function(data, status) {
						$scope.data = data || "Request failed";
						$scope.status = status;
			});
		};
		$scope.getDicts();
		//用于返回表类型的标识含义描述，对列表中的代码值进行转换（xyzt）
		$scope.showCoder = function(propList, propkey) {
			for (var i=0; i<propList.length; i++) {
	    	   if (propkey == propList[i].key) {
	    		   return propList[i].value;
	    	   }
			}
		};
  }]);
