package cn.edu.ncepu.role.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

/**
 * 角色菜单对应是实体类
 * @ClassName:：RoleMenuEntity 
 * @author ：yinzhiwen 
 * @date ：2018年6月12日 上午9:32:09
 */
@Entity
@Table(name = "db_role_menu")
public class RoleMenuEntity {

	/*
	 * 
	 * 主键id
	 */
	@Id
	@GenericGenerator(name="idGenerator", strategy="uuid")
	@GeneratedValue(generator="idGenerator")
	private String id;
	
	/*
	 * 角色id
	 */
	@Column(name = "role_id")
	private String roleId;
	
	/*
	 * 菜单id
	 */
	@Column(name = "menu_id")
	private String menuId;

	public RoleMenuEntity() {
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getRoleId() {
		return roleId;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}

	public String getMenuId() {
		return menuId;
	}

	public void setMenuId(String menuId) {
		this.menuId = menuId;
	}
	
	
}
