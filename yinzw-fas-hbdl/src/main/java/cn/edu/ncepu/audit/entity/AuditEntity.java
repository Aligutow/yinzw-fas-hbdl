package cn.edu.ncepu.audit.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

/**
 * 审核记录实体类
 * @ClassName:：AuditEntity 
 * @author ：yinzhiwen 
 * @date ：2018年5月20日 上午10:28:01
 */
@Entity
@Table(name = "db_audit")
public class AuditEntity {
	/*
	 * 主键，id,生成策略为uuid
	 */
	@Id
//	@GenericGenerator(name="idGenerator", strategy="uuid")
//	@GeneratedValue(generator="idGenerator")
	@Column(name = "id")
	private String id;
	/*
	 * 报销单id
	 */
	@Column(name = "reim_id")
	private String reimId;
	/*
	 * 审批账号
	 */
	@Column(name = "audit_account")
	private String auditAccount;
	/*
	 * 审批人
	 */
	@Column(name = "audit_person")
	private String auditPerson;
	
	/*
	 * 审批时间
	 */
	@Column(name = "audit_date")
	private Date auditDate;
	/*
	 * 审批意见
	 */
	private String opinion;
	
	public AuditEntity() {

	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getReimId() {
		return reimId;
	}

	public void setReimId(String reimId) {
		this.reimId = reimId;
	}

	public String getAuditAccount() {
		return auditAccount;
	}

	public void setAuditAccount(String auditAccount) {
		this.auditAccount = auditAccount;
	}

	public String getAuditPerson() {
		return auditPerson;
	}

	public void setAuditPerson(String auditPerson) {
		this.auditPerson = auditPerson;
	}

	public Date getAuditDate() {
		return auditDate;
	}

	public void setAuditDate(Date auditDate) {
		this.auditDate = auditDate;
	}

	public String getOpinion() {
		return opinion;
	}

	public void setOpinion(String opinion) {
		this.opinion = opinion;
	}
	
	
	
	
}
