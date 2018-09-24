package cn.edu.ncepu.login.dto;

import java.io.Serializable;

/**
 * 数据项名称和数据
 * @ClassName:：Pair 
 * @author ：yinzhiwen 
 * @date ：2018年9月6日 下午11:18:59
 */
public class Pair implements Serializable{

	/** 
	 * @Fields serialVersionUID ：
	 */ 
	private static final long serialVersionUID = 1L;

	private String name;
	
	private String value;

	public Pair() {
		super();
		// TODO Auto-generated constructor stub
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
	
	
	
	
}
