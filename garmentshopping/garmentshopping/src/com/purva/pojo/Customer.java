package com.purva.pojo;

public class Customer {
	
	private	int custId;
	private	String custName;
	private	String custAddr;
	private	int custCont;
	private	String custEmailId;
	private	String Password;
	public int getCustId() {
		return custId;
	}
	public void setCustId(int custId) {
		this.custId = custId;
	}
	public String getCustName() {
		return custName;
	}
	public void setCustName(String custName) {
		this.custName = custName;
	}
	public String getCustAddr() {
		return custAddr;
	}
	public void setCustAddr(String custAddr) {
		this.custAddr = custAddr;
	}
	public int getCustCont() {
		return custCont;
	}
	public void setCustCont(int custCont) {
		this.custCont = custCont;
	}
	public String getCustEmailId() {
		return custEmailId;
	}
	public void setCustEmailId(String custEmailId) {
		this.custEmailId = custEmailId;
	}
	public String getPassword() {
		return Password;
	}
	public void setPassword(String password) {
		Password = password;
	}
	@Override
	public String toString() {
		return "Customer [custId=" + custId + ", custName=" + custName + ", custAddr=" + custAddr + ", custCont=" + custCont
				+ ", custEmailId=" + custEmailId + ", Password=" + Password + "]";
	}

		
		
		


}
