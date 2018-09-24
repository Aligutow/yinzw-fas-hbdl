package cn.edu.ncepu.sso.repository;

import org.springframework.data.repository.CrudRepository;

import cn.edu.ncepu.sso.entity.TokenEntity;
/**
 * Token仓库类
 * @ClassName:：TokenRepository 
 * @author ：yinzhiwen 
 * @date ：2018年6月9日 下午12:59:40
 */
public interface TokenRepository extends CrudRepository<TokenEntity, String> {

}
