package cn.edu.ncepu.company.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.edu.ncepu.company.entity.CompanyEntity;
import cn.edu.ncepu.company.repository.CompanyRepository;

@Service
public class CompanyService {
	@Autowired
	private CompanyRepository repository;
	
	/**
	 * 保存公司实例
	 * @Title：save 
	 * @param company
	 * @return 
	 * @return ：boolean 
	 * @throws
	 */
	public boolean save(CompanyEntity company) {
		
		CompanyEntity com = repository.save(company);
		if(com == null)
			return false;
		else
			return true;
	}
	
	/**
	 * 根据纳税人识别号判断该公司是否已被注册
	 * @Title：exist 
	 * @param tin
	 * @return 
	 * @return ：boolean 
	 * @throws
	 */
	public boolean exist(String tin) {
		CompanyEntity com = repository.findByTin(tin);
		return com == null ? false : true;
	}
}
