package cn.edu.ncepu.org.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import cn.edu.ncepu.org.entity.OrgEntity;

public interface OrgRepository extends JpaRepository<OrgEntity,String>{

	/**
	 * 查找某公司下所有部门
	 * @Title：findByCompanyId 
	 * @param companyId
	 * @return 
	 * @return ：List<OrgEntity> 
	 * @throws
	 */
	List<OrgEntity> findByCompanyId(String companyId);
	
	/**
	 * 动态查询部门信息
	 * @Title：findAll 
	 * @param spec
	 * @param pageable
	 * @return 
	 * @return ：Page<OrgEntity> 
	 * @throws
	 */
	Page<OrgEntity> findAll(Specification<OrgEntity> spec, Pageable pageable);
	
	/**
	 * 根据部门id查询部门信息
	 * @Title：findByOrgId 
	 * @param orgId
	 * @return 
	 * @return ：OrgEntity 
	 * @throws
	 */
	OrgEntity  findById(String orgId);
	
	/**
	 * 根据部门名称查询部门数量
	 * @Title：countOrgname 
	 * @param orgname
	 * @return 
	 * @return ：int 
	 * @throws
	 */
	@Query("select count(e.name) from OrgEntity e where e.name=?1 ")
	int countOrgname(String orgname);
	
}
