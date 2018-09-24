package cn.edu.ncepu.menu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import cn.edu.ncepu.common.classes.UserInfo;
import cn.edu.ncepu.menu.entity.MenuNav;
import cn.edu.ncepu.menu.service.MenuService;

/**
 * 菜单控制类
 * @ClassName:：MenuController 
 * @author ：yinzhiwen 
 * @date ：2018年6月11日 下午9:55:59
 */

@RestController
@RequestMapping("/menu")
public class MenuController {
	@Autowired
	private MenuService service;
	
	/**
	 * 根据当前用户id获取导航菜单
	 * @Title：menus 
	 * @return 
	 * @return ：List<MenuNav> 
	 * @throws
	 */
	@RequestMapping(value = "/menunav", method = RequestMethod.GET)
	public List<MenuNav> menus() {

		return service.menuNav(UserInfo.getCurrentUser().getUserId());
	}
}
