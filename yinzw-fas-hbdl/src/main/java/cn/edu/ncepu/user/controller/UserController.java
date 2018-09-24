package cn.edu.ncepu.user.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cn.edu.ncepu.common.classes.UserInfo;
import cn.edu.ncepu.common.utils.UuidUtils;
import cn.edu.ncepu.login.dto.EchartsData;
import cn.edu.ncepu.login.dto.Pair;
import cn.edu.ncepu.login.service.LoginService;
import cn.edu.ncepu.user.entity.UserEntity;
import cn.edu.ncepu.user.service.UserService;

@RestController
@RequestMapping("/w0w")
public class UserController {
	/**
	 * 配置默认密码
	 */
	@Value("${app.config.default_pwd}")
	private String defaultPwd;
	
	@Autowired
	private UserService service;
	@Autowired
	private LoginService loginService;
	
	/**
	 * 查询当前用户信息
	 * @Title：curUser 
	 * @return 
	 * @return ：UserInfo 
	 * @throws
	 */
	@RequestMapping(value = "/userInfo", method = RequestMethod.GET)
	public UserInfo curUser() {
		return UserInfo.getCurrentUser();
	}
	@RequestMapping(value = "/test", method = RequestMethod.GET)
	public EchartsData test() {
		EchartsData data = new EchartsData();
		List<String> names = new ArrayList<>();
		List<String> values = new ArrayList<>();
		List<Pair> pairs = new ArrayList<>();
		
		Pair p1 = new Pair();
		Pair p2 = new Pair();
		Pair p3 = new Pair();
		p1.setName("小明");
		p2.setName("小李");
		p3.setName("小张");
		p1.setValue("50");
		p2.setValue("60");
		p3.setValue("70");
		names.add("小明");
		names.add("小李");
		names.add("小张");
		values.add("50");
		values.add("60");
		values.add("70");
		
		pairs.add(p1);
		pairs.add(p2);
		pairs.add(p3);
		
		data.setNames(names);
		data.setPairs(pairs);
		data.setValues(values);
		
		return data;
	}
	
	/**
	 * 新增用户
	 * @Title：userAdd 
	 * @param entity 
	 * @return ：void 
	 * @throws
	 */
	@RequestMapping(value = "/user", method = RequestMethod.POST)
	public void userAdd(@RequestBody UserEntity entity) {
		
		entity.setId(UuidUtils.id());
		Date date = new Date();
		entity.setBuildDate(date);
		SimpleDateFormat dateFormat= new SimpleDateFormat("yyyyMMddhhmmss");
		String buildTime = dateFormat.format(date);
		entity.setCompanyId(service.getCompanyId());
		String md5Pwd = loginService.getMd5ByCompanyIdAndTime(service.getCompanyId(), defaultPwd, buildTime);
		entity.setPassword(md5Pwd);
		
		try {
			service.addUser(entity);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * 锁定用户（设置用户为不可用状态）
	 * @Title：userLock 
	 * @param id 
	 * @return ：void 
	 * @throws
	 */
	@RequestMapping(value = "/user/{id}/lock", method = RequestMethod.PUT)
	public void userLock(@PathVariable(value = "id") String id) {
		try {
			service.lockUser(id);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * 解锁用户（设置用户为可用状态）
	 * @Title：userUnlock 
	 * @param id 
	 * @return ：void 
	 * @throws
	 */
	@RequestMapping(value = "/user/{id}/unlock", method = RequestMethod.PUT)
	public void userUnlock(@PathVariable(value = "id") String id) {
		try {
			service.unlockUser(id);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * 修改用户信息
	 * @Title：userUpdate 
	 * @param id
	 * @param entity 
	 * @return ：void 
	 * @throws
	 */
	@RequestMapping(value = "/user/{id}", method = RequestMethod.PUT)
	public void userUpdate(@PathVariable(value = "id") String id, @RequestBody UserEntity entity) {
		entity.setId(id);
		try {
			UserEntity record = service.getUser(id);
			entity.setPassword(record.getPassword());
			service.updateUser(entity);

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	
	/**
	 * 根据userid获取用户信息
	 * @Title：userGet 
	 * @param id
	 * @return 
	 * @return ：UserEntity 
	 * @throws
	 */
	@RequestMapping(value = "/user/{id}", method = RequestMethod.GET)
	public UserEntity userGet(@PathVariable(value = "id") String id) {

		UserEntity user = new UserEntity();
		try {
			user = service.getUser(id);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return user;
	}
	
	/**
	 * 分页获取用户信息
	 * @Title：userPublicList 
	 * @param username
	 * @param name
	 * @param orgId
	 * @param pageable
	 * @return
	 * @throws Exception 
	 * @return ：Page<UserEntity> 
	 * @throws
	 */
	@RequestMapping(value = "/users", method = RequestMethod.GET)
	public Page<UserEntity> userPublicList(
			@RequestParam(value = "username", required = false, defaultValue = "") String username,
			@RequestParam(value = "name", required = false, defaultValue = "") String name,
			@RequestParam(value = "orgId", required = false, defaultValue = "") String orgId, Pageable pageable)
			throws Exception {

		orgId = null;
		Page<UserEntity> list = service.listUser(username,name,orgId,pageable);

		return list;
	}
	
	
}
