package cn.edu.ncepu.register.controller;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cn.edu.ncepu.common.classes.ResultState;
import cn.edu.ncepu.common.classes.UserInfo;
import cn.edu.ncepu.common.exception.UserRegisterException;
import cn.edu.ncepu.common.utils.Md5Utils;
import cn.edu.ncepu.common.utils.UuidUtils;
import cn.edu.ncepu.company.entity.CompanyEntity;
import cn.edu.ncepu.company.service.CompanyService;
import cn.edu.ncepu.org.entity.OrgEntity;
import cn.edu.ncepu.org.service.OrgService;
import cn.edu.ncepu.register.service.RegisterService;
import cn.edu.ncepu.user.entity.UserEntity;
import cn.edu.ncepu.user.service.UserService;
/**
 * 注册控制器
 * @ClassName:：RegisterController 
 * @author ：yinzhiwen 
 * @date ：2018年5月23日 上午9:47:00
 */
@RestController
public class RegisterController {
	@Autowired
	private RegisterService service;
	@Autowired
	private UserService userService;
	@Autowired
	private CompanyService companyService;
	@Autowired
	private OrgService orgService;
	
	
	@RequestMapping(value = "/register/company", method = RequestMethod.POST)
	public ResultState registerCompany(
			@RequestParam(value="account",required = true, defaultValue = "") String account,
			@RequestParam(value="password",required = true, defaultValue = "") String password,
			@RequestParam(value="id",required = true, defaultValue = "") String id,
			@RequestParam(value="name",required = true, defaultValue = "") String name,
			@RequestParam(value="leader",required = true, defaultValue = "") String leader,
			@RequestParam(value="phone",required = false) String phone,
			@RequestParam(value="postcode",required = true, defaultValue = "") String postcode,
			@RequestParam(value="oa",required = true, defaultValue = "") String oa,
			@RequestParam(value="tin",required = true, defaultValue = "") String tin,
			@RequestParam(value="bank",required = true, defaultValue = "") String bank,
			@RequestParam(value="bankAddress",required = false) String bankAddress,
			@RequestParam(value="isGeneralTaxpayer",required = true, defaultValue = "") String isGeneralTaxpayer,
			@RequestParam(value="ps",required = false) String ps,
			HttpSession session,HttpServletResponse response) throws IOException {
		ResultState rs = null;
		try {
			if(!service.exist(account) && !companyService.exist(tin)) {//若不存在该账户
				//公司注册信息
				CompanyEntity company = new CompanyEntity();
				id = UuidUtils.id();      //重新生成公司id
//				String companyId = id;
				company.setId(id);
				company.setName(name);
				company.setLeader(leader);
				company.setPhone(phone);
				company.setPostcode(postcode);
				company.setOa(oa);
				company.setTin(tin);
				company.setBank(bank);
				company.setBankAddress(bankAddress);
				company.setIsGeneralTaxpayer(isGeneralTaxpayer);
				company.setPs(ps);
				
				//默认添加一个公司的管理部门
				String orgId = UuidUtils.id();
				String managerId = UuidUtils.id();
				OrgEntity org = new OrgEntity();
				org.setId(orgId);
				org.setCompanyId(id);
				org.setManagerId(managerId);
				org.setName("管理部门");
				//公司管理员账号信息
				UserEntity user = new UserEntity();
				user.setId(managerId);
				user.setOrgId("0");//公司管理员部门id置为0，公司领导部门id置为1，以此区分
				user.setAccount(account);
				Date date = new Date();
				user.setBuildDate(date);
				//对密码加密存储
				SimpleDateFormat dateFormat= new SimpleDateFormat("yyyyMMddhhmmss");
				String str = company.getName() + password + dateFormat.format(date);
				user.setPassword(Md5Utils.MD5(str));
				
				user.setRoleId("1");
				user.setUsername(company.getName() + "管理员");
				user.setAccountState(1);
				user.setCompanyId(id);
				
				
				
				boolean result1 = userService.save(user);
				boolean result2 = companyService.save(company);
				boolean result3 = orgService.save(org);
				rs = new ResultState();
				if(result1 && result2&& result3) {
					rs.setStatus("success");
				}else {
					rs.setStatus("error");
					rs.setErrorMsg("something wrong!");
				}
				
				
				
			}else {
				if(service.exist(account) && companyService.exist(tin)) {
					rs.setStatus("error");
					rs.setErrorMsg("用户名已存在并且该公司已被注册!");
				}else if(service.exist(account)) {
					rs.setStatus("error");
					rs.setErrorMsg("用户名已存在!");
					
				}else if(companyService.exist(tin)) {
					rs.setStatus("error");
					rs.setErrorMsg("该公司已被注册!");
					
				}
				throw new UserRegisterException("用户名已存在或者公司已被注册");
			}
		} catch (Exception e) {
			response.getWriter().write("{ \"error\": \""+e.getMessage()+"\"}");
		}

		return rs;
	}
}
