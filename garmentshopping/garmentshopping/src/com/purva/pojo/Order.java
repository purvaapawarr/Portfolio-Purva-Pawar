package com.purva.pojo;

public class Order {
	
	private int orderId;
	private double totalBill;
	private String orderDate,custEmailId;
	public int getOrderId() {
		return orderId;
	}
	public void setOrderId(int orderId) {
		this.orderId = orderId;
	}
	public double getTotalBill() {
		return totalBill;
	}
	public void setTotalBill(double totalBill) {
		this.totalBill = totalBill;
	}
	public String getOrderDate() {
		return orderDate;
	}
	public void setOrderDate(String orderDate) {
		this.orderDate = orderDate;
	}
	public String getCustEmailId() {
		return custEmailId;
	}
	public void setCustEmailId(String custEmailId) {
		this.custEmailId = custEmailId;
	}
	@Override
	public String toString() {
		return "Order [orderId=" + orderId + ", totalBill=" + totalBill + ", orderDate=" + orderDate + ", custEmailId="
				+ custEmailId + "]";
	}

}
