package com.purva.daoimpl;

import java.util.List;

import com.purva.pojo.Cart;

public interface CartDao {
	
	boolean addtoCart(Cart ct);
	List<Cart>showCart(String emailId);
	boolean deleteCart(int cartId);


}
