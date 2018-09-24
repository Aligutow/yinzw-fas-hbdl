package cn.edu.ncepu.register.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.edu.ncepu.register.repository.RegisterRepository;
import cn.edu.ncepu.user.entity.UserEntity;

/**
 * 注册service
 * @ClassName:：RegisterService 
 * @author ：yinzhiwen 
 * @date ：2018年5月27日 下午10:39:56
 */
@Service
public class RegisterService {
	@Autowired
	private RegisterRepository repository;
	
	
	
	public boolean exist(String account) {
		UserEntity user = new UserEntity();
		user = repository.findByAccount(account);
		if(user == null)
			return false;
		else
			return true;
	}
}
