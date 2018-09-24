package cn.edu.ncepu.role.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

/**
 * 角色（权限）实体类
 * @ClassName:：RoleEntity 
 * @author ：yinzhiwen 
 * @date ：2018年5月19日 下午1:46:26
 */
@Entity
@Table(name = "db_role")
public class RoleEntity {
	/*
	 * 主键，id
	 */
	@Id
	@Column(name = "id")
	private String id;
	/*
	 * 角色名称
	 */
	private String name;
	/*
	 * 角色描述
	 */
	private String description;
	/*
	 * 权限等级5公司管理员，4公司领导，3财务部门经理，2部门经理，1普通员工
	 */
	@Column(name = "role_level")
	private String roleLevel;
	
	public String getRoleLevel() {
		return roleLevel;
	}

	public void setRoleLevel(String roleLevel) {
		this.roleLevel = roleLevel;
	}

	public RoleEntity() {
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	
	
}
