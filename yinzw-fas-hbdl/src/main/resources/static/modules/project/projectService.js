'use strict';

angular.module('cn.edu.ncepu.project.service', [])
  .factory('projectService',function(){
    return {
        editItem:{},
        viewItem:{},
        searchItem:{
        	username:"",
    		name:""
        },
        currentPage:1,
        totalItems:1,
//        totalPages:1,
        selectedUserId:0,
        orgMap:{},
        roleMap:{},
        orgTreeData:[],
        roleTreeData:[],
        sayHello:function(msg){
            alert(msg);
        }
    }
  });