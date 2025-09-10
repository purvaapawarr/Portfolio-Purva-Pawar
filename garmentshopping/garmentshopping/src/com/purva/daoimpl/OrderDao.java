package com.purva.daoimpl;

import java.util.List;

import com.purva.pojo.Order;

public interface OrderDao {
	
	boolean placeOrder( String custEmailId);
	List<Order>showOrder();
	

}
