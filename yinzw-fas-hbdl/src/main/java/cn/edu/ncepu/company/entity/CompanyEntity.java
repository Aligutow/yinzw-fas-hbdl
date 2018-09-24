package cn.edu.ncepu.company.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Pattern;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.validator.constraints.NotBlank;
/**
 * 公司实体类
 * @ClassName:：CompanyEntity 
 * @author ：yinzhiwen 
 * @date ：2018年5月19日 下午1:26:56
 */
@Entity
@Table(name = "db_company")
public class CompanyEntity {
	/*
	 * 主键，id,生成策略为uuid
	 */
	@Id
//	@GenericGenerator(name="idGenerator", strategy="uuid")
//	@GeneratedValue(generator="idGenerator")
	@Column(name = "id")
	private String id;
	/*
	 * 公司名称
	 */
	//@NotBlank
	private String name;
	
	/*
	 * 负责人
	 */
	//@NotBlank
	private String leader;
	
	/*
	 * 联系电话
	 */
	//@Pattern(regexp="[0-9]+")
	private String phone;
	
	/*
	 * 邮编
	 */
	//@Pattern(regexp="[0-9]{6}")
	private String postcode;
	/*
	 * 办公地址
	 */
	//@NotBlank
	private String oa;
	/*
	 * 纳税人识别号
	 */
	//@Pattern(regexp="[0-9]+")
	private String tin;
	/*
	 * 开户行
	 */
	//@NotBlank
	private String bank;
	/*
	 * 银行地址
	 */
	//@NotBlank
	@Column(name = "bank_address")
	private String bankAddress;
	/*
	 * 是否是一般纳税人，是或者否，可选
	 */
	@Column(name = "is_general_taxpayer")
	private String isGeneralTaxpayer;
	/*
	 * 备注
	 */
	private String ps;
	
	public CompanyEntity() {
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLeader() {
		return leader;
	}

	public void setLeader(String leader) {
		this.leader = leader;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getPostcode() {
		return postcode;
	}

	public void setPostcode(String postcode) {
		this.postcode = postcode;
	}

	public String getOa() {
		return oa;
	}

	public void setOa(String oa) {
		this.oa = oa;
	}

	public String getTin() {
		return tin;
	}

	public void setTin(String tin) {
		this.tin = tin;
	}

	public String getBank() {
		return bank;
	}

	public void setBank(String bank) {
		this.bank = bank;
	}

	public String getBankAddress() {
		return bankAddress;
	}

	public void setBankAddress(String bankAddress) {
		this.bankAddress = bankAddress;
	}

	public String getIsGeneralTaxpayer() {
		return isGeneralTaxpayer;
	}

	public void setIsGeneralTaxpayer(String isGeneralTaxpayer) {
		this.isGeneralTaxpayer = isGeneralTaxpayer;
	}

	public String getPs() {
		return ps;
	}

	public void setPs(String ps) {
		this.ps = ps;
	}
	
	
	
}
