package com.purva.daoimpl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.purva.pojo.Cart;
import com.purva.utility.DBUtility;



public class CartDaoImpl {
	
	Connection con;
	String query;
    PreparedStatement ps;
    int row;
    ResultSet rs;
	//@Override
	public boolean addtoCart(Cart ct) {
		con=DBUtility.establishConnection();
		query="insert into Cart(garId,CustemailId, garQty) values (?,?,?)";
		try
		{
			ps=con.prepareStatement(query);
			ps.setInt(1, ct.getCartId());
			ps.setString(2, ct.getCustEmailId());
			ps.setInt(3,ct.getGarQty());
			
			row=ps.executeUpdate();
			if(row>0)
			{
				return true;
			}
			
		}
		catch (Exception e) {
			System.out.println(e);
		e.printStackTrace();
		}
		
		return false;
	}
	
	
	//@Override
	public List<Cart> showCart(String emailId) {
		con=DBUtility.establishConnection();
		
		query = "select g.garName,g.garPrice,c.garQty from Food_21828 AS f INNER "
				+ "JOIN Cart_21828 AS c where f.foodId = c.foodId and c.custEmailID = ?";
		List<Cart> cartList = new ArrayList<Cart>();
		try 
		{
			ps= con.prepareStatement(query);
			
			ps.setString(1,emailId);
			rs = ps.executeQuery();
			while(rs.next())
			{
				Cart ct = new Cart();
				ct.setGarName(rs.getString("garName"));
				ct.setGarPrice(rs.getInt("garPrice"));
				ct.setGarQty(rs.getInt("garQty"));
				
				cartList.add(ct);
			}
			return cartList;
		
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
		}
		return null;
	}


	//@Override
	public boolean deleteCart(int cartId) {
		con=DBUtility.establishConnection();
		query="Delete From Cart_21828 where cartId=?";
try {
	ps=con.prepareStatement(query);
	ps.setInt(1,cartId);
	row=ps.executeUpdate();
	if(row>0)
	{
		return true;
	}
} 

catch (SQLException e) {
	
	e.printStackTrace();
}		
		return false;
	}


}
