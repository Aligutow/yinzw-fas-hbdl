package cn.edu.ncepu.register.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import cn.edu.ncepu.user.entity.UserEntity;

public interface RegisterRepository extends JpaRepository<UserEntity,String>{
	
	UserEntity findByAccount(String account);
}
