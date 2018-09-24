package cn.edu.ncepu.login.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cn.edu.ncepu.common.classes.UserInfo;
import cn.edu.ncepu.common.utils.UuidUtils;
import cn.edu.ncepu.login.service.LoginService;
import cn.edu.ncepu.sso.entity.TokenEntity;
import cn.edu.ncepu.sso.service.TokenService;
import cn.edu.ncepu.user.entity.UserEntity;
import cn.edu.ncepu.user.service.UserService;
/**
 * 登录控制器类
 * @ClassName:：LoginController 
 * @author ：yinzhiwen 
 * @date ：2018年6月2日 下午8:54:07
 */
@RestController
@RequestMapping("/w0w")
public class LoginController {
	@Autowired
	private LoginService service;
	@Autowired
	private UserService userService;
	@Autowired
	private TokenService tokenService;
	
	@Value("${server.context-path}")
	private String contextPath;
	
	@Value("${app.login-path}")
	private String loginPath;

	/**
	 * 用户登录
	 * @Title：login 
	 * @param username
	 * @param password
	 * @param session
	 * @param response
	 * @param request
	 * @return 
	 * @return ：Map<String,Object> 
	 * @throws
	 */
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public Map<String, Object> login(
			@RequestParam(value="username",required = true, defaultValue = "") String username,
			@RequestParam(value="password",required = true, defaultValue = "") String password,
			HttpSession session, HttpServletResponse response,HttpServletRequest request){

		String md5Pwd = service.getMd5ByAccount(username, password);
		Map<String, Object> map = new HashMap<>();
		UserEntity user = userService.getUserByCountAndPwd(username, md5Pwd);
		if(user != null) {//登录成功
			//用户登录成功时生成一个唯一的token令牌
			String privatetoken = UuidUtils.id();
			
			//生成uuid供数据库建表使用
			System.out.println(UuidUtils.id());
			System.out.println(UuidUtils.id());
			System.out.println(UuidUtils.id());
			System.out.println(UuidUtils.id());
			System.out.println(UuidUtils.id());
			System.out.println(UuidUtils.id());
			System.out.println(UuidUtils.id());
			System.out.println(UuidUtils.id());
			System.out.println(UuidUtils.id());
			System.out.println(UuidUtils.id());
			
			UserInfo userInfo = userService.toUserInfo(user);
			userInfo.setMwmm(password);//保存明文密码到模型对象中
			userInfo.setPrivatetoken(privatetoken);//保存私有令牌到模型对象中
			
			//将此用户的登录信息存储到服务器的session中。
			session.setAttribute("USER_CONTEXT", userInfo);
			
			//保存token信息
			TokenEntity token =  new TokenEntity();
			token.setToken(privatetoken);//保存token令牌 
			token.setUserInfo(userInfo);//保存用户登录信息信息 
			
			//将令牌保存至reids缓存库中
			tokenService.saveToken(token);
			map.put("token", token);
		}
		return map;
	}

	/**
	 * 用户注销
	 * @Title：logout 
	 * @param session
	 * @param response
	 * @param request
	 * @throws Exception 
	 * @return ：void 
	 * @throws
	 */
	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	public void logout(HttpSession session, HttpServletResponse response,HttpServletRequest request) throws Exception {
		UserInfo userInfo = (UserInfo)session.getAttribute("USER_CONTEXT"); //session中取出当前用户信息
	
		if (userInfo != null) {
			//根据当前用户的令牌删除 Reids中的 token对象即可，如果Redis中没有这个token对象，则请求无效。
			TokenEntity tokenRecord = tokenService.getToken(userInfo.getPrivatetoken());//从redis中获取token对象
			tokenService.delTocken(tokenRecord);//从redis中删除token对象
			
			tokenRecord = tokenService.getToken(userInfo.getPrivatetoken());
			
			if(tokenRecord != null){
				System.out.println("Reids中的令牌对象未清除，注销失败！！！");
			}
			
			//将此用户的登录信息从服务器的session中清空。
			session.setAttribute("USER_CONTEXT", null);
		}
		
		response.sendRedirect(contextPath + loginPath);//返回到登录页面
	}

}
