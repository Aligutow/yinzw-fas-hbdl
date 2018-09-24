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
 * 费用报销单实体类
 * @ClassName:：ReimEntity 
 * @author ：yinzhiwen 
 * @date ：2018年5月20日 上午10:48:26
 */
@Entity
@Table(name = "db_reim")
public class ReimEntity {
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
	 * 报销人
	 */
	private String applicant;
	/*
	 * 关联项目
	 */
	private String project;
	/*
	 * 费用明细
	 */
	@Lob
	private List<Fee> fees;
	/*
	 * 报销总金额
	 */
	private double sum;
	/*
	 * 报销单状态，0待审核，-1废弃，1已报销
	 */
	@Column(name = "reim_state")
	private String reimState;
	/*
	 * 报销金额
	 */
	@Column(name = "reim_money")
	private double reimMoney;
	/*
	 * 备注
	 */
	private String ps;
	
	public ReimEntity() {
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

	public String getProject() {
		return project;
	}

	public void setProject(String project) {
		this.project = project;
	}

	public List<Fee> getFees() {
		return fees;
	}

	public void setFees(List<Fee> fees) {
		this.fees = fees;
	}

	public double getSum() {
		return sum;
	}

	public void setSum(int sum) {
		this.sum = sum;
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
