package cn.edu.ncepu.org.entity;

import java.util.List;

/*
 * 部门下拉树类
 */
public class DropdownTreeOrg {

	/**
	 * 部门id
	 */
	private String id;
	/**
	 * 部门名称
	 */
	private String name;
	/**
	 * 部门子节点部门信息集合
	 */
	private List<DropdownTreeOrg> children;
	public DropdownTreeOrg() {
		
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
	public List<DropdownTreeOrg> getChildren() {
		return children;
	}
	public void setChildren(List<DropdownTreeOrg> children) {
		this.children = children;
	}
	
	
}
