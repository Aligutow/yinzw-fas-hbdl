package cn.edu.ncepu.org.controller;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import cn.edu.ncepu.common.utils.UuidUtils;
import cn.edu.ncepu.org.entity.OrgEntity;
import cn.edu.ncepu.org.service.OrgService;
import cn.edu.ncepu.user.service.UserService;

@RestController
@RequestMapping("/org")
public class OrgController {

	@Autowired
	private OrgService service;
	@Autowired
	private UserService userService;
	
	/**
	 * 查询所有部门id和部门名称的对应关系
	 * @Title：orgMap 
	 * @return 
	 * @return ：Map<String,String> 
	 * @throws
	 */
	@ResponseBody
	@RequestMapping(value = "/orgMap", method = RequestMethod.GET)
	private Map<String,String> orgMap(){
		return service.orgMap();
	}
	
	/**
	 * 查询当前用户所属公司的所有部门信息
	 * @Title：orgDropdownTree 
	 * @return
	 * @throws Exception 
	 * @return ：List<OrgEntity> 
	 * @throws
	 */
	@RequestMapping(value = "/dropdowntree", method = RequestMethod.GET)
	public List<OrgEntity> orgDropdownTree() throws Exception {
		List<OrgEntity> list = service.orgList();
		return list;
	}
	
	/**
	 * 新增部门
	 * @Title：orgAdd 
	 * @param entity 
	 * @return ：void 
	 * @throws
	 */
	@RequestMapping(value = "/add", method = RequestMethod.POST)
	public void orgAdd(@RequestBody OrgEntity entity) {
		try {
			entity.setId(UuidUtils.id());
			String companyId = userService.getCompanyId();
			entity.setCompanyId(companyId);
			service.addOrg(entity);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * 修改部门信息
	 * @Title：orgUpdate 
	 * @param id
	 * @param entity 
	 * @return ：void 
	 * @throws
	 */
	@RequestMapping(value = "/up/{id}", method = RequestMethod.PUT)
//	@CacheEvict(value = "orgDropDownTreeApiCache", allEntries = true)
	public void orgUpdate(@PathVariable(value = "id") String id, @RequestBody OrgEntity entity) {
		entity.setId(id);
		try {
			service.updateOrg(entity);

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * 删除部门
	 * @Title：orgEnable 
	 * @param id 
	 * @return ：void 
	 * @throws
	 */
	@RequestMapping(value = "/del/{id}", method = RequestMethod.DELETE)
	 public void orgEnable(@PathVariable(value = "id") String id) {
	
	 try {
	 service.deleteOrg(id);
	 } catch (Exception e) {
	 // TODO Auto-generated catch block
	 e.printStackTrace();
	 }
	 }
	
	/**
	 * 分页动态查询部门信息
	 * @Title：orgList 
	 * @param orgName
	 * @param pageable
	 * @return
	 * @throws Exception 
	 * @return ：Page<OrgEntity> 
	 * @throws
	 */
	@RequestMapping(value = "/orgs", method = RequestMethod.GET)
	public Page<OrgEntity> orgList(@RequestParam(value = "orgName", required = false, defaultValue = "") String orgName,
			 Pageable pageable) throws Exception {
		Page<OrgEntity> list = service.listOrg(orgName, pageable);

		return list;
	}
	
	
}
