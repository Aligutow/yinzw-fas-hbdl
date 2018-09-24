package cn.edu.ncepu.sso.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import cn.edu.ncepu.common.classes.UserInfo;
/**
 * Token实体类
 * @ClassName:：TokenEntity 
 * @author ：yinzhiwen 
 * @date ：2018年6月9日 下午12:46:03
 */
@RedisHash(value = "token", timeToLive = 1800)
public class TokenEntity {
	@Id
	private String token;
	private String uid;
	private UserInfo userInfo;
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public String getUid() {
		return uid;
	}
	public void setUid(String uid) {
		this.uid = uid;
	}
	public UserInfo getUserInfo() {
		return userInfo;
	}
	public void setUserInfo(UserInfo userInfo) {
		this.userInfo = userInfo;
	}
	
	
}
