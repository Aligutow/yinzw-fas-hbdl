package cn.edu.ncepu.company.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import cn.edu.ncepu.company.entity.CompanyEntity;

public interface CompanyRepository extends JpaRepository<CompanyEntity,String>{
	
	/**
	 * 根据公司id查询公司
	 * @Title：findById 
	 * @param id
	 * @return 
	 * @return ：CompanyEntity 
	 * @throws
	 */
	CompanyEntity findById(String id);
	
	/**
	 * 根据纳税人识别号查询公司
	 * @Title：findByTin 
	 * @param tin
	 * @return 
	 * @return ：CompanyEntity 
	 * @throws
	 */
	CompanyEntity findByTin(String tin);
	
	
	
	
	
	
	
	
	
	
}
