package cn.edu.ncepu.role.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import cn.edu.ncepu.org.entity.OrgEntity;
import cn.edu.ncepu.role.entity.RoleEntity;
import cn.edu.ncepu.role.service.RoleMenuService;
import cn.edu.ncepu.role.service.RoleService;
/**
 * 角色控制类
 * @ClassName:：RoleController 
 * @author ：yinzhiwen 
 * @date ：2018年6月12日 上午10:26:50
 */
@RestController
@RequestMapping("/role")
public class RoleController {

	@Autowired
	private RoleMenuService roleMenuService;
	@Autowired
	private RoleService service;
	
	@RequestMapping(value = "/init", method = RequestMethod.GET)
	public void init() {
		roleMenuService.init();
	}
	
	/**
	 * 查询所有角色id和角色名称的对应关系
	 * @Title：roleMap 
	 * @return 
	 * @return ：Map<String,String> 
	 * @throws
	 */
	@RequestMapping(value = "/roleMap", method = RequestMethod.GET)
	private Map<String,String> roleMap(){
		return service.roleMap();
	}
	
	/**
	 * 查询所有角色信息
	 * @Title：roleDropdownTree 
	 * @return
	 * @throws Exception 
	 * @return ：List<RoleEntity> 
	 * @throws
	 */
	@RequestMapping(value = "/dropdowntree", method = RequestMethod.GET)
	public List<RoleEntity> roleDropdownTree() throws Exception {
		List<RoleEntity> list = service.roleList();
		return list;
	}
	
	
}
