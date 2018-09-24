package cn.edu.ncepu.common.utils;

import java.util.UUID;

/**
 * uuid 工具类
 * @ClassName:：UuidUtils 
 * @author ：yinzhiwen 
 * @date ：2018年5月25日 下午1:46:56
 */
public class UuidUtils {

	 public static String id()
	  {
	    String uuid = UUID.randomUUID().toString();
	    return uuid.replaceAll("-", "");
	  }
}
