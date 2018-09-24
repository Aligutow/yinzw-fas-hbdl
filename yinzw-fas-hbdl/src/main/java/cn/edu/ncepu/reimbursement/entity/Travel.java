package cn.edu.ncepu.reimbursement.entity;

import java.util.Date;

/**
 * 交通费用明细类
 * @ClassName:：Travel 
 * @author ：yinzhiwen 
 * @date ：2018年5月20日 下午12:29:41
 */
public class Travel {
	/*
	 * 出发日期
	 */
	private Date startDate;
	/*
	 * 出发地
	 */
	private String startPlace;
	/*
	 * 到达日期
	 */
	private Date arriveDate;
	/*
	 * 到达地
	 */
	private String arrivePlace;
	/*
	 * 交通工具
	 */
	private String vehicle;
	/*
	 * 车票照片路径
	 */
	private String ticketPhotoPath;
	/*
	 * 金额
	 */
	private double money;
	/*
	 * 发票说明
	 */
	private String invoiceDesc;
	public Travel() {
	}
	public Travel(Date startDate, String startPlace, Date arriveDate, String arrivePlace, String vehicle,
			String ticketPhotoPath, double money, String invoiceDesc) {
		super();
		this.startDate = startDate;
		this.startPlace = startPlace;
		this.arriveDate = arriveDate;
		this.arrivePlace = arrivePlace;
		this.vehicle = vehicle;
		this.ticketPhotoPath = ticketPhotoPath;
		this.money = money;
		this.invoiceDesc = invoiceDesc;
	}
	public Date getStartDate() {
		return startDate;
	}
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	public String getStartPlace() {
		return startPlace;
	}
	public void setStartPlace(String startPlace) {
		this.startPlace = startPlace;
	}
	public Date getArriveDate() {
		return arriveDate;
	}
	public void setArriveDate(Date arriveDate) {
		this.arriveDate = arriveDate;
	}
	public String getArrivePlace() {
		return arrivePlace;
	}
	public void setArrivePlace(String arrivePlace) {
		this.arrivePlace = arrivePlace;
	}
	public String getVehicle() {
		return vehicle;
	}
	public void setVehicle(String vehicle) {
		this.vehicle = vehicle;
	}
	public String getTicketPhotoPath() {
		return ticketPhotoPath;
	}
	public void setTicketPhotoPath(String ticketPhotoPath) {
		this.ticketPhotoPath = ticketPhotoPath;
	}
	public double getMoney() {
		return money;
	}
	public void setMoney(double money) {
		this.money = money;
	}
	public String getInvoiceDesc() {
		return invoiceDesc;
	}
	public void setInvoiceDesc(String invoiceDesc) {
		this.invoiceDesc = invoiceDesc;
	}
	
	
}
