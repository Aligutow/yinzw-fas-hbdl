package cn.edu.ncepu.login.util;

import org.springframework.beans.factory.annotation.Autowired;

import cn.edu.ncepu.user.service.UserService;

/**
 * 登录工具类
 * @ClassName:：LoginUtils 
 * @author ：yinzhiwen 
 * @date ：2018年6月9日 下午8:58:04
 */
public class LoginUtils {

	@Autowired
	private UserService userService;
	
	/**
	 * 登录验证用户和密码是否正确
	 * @Title：verify 
	 * @param username
	 * @param password 加密后的密码
	 * @return 
	 * @return ：boolean 
	 * @throws
	 */
	public boolean verify(String username,String password) {
		if(userService.getUserByCountAndPwd(username, password) == null) {
			return false;
		}
		return true;
		
	}
}
