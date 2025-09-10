package com.purva.pojo;

public class Garment {
	
	private	int garId;
	private String garName;
	private String garType;
	private int garPrice;
	public int getGarId() {
		return garId;
	}
	public void setGarId(int garId) {
		this.garId = garId;
	}
	public String getGarName() {
		return garName;
	}
	public void setGarName(String garName) {
		this.garName = garName;
	}
	public String getGarType() {
		return garType;
	}
	public void setGarType(String garType) {
		this.garType = garType;
	}
	public int getGarPrice() {
		return garPrice;
	}
	public void setGarPrice(int garPrice) {
		this.garPrice = garPrice;
	}
	@Override
	public String toString() {
		return "Garment [garId=" + garId + ", garName=" + garName + ", garType=" + garType + ", garPrice=" + garPrice
				+ "]";
	}
	


}
