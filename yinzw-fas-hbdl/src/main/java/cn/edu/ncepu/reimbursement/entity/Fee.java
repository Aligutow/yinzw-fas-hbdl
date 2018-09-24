package cn.edu.ncepu.reimbursement.entity;
/**
 * 费用明细类
 * @ClassName:：Fee 
 * @author ：yinzhiwen 
 * @date ：2018年5月20日 下午12:11:49
 */
public class Fee {
	/*
	 * 发票名称
	 */
	private String invoiceName;
	/*
	 * 事项说明
	 */
	private String description;
	/*
	 * 金额
	 */
	private double money;
	/*
	 * 发票照片路径
	 */
	private String invoicePhotoPath;
	
	public Fee() {
	}

	public Fee(String invoiceName, String description, int money, String invoicePhotoPath) {
		super();
		this.invoiceName = invoiceName;
		this.description = description;
		this.money = money;
		this.invoicePhotoPath = invoicePhotoPath;
	}

	public String getInvoiceName() {
		return invoiceName;
	}

	public void setInvoiceName(String invoiceName) {
		this.invoiceName = invoiceName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public double getMoney() {
		return money;
	}

	public void setMoney(int money) {
		this.money = money;
	}

	public String getInvoicePhotoPath() {
		return invoicePhotoPath;
	}

	public void setInvoicePhotoPath(String invoicePhotoPath) {
		this.invoicePhotoPath = invoicePhotoPath;
	}
	
	
}
