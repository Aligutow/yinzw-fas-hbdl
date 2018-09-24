package cn.edu.ncepu.menu.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 菜单实体类
 * @ClassName:：MenuEntity 
 * @author ：yinzhiwen 
 * @date ：2018年5月21日 上午9:37:54
 */
@Entity
@Table(name = "db_menu")
public class MenuEntity {
	/*
	 * 主键，id,生成策略为uuid
	 */
	@Id
//	@GenericGenerator(name="idGenerator", strategy="uuid")
//	@GeneratedValue(generator="idGenerator")
	@Column(name = "id")
	private String id;
	/*
	 * 父菜单id
	 */
	@Column(name = "parent_id")
	private String parentId;
	/*
	 * 菜单名称
	 */
	@Column(name = "menu_name")
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
	
//	/**
//	 * 菜单域
//	 */
//	@Column(name = "menu_scope")
//	private String menuScope;
	
	/**
	 * menuEntity实体转换MenuNav类对象
	 * @Title：toMenuNav 
	 * @return 
	 * @return ：MenuNav 
	 * @throws
	 */
	public MenuNav toMenuNav() {
		MenuNav m = new MenuNav();
		m.setMenuId(id);
		m.setHref(href);
		m.setIcon(icon);
		m.setMenuName(menuName);
		m.setParentId(parentId);
		m.setTip(tip);
		return m;
	}
	
	public MenuEntity() {
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
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
//	public String getMenuScope() {
//		return menuScope;
//	}
//	public void setMenuScope(String menuScope) {
//		this.menuScope = menuScope;
//	}
	
	
	
	
	
	
}
