package cn.edu.ncepu.menu.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.edu.ncepu.menu.entity.MenuEntity;
import cn.edu.ncepu.menu.entity.MenuNav;
import cn.edu.ncepu.menu.repository.MenuRepository;
/**
 * 菜单service类
 * @ClassName:：MenuService 
 * @author ：yinzhiwen 
 * @date ：2018年6月11日 下午9:52:54
 */
@Service
@Transactional
public class MenuService {
	@Autowired
	private MenuRepository repository;
	
	/**
	 * 新增菜单
	 * @Title：addMenu 
	 * @param entity
	 * @return
	 * @throws Exception 
	 * @return ：MenuEntity 
	 * @throws
	 */
	public MenuEntity addMenu(MenuEntity entity) throws Exception {

		return repository.save(entity);
	}
	
	/**
	 * 
	 * @Title：getMenu 
	 * @param id
	 * @return
	 * @throws Exception 
	 * @return ：MenuEntity 
	 * @throws
	 */
	public MenuEntity getMenu(String id) throws Exception {

		return repository.findOne(id);
	}
	/**
	 * 根据当前用户id获取导航菜单
	 * @Title：menuNav 
	 * @param userId
	 * @param menuScope
	 * @return 
	 * @return ：List<MenuNav> 
	 * @throws
	 */
	public List<MenuNav> menuNav(String userId) {
		List<MenuEntity> userMenus = repository.findUserMenus(userId);
		List<MenuNav> menuNavs = toMenuNavList(userMenus,userMenus);
		menuNavs = menuNavs.stream().filter(x -> x.getParentId().equals("0")) //过滤掉子菜单
				.collect(Collectors.toList());
		return menuNavs;
	}
	
	/**
	 * 判断当前菜单是否为当前用户权限内的菜单
	 * @Title：menuInPermission 
	 * @param permission
	 * @param menuId
	 * @return 
	 * @return ：boolean 
	 * @throws
	 */
	private boolean menuInPermission(List<MenuEntity> permission, String menuId) {

		boolean flag = false;
		for (MenuEntity m : permission) {
			if (m.getId().equals(menuId)) {
				flag = true;
				break;
			}
		}

		return flag;
	}
	
	/**
	 * 将MenuEntity集合转化为MenuNav集合，并且按用户权限过滤掉权限以外的菜单
	 * @Title：toMenuNavList 
	 * @param menus 要转化的集合
	 * @param userMenus  用户权限内能使用的菜单集合，之所以要加这个参数是担心MenuEntity实例的children中有权限以外的菜单
	 * @return 
	 * @return ：List<MenuNav> 
	 * @throws
	 */
	private List<MenuNav> toMenuNavList(List<MenuEntity> menus,List<MenuEntity> userMenus){
		List<MenuNav> menuNavs = new ArrayList<>();
		for(MenuEntity menu : menus) {//遍历要转化的MenuList
			if(menuInPermission(menus,menu.getId())) {//判断该菜单是否属于用户权限内的菜单,即转化的同时还按权限进行了过滤
				MenuNav menuNav = menu.toMenuNav();
				List<MenuEntity> menuChildren = repository.findByParentId(menu.getId());
				if(menuChildren != null || menuChildren.size() > 0) { //若有子菜单，则为导航菜单实例设置儿子属性
					List<MenuNav> menuNavChildren = toMenuNavList(menuChildren,userMenus);//递归调用
					menuNav.setChildren(menuNavChildren);
				}else {                                  //若没有子菜单，则将导航菜单实例的儿子属性置为null
					menuNav.setChildren(null);
				}
				
				menuNavs.add(menuNav);
				
				
			}
		}
		
		return menuNavs;
		
	}
	
	
}
