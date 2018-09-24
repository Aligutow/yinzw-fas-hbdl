package cn.edu.ncepu.role.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import cn.edu.ncepu.role.entity.RoleEntity;


public interface RoleRepository extends JpaRepository<RoleEntity,String>{
	
	RoleEntity findById(String roleId);
}
