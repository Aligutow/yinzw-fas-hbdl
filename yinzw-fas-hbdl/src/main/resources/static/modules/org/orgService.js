'use strict';

angular.module('cn.edu.ncepu.org.service', [])
  .factory('orgService',function(){
    return {
        editItem:{},
        viewItem:{},
        searchItem:{
    		orgName:"",
    		jglbdm:""
        },
        currentPage:1,
        totalItems:1,
//        totalPages:1,
        selectNodeId:0,
        xzqhTreeData:[],//行政区划树
        sayHello:function(msg){
            alert(msg);
        }
    }
  });