package cn.edu.ncepu.menu.entity;

import java.util.List;

/**
 * 导航菜单类
 * @ClassName:：MenuNav 
 * @author ：yinzhiwen 
 * @date ：2018年6月11日 下午10:13:28
 */
public class MenuNav {
	
	private String menuId;
	/*
	 * 父菜单id
	 */
	private String parentId;
	/*
	 * 菜单名称
	 */
	private String menuName;
	/*
	 * 菜单链接
	 */
	private String href;
	/*
	 * 菜单图标
	 */
	private String icon;
	/*
	 * 菜单提示
	 */
	private String tip;
	/**
	 * 子菜单集合
	 */
	private List<MenuNav> children;
	public String getMenuId() {
		return menuId;
	}
	public void setMenuId(String menuId) {
		this.menuId = menuId;
	}
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	public String getMenuName() {
		return menuName;
	}
	public void setMenuName(String menuName) {
		this.menuName = menuName;
	}
	public String getHref() {
		return href;
	}
	public void setHref(String href) {
		this.href = href;
	}
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
	public String getTip() {
		return tip;
	}
	public void setTip(String tip) {
		this.tip = tip;
	}
	public List<MenuNav> getChildren() {
		return children;
	}
	public void setChildren(List<MenuNav> children) {
		this.children = children;
	}
	
	
}
