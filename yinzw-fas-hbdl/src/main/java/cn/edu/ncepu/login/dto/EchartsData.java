package cn.edu.ncepu.login.dto;

import java.io.Serializable;
import java.util.List;

public class EchartsData implements Serializable{

	/** 
	 * @Fields serialVersionUID ：
	 */ 
	private static final long serialVersionUID = 1L;

	private List<String> names;
	
	private List<String> values;
	
	private List<Pair> pairs;

	public EchartsData() {
		super();
		// TODO Auto-generated constructor stub
	}

	public List<String> getNames() {
		return names;
	}

	public void setNames(List<String> names) {
		this.names = names;
	}

	public List<String> getValues() {
		return values;
	}

	public void setValues(List<String> values) {
		this.values = values;
	}

	public List<Pair> getPairs() {
		return pairs;
	}

	public void setPairs(List<Pair> pairs) {
		this.pairs = pairs;
	}
	
	
}
