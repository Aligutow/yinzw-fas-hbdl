package cn.edu.ncepu.user.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import cn.edu.ncepu.user.entity.UserEntity;

/**
 * 用户仓库类
 * @ClassName:：UserRepository 
 * @author ：yinzhiwen 
 * @date ：2018年5月25日 下午9:40:25
 */

public interface UserRepository extends JpaRepository<UserEntity,String>{

	/**
	 * 动态分页查询用户信息
	 * @Title：findAll 
	 * @param spec
	 * @param pageable
	 * @return 
	 * @return ：Page<UserEntity> 
	 * @throws
	 */
	Page<UserEntity> findAll(Specification<UserEntity> spec, Pageable pageable);
	
	/**
	 * 按用户姓名分页查找用户信息
	 * @Title：findByUsernameLike 
	 * @param name
	 * @return 
	 * @return ：Page<UserEntity> 
	 * @throws
	 */
	//Page<UserEntity> findByUsernameLike(String name);
	
	/**
	 * 按照账号状态查找用户信息
	 * @Title：findByAccountState 
	 * @param accountState
	 * @return 
	 * @return ：List<UserEntity> 
	 * @throws
	 */
	List<UserEntity> findByAccountState(int accountState);
	
	/**
	 * 修改用户密码
	 * @Title：changePwd 
	 * @param userId
	 * @param pwd 
	 * @return ：void 
	 * @throws
	 */
	@Modifying
	@Query("update UserEntity a set a.password = :pwd where a.id = :userId")
	void changePwd(@Param("userId") String userId, @Param("pwd") String pwd);
	
	/**
	 * 设置用户为禁用
	 * @Title：lockUser 
	 * @param userId 
	 * @return ：void 
	 * @throws
	 */
	@Modifying
	@Query("update UserEntity a set a.accountState = 0 where a.id = :userId")
	void lockUser(@Param("userId") String userId);
	
	/**
	 * 设置用户为可用
	 * @Title：unlockUser 
	 * @param userId 
	 * @return ：void 
	 * @throws
	 */
	@Modifying
	@Query("update UserEntity a set a.accountState = 1 where a.id = :userId")
	void unlockUser(@Param("userId") String userId);
	
	/**
	 * 按账号密码查询用户
	 * @Title：findByAccountAndPassword 
	 * @param account
	 * @param password
	 * @return 
	 * @return ：UserEntity 
	 * @throws
	 */
	UserEntity findByAccountAndPassword(String account,String password);
	
	/**
	 * 按用户id查询用户
	 * @Title：findById 
	 * @param userId
	 * @return 
	 * @return ：UserEntity 
	 * @throws
	 */
	UserEntity findById(String userId);
	
	/**
	 * 按用户名查询用户
	 * @Title：findByAccount 
	 * @param username
	 * @return 
	 * @return ：UserEntity 
	 * @throws
	 */
	UserEntity findByAccount(String username);
}
