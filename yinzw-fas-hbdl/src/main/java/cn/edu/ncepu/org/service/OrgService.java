package cn.edu.ncepu.org.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import cn.edu.ncepu.common.utils.UuidUtils;
import cn.edu.ncepu.org.entity.OrgEntity;
import cn.edu.ncepu.org.repository.OrgRepository;
import cn.edu.ncepu.user.entity.UserEntity;
import cn.edu.ncepu.user.repository.UserRepository;

@Service
public class OrgService {
	@Autowired
	private OrgRepository repository;
	@Autowired
	private UserRepository userRepository;
	
	/**
	 * 保存部门实体
	 * @Title：save 
	 * @param org
	 * @return 
	 * @return ：boolean 
	 * @throws
	 */
	public boolean save(OrgEntity org) {
		OrgEntity o = new OrgEntity();
		o = repository.save(org);
		if(o == null)
			return false;
		else
			return true;
	}
	
	/**
	 * 新增部门
	 * @Title：addOrg 
	 * @param entity
	 * @return
	 * @throws Exception 
	 * @return ：OrgEntity 
	 * @throws
	 */
	public OrgEntity addOrg(OrgEntity entity) throws Exception {
		entity.setId(UuidUtils.id());
		return repository.save(entity);
	}
	
	/**
	 * 查询出所有部门id和部门名称的对应关系
	 * @Title：orgMap 
	 * @return 
	 * @return ：Map<String,String> 
	 * @throws
	 */
	public Map<String,String> orgMap(){
		Map<String,String> orgMap = new HashMap<>();
		List<OrgEntity> orgEntitys = repository.findAll();
		if(orgEntitys != null && orgEntitys.size() > 0) {
			for(OrgEntity org : orgEntitys) {
				orgMap.put(org.getId(), org.getName());
			}
		}
		return orgMap;
		
	}
	
	/**
	 * 查询当前用户所在公司的所有部门
	 * @Title：orgList 
	 * @return 
	 * @return ：List<OrgEntity> 
	 * @throws
	 */
	public List<OrgEntity> orgList(){
		UserInfo curUser = UserInfo.getCurrentUser();
		String userId = curUser.getUserId();
		UserEntity user = userRepository.findById(userId);
		String companyId = user.getCompanyId();
		return repository.findByCompanyId(companyId);
	}
	
	/**
	 * 修改部门信息
	 * @Title：updateOrg 
	 * @param entity
	 * @return
	 * @throws Exception 
	 * @return ：OrgEntity 
	 * @throws
	 */
	public OrgEntity updateOrg(OrgEntity entity) throws Exception {
		return repository.save(entity);
	}
	
	/**
	 * 删除部门信息
	 * @Title：deleteOrg 
	 * @param id
	 * @throws Exception 
	 * @return ：void 
	 * @throws
	 */
	public void deleteOrg(String id) throws Exception {

		repository.delete(id);
	}
	
	/**
	 * 根据id查询部门信息
	 * @Title：getOrg 
	 * @param id
	 * @return
	 * @throws Exception 
	 * @return ：OrgEntity 
	 * @throws
	 */
	public OrgEntity getOrg(String id) throws Exception {

		return repository.findOne(id);
	}
	
	/**
	 * 根据部门名称动态查询部门信息
	 * @Title：listOrg 
	 * @param orgName
	 * @param pageable
	 * @return
	 * @throws Exception 
	 * @return ：Page<OrgEntity> 
	 * @throws
	 */
	public Page<OrgEntity> listOrg(String orgName, Pageable pageable) throws Exception {

		Page<OrgEntity> list = repository.findAll(new Specification<OrgEntity>() {
			@Override
			public Predicate toPredicate(Root<OrgEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				Predicate predicate = cb.conjunction();
				List<Expression<Boolean>> expressions = predicate.getExpressions();
				
				if (!StringUtils.isEmpty(orgName)) {
					expressions.add(cb.like(root.<String> get("name"), "%" + orgName + "%"));
				}
				return predicate;
			}
		}, pageable);

		return list;
	}
	
	
	
	
}
