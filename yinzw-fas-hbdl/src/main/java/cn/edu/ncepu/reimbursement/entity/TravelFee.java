package cn.edu.ncepu.reimbursement.entity;
/**
 * 差旅其它费用明细类
 * @ClassName:：TravelFee 
 * @author ：yinzhiwen 
 * @date ：2018年5月20日 下午12:48:13
 */
public class TravelFee {
	/*
	 * 项目大类
	 */
	private String sort;
	/*
	 * 发票照片
	 */
	private String[] invoicePhotoPaths;
	/*
	 * 金额
	 */
	private double money;
	/*
	 * 说明
	 */
	private String description;
	public TravelFee() {
	}
	public TravelFee(String sort, String[] invoicePhotoPaths, double money, String description) {
		super();
		this.sort = sort;
		this.invoicePhotoPaths = invoicePhotoPaths;
		this.money = money;
		this.description = description;
	}
	public String getSort() {
		return sort;
	}
	public void setSort(String sort) {
		this.sort = sort;
	}
	public String[] getInvoicePhotoPaths() {
		return invoicePhotoPaths;
	}
	public void setInvoicePhotoPaths(String[] invoicePhotoPaths) {
		this.invoicePhotoPaths = invoicePhotoPaths;
	}
	public double getMoney() {
		return money;
	}
	public void setMoney(double money) {
		this.money = money;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	
}
