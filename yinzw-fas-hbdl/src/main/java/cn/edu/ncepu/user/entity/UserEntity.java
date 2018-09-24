package cn.edu.ncepu.user.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.GenericGenerator;


/**
 * 用户实体类
 * @ClassName:：UserEntity 
 * @author ：yinzhiwen 
 * @date ：2018年5月19日 上午10:34:18
 */
@Entity
@Table(name = "db_user")
public class UserEntity {
	/*
	 * 主键，id,生成策略为uuid
	 */
	@Id
//	@GenericGenerator(name="idGenerator", strategy="uuid")
//	@GeneratedValue(generator="idGenerator")
	@Column(name = "id")
	private String id;
	/*
	 * 部门id
	 */
	@Column(name = "org_id")
	private String orgId;
	
	/*
	 * 账户
	 */
	private String account;
	/*
	 * 密码
	 */
	private String password;
	/*
	 * 创建时间
	 */
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "build_date")
	private Date buildDate;
	/*
	 * 用户姓名
	 */
	private String username;
	/*
	 * 电话
	 */
	private String phone;
	/*
	 * 权限
	 */
	@Column(name = "role_id")
	private String roleId;
	/*
	 * 所在公司id
	 */
	@Column(name = "company_id")
	private String companyId;
	/*
	 * 账号状态，1正常，0禁用
	 */
	@Column(name = "account_state")
	private int accountState;
	
	
	
	public UserEntity() {
	}
	
	public String getCompanyId() {
		return companyId;
	}

	public void setCompanyId(String companyId) {
		this.companyId = companyId;
	}

	public Date getBuildDate() {
		return buildDate;
	}
	public void setBuildDate(Date buildDate) {
		this.buildDate = buildDate;
	}
	public String getOrgId() {
		return orgId;
	}
	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getAccount() {
		return account;
	}
	public void setAccount(String account) {
		this.account = account;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	
	public String getRoleId() {
		return roleId;
	}
	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}
	public int getAccountState() {
		return accountState;
	}
	public void setAccountState(int accountState) {
		this.accountState = accountState;
	}
	
	
}
