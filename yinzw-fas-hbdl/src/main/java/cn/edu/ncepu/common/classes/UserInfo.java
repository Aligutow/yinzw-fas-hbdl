package cn.edu.ncepu.common.classes;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * 用户基本信息
 * @ClassName:：UserInfo 
 * @author ：yinzhiwen 
 * @date ：2018年5月27日 下午9:00:43
 */
public class UserInfo {
	/**
	 * 用户ID
	 */
	private String userId;
	/**
	 * 账号
	 */
	private String account;
	/**
	 * 明文密码
	 */
	private String mwmm;
	/**
	 * 用户的真实姓名
	 */
	private String name;
	/**
	 * 电话
	 */
	private String phone;
    /**
     * 所属部门id
     */
	private String orgId;
	/**
	 * 角色
	 */
	private String role;
	/**
	 * 私有令牌
	 */
	private String privatetoken;
	/**
	 * 获取当前登录用户信息
	 * @Title：getCurrentUser 
	 * @param ：@return 
	 * @return ：UserInfo 
	 * @throws
	 */
	public static UserInfo getCurrentUser() {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
    	return (UserInfo)request.getSession().getAttribute("USER_CONTEXT");
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getAccount() {
		return account;
	}
	public void setAccount(String account) {
		this.account = account;
	}
	public String getMwmm() {
		return mwmm;
	}
	public void setMwmm(String mwmm) {
		this.mwmm = mwmm;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getOrgId() {
		return orgId;
	}
	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getPrivatetoken() {
		return privatetoken;
	}
	public void setPrivatetoken(String privatetoken) {
		this.privatetoken = privatetoken;
	}	
	
}
