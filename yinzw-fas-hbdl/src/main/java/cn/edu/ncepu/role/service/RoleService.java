package cn.edu.ncepu.role.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.edu.ncepu.org.entity.OrgEntity;
import cn.edu.ncepu.role.entity.RoleEntity;
import cn.edu.ncepu.role.repository.RoleRepository;

@Service
public class RoleService {

	@Autowired
	private RoleRepository repository;
	
	/**
	 * 通过角色id查找角色名称
	 * @Title：getRole 
	 * @param ：@param roleId
	 * @param ：@return 
	 * @return ：String 
	 * @throws
	 */
	public String getRole(String roleId) {
		return repository.findById(roleId).getName();
	}
	
	/**
	 * 返回所有角色id和角色名称的对应关系
	 * @Title：roleMap 
	 * @return 
	 * @return ：Map<String,String> 
	 * @throws
	 */
	public Map<String,String> roleMap(){
		Map<String,String> roleMap = new HashMap<>();
		List<RoleEntity> roles = repository.findAll();
		if(roles != null && roles.size() > 0) {
			for(RoleEntity role : roles) {
				roleMap.put(role.getId(), role.getName());
			}
		}
		
		return roleMap;
	}
	
	/**
	 * 查询所有角色信息
	 * @Title：roleList 
	 * @return 
	 * @return ：List<RoleEntity> 
	 * @throws
	 */
	public List<RoleEntity> roleList(){
		return repository.findAll();
	}
	
	
}
