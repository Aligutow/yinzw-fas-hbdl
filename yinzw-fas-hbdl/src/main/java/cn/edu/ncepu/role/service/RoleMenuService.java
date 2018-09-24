package cn.edu.ncepu.role.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.edu.ncepu.role.entity.RoleMenuEntity;
import cn.edu.ncepu.role.repository.RoleMenuRepository;

/**
 *角色菜单service类
 * @ClassName:：RoleMenuService 
 * @author ：yinzhiwen 
 * @date ：2018年6月12日 上午9:39:38
 */
@Service
public class RoleMenuService {

	@Autowired
	private RoleMenuRepository repository;
	
	public void init() {
//		RoleMenuEntity e1 = new RoleMenuEntity();
//		e1.setRoleId("4");
//		e1.setMenuId("3b1390bacb7c4cbcbca8fb2a493cd988");
//		repository.save(e1);
//		
//		RoleMenuEntity e2 = new RoleMenuEntity();
//		e2.setRoleId("4");
//		e2.setMenuId("43000ac6e5364a759477188b622f0bfe");
//		repository.save(e2);
//		
//		RoleMenuEntity e3 = new RoleMenuEntity();
//		e3.setRoleId("4");
//		e3.setMenuId("d7804d07e26a4f49a3a51b07182f50e0");
//		repository.save(e3);
//		
//		RoleMenuEntity e4 = new RoleMenuEntity();
//		e4.setRoleId("4");
//		e4.setMenuId("b75f2c23fd994804b4dd3a4f3944ded2");
//		repository.save(e4);
//		
//		RoleMenuEntity e5 = new RoleMenuEntity();
//		e5.setRoleId("4");
//		e5.setMenuId("c6c1dcc94be24dec88dbc1de919a4779");
//		repository.save(e5);
//		
//		RoleMenuEntity e6 = new RoleMenuEntity();
//		e6.setRoleId("4");
//		e6.setMenuId("7974a3ea3fa5432fab111dd344adab63");
//		repository.save(e6);
//		
		RoleMenuEntity e7 = new RoleMenuEntity();
		e7.setRoleId("5");
		e7.setMenuId("dd7be6bba5964ee8b3bd14078912d43b");
		repository.save(e7);
		
		RoleMenuEntity e8 = new RoleMenuEntity();
		e8.setRoleId("5");
		e8.setMenuId("4235f8f038bd46f6b71394f9dd7ae48f");
		repository.save(e8);
		
		RoleMenuEntity e9 = new RoleMenuEntity();
		e9.setRoleId("5");
		e9.setMenuId("72e86bc0e4cd41b8addc54598c1938cd");
		repository.save(e9);
		
		RoleMenuEntity e10 = new RoleMenuEntity();
		e10.setRoleId("5");
		e10.setMenuId("d96a6e3e662f4348a8f89a00d1bebdf1");
		repository.save(e10);
		
		RoleMenuEntity e11 = new RoleMenuEntity();
		e11.setRoleId("5");
		e11.setMenuId("9e1edf8ecf644efba5558f02c773fcc0");
		repository.save(e11);
//		RoleMenuEntity e12 = new RoleMenuEntity();
//		e12.setRoleId("2");
//		e12.setMenuId("d96a6e3e662f4348a8f89a00d1bebdf1");
//		repository.save(e12);
//		RoleMenuEntity e13 = new RoleMenuEntity();
//		e13.setRoleId("3");
//		e13.setMenuId("9e1edf8ecf644efba5558f02c773fcc0");
//		repository.save(e13);
//		RoleMenuEntity e14 = new RoleMenuEntity();
//		e14.setRoleId("4");
//		e14.setMenuId("9e1edf8ecf644efba5558f02c773fcc0");
//		repository.save(e14);
	}
}
