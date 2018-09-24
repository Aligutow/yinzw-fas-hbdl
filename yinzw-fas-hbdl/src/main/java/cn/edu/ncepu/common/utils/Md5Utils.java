package cn.edu.ncepu.common.utils;

import java.security.MessageDigest;

/**
 * 
 * @ClassName:：Md5Utils 
 * @author ：yinzhiwen 
 * @date ：2018年5月27日 下午10:04:02
 */
public class Md5Utils {
	
	private final static char hexChars[] = { // 用来将字节转换成 16 进制表示的字符
			'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e',
					'f' };
	/**
	 * md5加密
	 * @Title：MD5 
	 * @param ：str  要加密的字符串
	 * @return ：String  加密好的字符串
	 * @throws
	 */
	public final static String MD5(String str) {

		try {
			byte[] strTemp = str.getBytes();
			MessageDigest mdTemp = MessageDigest.getInstance("MD5");
			mdTemp.update(strTemp);
			byte tmp[] = mdTemp.digest(); // MD5 的计算结果是一个 128 位的长整数，
			// 用字节表示就是 16 个字节
			char strs[] = new char[16 * 2]; // 每个字节用 16 进制表示的话，使用两个字符，
			// 所以表示成 16 进制需要 32 个字符
			int k = 0; // 表示转换结果中对应的字符位置
			for (int i = 0; i < 16; i++) { // 从第一个字节开始，对 MD5 的每一个字节
				// 转换成 16 进制字符的转换
				byte byte0 = tmp[i]; // 取第 i 个字节
				strs[k++] = hexChars[byte0 >>> 4 & 0xf]; // 取字节中高 4 位的数字转换,
				// >>> 为逻辑右移，将符号位一起右移
				strs[k++] = hexChars[byte0 & 0xf]; // 取字节中低 4 位的数字转换
			}
			return new String(strs).toUpperCase(); // 换后的结果转换为字符串
		} catch (Exception e) {
			return null;
		}
	}
	
}
