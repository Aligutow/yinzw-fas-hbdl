package cn.edu.ncepu.user.service;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import cn.edu.ncepu.common.classes.UserInfo;
import cn.edu.ncepu.common.utils.Md5Utils;
import cn.edu.ncepu.company.entity.CompanyEntity;
import cn.edu.ncepu.company.repository.CompanyRepository;
import cn.edu.ncepu.role.service.RoleService;
import cn.edu.ncepu.user.entity.UserEntity;
import cn.edu.ncepu.user.repository.UserRepository;

@Service
public class UserService {
	@Autowired
	private UserRepository repository;
	@Autowired
	private RoleService roleService;
	@Autowired
	private CompanyRepository companyRepository;
	
	/**
	 * 按用户id查询用户
	 * @Title：geUserById 
	 * @param userId
	 * @return 
	 * @return ：UserEntity 
	 * @throws
	 */
	public UserEntity geUserById(String userId) {
		
		return repository.findById(userId);
	}
	
	/**
	 * 新增用户
	 * @Title：addUser 
	 * @param entity
	 * @return
	 * @throws Exception 
	 * @return ：UserEntity 
	 * @throws
	 */
	public UserEntity addUser(UserEntity entity) throws Exception {

		return repository.save(entity);
	}
	
	/**
	 * 修改用户信息
	 * @Title：updateUser 
	 * @param entity
	 * @return
	 * @throws Exception 
	 * @return ：UserEntity 
	 * @throws
	 */
	public UserEntity updateUser(UserEntity entity) throws Exception {

		return repository.save(entity);
	}
	
	/**
	 * 保存用户实体
	 * @Title：save 
	 * @param ：@param user
	 * @param ：@return 
	 * @return ：boolean 
	 * @throws
	 */
	public boolean save(UserEntity user) {
		UserEntity u = repository.save(user);
		if(u == null)
			return false;
		else
			return true;
	}
	
	/**
	 * 根据用户id删除用户信息
	 * @Title：deleteUser 
	 * @param id
	 * @throws Exception 
	 * @return ：void 
	 * @throws
	 */
	public void deleteUser(String id) throws Exception {

		repository.delete(id);
	}
	
	/**
	 * 根据用户id查询用户信息
	 * @Title：getUser 
	 * @param id
	 * @return
	 * @throws Exception 
	 * @return ：UserEntity 
	 * @throws
	 */
	public UserEntity getUser(String id) throws Exception {

		return repository.findOne(id);
	}
	
	/**
	 * 将用户实体对象转化为用户信息类对象
	 * @Title：toUserInfo 
	 * @param ：@param user
	 * @param ：@return 
	 * @return ：UserInfo 
	 * @throws
	 */
	public UserInfo toUserInfo(UserEntity user) {
		UserInfo userInfo = new UserInfo();
		userInfo.setAccount(user.getAccount());
		userInfo.setOrgId(user.getOrgId());
		userInfo.setPhone(user.getPhone());
		String roleId = user.getRoleId();
		userInfo.setRole(roleService.getRole(roleId));
		userInfo.setUserId(user.getId());
		userInfo.setName(user.getUsername());
		return userInfo;
		
	}
	
	/**
	 * 按账户和密码查询用户
	 * @Title：getUserByCountAndPwd 
	 * @param username
	 * @param password
	 * @return 
	 * @return ：UserEntity 
	 * @throws
	 */
	public UserEntity getUserByCountAndPwd(String username,String password) {
		
		
		return repository.findByAccountAndPassword(username, password);
	}
	
	
	/**
	 * 根据用户名（账号）、用户姓名、用户id分页查询用户信息
	 * @Title：listUser 
	 * @param username
	 * @param name
	 * @param orgId
	 * @param pageable
	 * @return 
	 * @return ：Page<UserEntity> 
	 * @throws
	 */
	public Page<UserEntity> listUser(String username, String name,String orgId, Pageable pageable) throws Exception {
		Page<UserEntity> list = userListPage(username,name,orgId,pageable);
		return list;
	}
	
	/**
	 * 根据用户名（账号）、用户姓名、用户id分页查询用户信息
	 * @Title：userListPage 
	 * @param username
	 * @param name
	 * @param orgId
	 * @param pageable
	 * @return 
	 * @return ：Page<UserEntity> 
	 * @throws
	 */
	public Page<UserEntity> userListPage(String username, String name,String orgId, Pageable pageable) throws Exception {
		
		Page<UserEntity> list = repository.findAll(new Specification<UserEntity>() {
			@Override
			public Predicate toPredicate(Root<UserEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				Predicate predicate = cb.conjunction();
				List<Expression<Boolean>> expressions = predicate.getExpressions();
				//获取非市级管理员，本部门行政区划下所有用户
//				if(orgId!=null&&!"55AE5D5031014A84E05365041EAC302E".equals(orgId)){
//					List<OrgEntity> orgIdList = new ArrayList<OrgEntity>();
//					OrgEntity currOrg = orgRepository.findByOrgId(orgId);
//					//查询该用户所在同级的双公示数据
//					List<OrgEntity> orgList = orgRepository.findByParentIdAndXzqhEntityAndEnabled(orgId,currOrg.getXzqhEntity(),1);
//					for(OrgEntity org:orgList){
//						orgIdList.add(org);
//					}
//					orgIdList.add(currOrg);
//					expressions.add(cb.and(root.<String>get("orgEntity").in(orgIdList)));
//				}
				if (!StringUtils.isEmpty(username)) {
					expressions.add(cb.like(root.<String> get("account"), "%" + username + "%"));
				}
				if (!StringUtils.isEmpty(name)) {
					expressions.add(cb.like(root.<String> get("username"), "%" + name + "%"));
				}
				if (!StringUtils.isEmpty(orgId)) {
					expressions.add(cb.equal(root.<String> get("orgId"), orgId));
				}
				return predicate;
			}
		}, pageable);

		return list;
	}
	
	/**
	 * 更改密码
	 * @Title：changePwd 
	 * @param userId
	 * @param pwd
	 * @throws Exception 
	 * @return ：void 
	 * @throws
	 */
	public void changePwd(String userId, String pwd) throws Exception {

		repository.changePwd(userId, pwd);
	}
	
	/**
	 * 锁定用户
	 * @Title：lockUser 
	 * @param userId
	 * @throws Exception 
	 * @return ：void 
	 * @throws
	 */
	public void lockUser(String userId) throws Exception {

		repository.lockUser(userId);
	}
	
	/**
	 * 解锁用户
	 * @Title：unlockUser 
	 * @param userId
	 * @throws Exception 
	 * @return ：void 
	 * @throws
	 */
	public void unlockUser(String userId) throws Exception {

		repository.unlockUser(userId);
	}
	
	/**
	 * 获取当前登录用户公司id
	 * @Title：getCompanyId 
	 * @return 
	 * @return ：String 
	 * @throws
	 */
	public String getCompanyId() {
		UserInfo user = UserInfo.getCurrentUser();
		String userId = user.getUserId();
		UserEntity u = repository.findById(userId);
		String companyId = u.getCompanyId();
		return companyId;
	}
	
	
	
}
