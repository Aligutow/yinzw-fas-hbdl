package cn.edu.ncepu.reimbursement.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

/**
 * 差旅费报销单实体类
 * @ClassName:：TravelReimEntity 
 * @author ：yinzhiwen 
 * @date ：2018年5月20日 下午12:55:43
 */
@Entity
@Table(name = "db_reim_travel")
public class TravelReimEntity {
	/*
	 * 主键，id,生成策略为uuid
	 */
	@Id
	@GenericGenerator(name="idGenerator", strategy="uuid")
	@GeneratedValue(generator="idGenerator")
	@Column(name = "id")
	private String id;
	/*
	 * 部门
	 */
	private String org;
	/*
	 * 报销日期
	 */
	@Column(name = "reim_date")
	private Date reimDate;
	/*
	 * 出差人
	 */
	private String applicant;
	/*
	 * 出差事由
	 */
	private String reason;
	/*
	 * 关联项目
	 */
	private String project;
	/*
	 * 交通费用明细
	 */
	@Lob
	private List<Travel> travels;
	/*
	 * 交通费合计
	 */
	@Column(name = "travel_fee")
	private double travelFee;
	/*
	 * 其它费用明细
	 */
	@Lob
	private List<TravelFee> others;
	/*
	 * 其它费用合计
	 */
	@Column(name = "other_fee")
	private double otherFee;
	/*
	 * 预报销差旅费单金额
	 */
	@Column(name = "reim_money_will")
	private double reimMoneyWill;
	/*
	 * 报销单状态,0已填单待审核，-1废弃，1已报销
	 */
	@Column(name = "reim_state")
	private String reimState;
	/*
	 * 最终报销金额
	 */
	@Column(name = "reim_money")
	private double reimMoney; 
	/*
	 * 备注
	 */
	private String ps;
	public TravelReimEntity() {
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getOrg() {
		return org;
	}
	public void setOrg(String org) {
		this.org = org;
	}
	public Date getReimDate() {
		return reimDate;
	}
	public void setReimDate(Date reimDate) {
		this.reimDate = reimDate;
	}
	public String getApplicant() {
		return applicant;
	}
	public void setApplicant(String applicant) {
		this.applicant = applicant;
	}
	public String getReason() {
		return reason;
	}
	public void setReason(String reason) {
		this.reason = reason;
	}
	public String getProject() {
		return project;
	}
	public void setProject(String project) {
		this.project = project;
	}
	public List<Travel> getTravels() {
		return travels;
	}
	public void setTravels(List<Travel> travels) {
		this.travels = travels;
	}
	public double getTravelFee() {
		return travelFee;
	}
	public void setTravelFee(double travelFee) {
		this.travelFee = travelFee;
	}
	public List<TravelFee> getOthers() {
		return others;
	}
	public void setOthers(List<TravelFee> others) {
		this.others = others;
	}
	public double getOtherFee() {
		return otherFee;
	}
	public void setOtherFee(double otherFee) {
		this.otherFee = otherFee;
	}
	public double getReimMoneyWill() {
		return reimMoneyWill;
	}
	public void setReimMoneyWill(double reimMoneyWill) {
		this.reimMoneyWill = reimMoneyWill;
	}
	public String getReimState() {
		return reimState;
	}
	public void setReimState(String reimState) {
		this.reimState = reimState;
	}
	public double getReimMoney() {
		return reimMoney;
	}
	public void setReimMoney(double reimMoney) {
		this.reimMoney = reimMoney;
	}
	public String getPs() {
		return ps;
	}
	public void setPs(String ps) {
		this.ps = ps;
	}
	
	
	
	
}
