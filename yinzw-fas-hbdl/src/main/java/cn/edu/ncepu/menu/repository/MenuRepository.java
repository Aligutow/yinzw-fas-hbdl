package cn.edu.ncepu.menu.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import cn.edu.ncepu.menu.entity.MenuEntity;

/**
 * 菜单仓库类
 * @ClassName:：MenuRepository 
 * @author ：yinzhiwen 
 * @date ：2018年6月11日 下午9:55:01
 */
public interface MenuRepository extends JpaRepository<MenuEntity,String>{

	/**
	 * 动态查询菜单信息
	 * @Title：findAll 
	 * @param spec
	 * @param pageable
	 * @return 
	 * @return ：Page<MenuEntity> 
	 * @throws
	 */
	Page<MenuEntity> findAll(Specification<MenuEntity> spec, Pageable pageable);
	
	/**
	 * 按照父id查询菜单信息
	 * @Title：findByParentIdOrderByShowOrderAsc 
	 * @param parentId
	 * @return 
	 * @return ：List<MenuEntity> 
	 * @throws
	 */
	List<MenuEntity> findByParentId(String parentId);
	
	/**
	 * 根据当前用户id查询菜单
	 * @Title：findUserMenus 
	 * @param userId
	 * @return 
	 * @return ：List<MenuEntity> 
	 * @throws
	 */
	@Query(value = "select m.*" + " from db_user u, db_role r, db_role_menu rm, db_menu m "//id menuId,m.parentId,m.menuName,m.href,m.icon,m.tip
			+ "where u.role_id = r.id " + "and r.id = rm.role_id "
			+ "and rm.menu_id = m.id " 
			+ "and u.account_state = 1 "
			+ "and u.id = :userId", nativeQuery = true)
	List<MenuEntity> findUserMenus(@Param("userId") String userId);
}
