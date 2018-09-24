package cn.edu.ncepu.org.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

/**
 * 部门实体类
 * @ClassName:：OrgEntity 
 * @author ：yinzhiwen 
 * @date ：2018年5月21日 上午8:47:48
 */
@Entity
@Table(name = "db_org")
public class OrgEntity {
	/*
	 * 主键，id,生成策略为uuid
	 */
	@Id
//	@GenericGenerator(name="idGenerator", strategy="uuid")
//	@GeneratedValue(generator="idGenerator")
	@Column(name = "id")
	private String id;
	/*
	 * 部门名称
	 */
	private String name;
	/*
	 * 部门经理id
	 */
	@Column(name = "manager_id")
	private String managerId;
	/*
	 * 公司id
	 */
	@Column(name = "company_id")
	private String companyId;
	
	public DropdownTreeOrg toDtOrg(OrgEntity org) {
		DropdownTreeOrg dtOrg = new DropdownTreeOrg();
		dtOrg.setId(id);
		dtOrg.setName(name);
		dtOrg.setChildren(null);
		return dtOrg;
	}
	
	public OrgEntity() {
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
	public String getManagerId() {
		return managerId;
	}
	public void setManagerId(String managerId) {
		this.managerId = managerId;
	}
	public String getCompanyId() {
		return companyId;
	}
	public void setCompanyId(String companyId) {
		this.companyId = companyId;
	}
	
	
	
	
	
}
