package cn.edu.ncepu.sso.service;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.edu.ncepu.sso.entity.TokenEntity;
import cn.edu.ncepu.sso.repository.TokenRepository;
/**
 * Token Service类
 * @ClassName:：TokenService 
 * @author ：yinzhiwen 
 * @date ：2018年6月9日 下午1:01:46
 */
@Service
@Transactional
public class TokenService {
	@Autowired
	private TokenRepository tokenRepository;
	/**
	 * 将token对象保存至Reids缓存库中
	 * @Title：saveToken 
	 * @param ：@param entity 
	 * @return ：void 
	 * @throws
	 */
	public void saveToken(TokenEntity entity){
		tokenRepository.save(entity);
	}
	
	
	
	
	/**
	 * 根据令牌读取Reids库中token对象
	 * @Title：getToken 
	 * @param ：@param token
	 * @param ：@return 
	 * @return ：TokenEntity 
	 * @throws
	 */
	public TokenEntity getToken(String token){
		TokenEntity tokenRecord = tokenRepository.findOne(token);
		return tokenRecord;
	}
	
	/**
	 * 将token对象从Reids缓存库中删除
	 * @Title：delTocken 
	 * @param ：@param entity 
	 * @return ：void 
	 * @throws
	 */
	public void delTocken(TokenEntity entity){
		tokenRepository.delete(entity);
	}
	
}
