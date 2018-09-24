package cn.edu.ncepu.login.service;

import java.text.SimpleDateFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.edu.ncepu.common.utils.Md5Utils;
import cn.edu.ncepu.company.entity.CompanyEntity;
import cn.edu.ncepu.company.repository.CompanyRepository;
import cn.edu.ncepu.user.entity.UserEntity;
import cn.edu.ncepu.user.repository.UserRepository;
import cn.edu.ncepu.user.service.UserService;

@Service
public class LoginService {
	@Autowired
	private UserService userService;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private CompanyRepository companyRepository;
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
	
	/**
	 * 公司密码一律采用公司名称+密码+创建时间 组合并MD5加密，已知用户id
	 * @Title：getMd5ByUserId 
	 * @param userId
	 * @param password
	 * @return 
	 * @return ：String 
	 * @throws
	 */
	public String getMd5ByUserId(String userId,String password) {
		UserEntity user = userService.geUserById(userId);
		SimpleDateFormat dateFormat= new SimpleDateFormat("yyyyMMddhhmmss");
		String buildTime = dateFormat.format(user.getBuildDate());//账号创建时间
		String companyId = user.getCompanyId();
		CompanyEntity company = companyRepository.findById(companyId);
		String companyName = company.getName();//公司名称
		String md5Str = Md5Utils.MD5(companyName + password + buildTime);
		System.out.println(md5Str);
		return md5Str;
		
	}
	
	/**
	 * 公司密码一律采用公司名称+密码+创建时间 组合并MD5加密，已知用户名(账号)
	 * @Title：getMd5ByAccount 
	 * @param username
	 * @param password
	 * @return 
	 * @return ：String 
	 * @throws
	 */
	public String getMd5ByAccount(String username,String password) {
		UserEntity user = userRepository.findByAccount(username);
		SimpleDateFormat dateFormat= new SimpleDateFormat("yyyyMMddhhmmss");
		String buildTime = dateFormat.format(user.getBuildDate());//账号创建时间
		String companyId = user.getCompanyId();
		CompanyEntity company = companyRepository.findById(companyId);
		String companyName = company.getName();//公司名称
		String md5Str = Md5Utils.MD5(companyName + password + buildTime);
//		System.out.println(md5Str);
		return md5Str;
		
	}
	
	/**
	 * 公司密码一律采用公司名称+密码+创建时间 组合并MD5加密，已知公司id、和创建时间
	 * @Title：getMd5ByCompanyId 
	 * @param companyId
	 * @param password
	 * @param buildTime
	 * @return 
	 * @return ：String 
	 * @throws
	 */
	public String getMd5ByCompanyIdAndTime(String companyId,String password,String buildTime) {
		CompanyEntity company = companyRepository.findById(companyId);
		String companyName = company.getName();//公司名称
		String md5Str = Md5Utils.MD5(companyName + password + buildTime);
//		System.out.println(md5Str);
		return md5Str;
		
	}
}
