package com.purva.pojo;

public class Cart {
	
	private int cartId,garId,garQty;
	private String  custEmailId,garName;
	private double garPrice;
	public int getCartId() {
		return cartId;
	}
	public void setCartId(int cartId) {
		this.cartId = cartId;
	}
	public int getFoodId() {
		return garId;
	}
	public void setGarId(int garId) {
		this.garId = garId;
	}
	public int getGarQty() {
		return garQty;
	}
	public void setGarQty(int garQty) {
		this.garQty = garQty;
	}
	public String getCustEmailId() {
		return custEmailId;
	}
	public void setCustEmailId(String custEmailId) {
		this.custEmailId = custEmailId;
	}
	public String getGarName() {
		return garName;
	}
	public void setGarName(String garName) {
		this.garName = garName;
	}
	public double getGarPrice() {
		return garPrice;
	}
	public void setGarPrice(double garPrice) {
		this.garPrice = garPrice;
	}
	@Override
	public String toString() {
		return "Cart [cartId=" + cartId + ", garId=" + garId + ", garQty=" + garQty + ", custEmailId=" + custEmailId
				+ ", garName=" + garName + ", garPrice=" + garPrice + "]";
	}
	public boolean addtoCart(Cart ct) {
		// TODO Auto-generated method stub
		return false;
	}

}
