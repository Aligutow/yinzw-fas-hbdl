package cn.edu.ncepu.common.classes;
/**
 * 用于controller方法的返回结果，含操作是否成功的信息
 * @ClassName:：ResultState 
 * @author ：yinzhiwen 
 * @date ：2018年5月23日 上午9:52:56
 */
public class ResultState {

	private String status;
	
	private String errorMsg;

	public ResultState() {
		
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}
	
	
}
