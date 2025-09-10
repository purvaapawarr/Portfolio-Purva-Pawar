package com.purva.daoimpl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.purva.pojo.Order;
import com.purva.utility.DBUtility;


public class OrderDaoImpl {
	
	Connection con = null;
	String query;
	PreparedStatement ps;
	ResultSet rs;
	int row;
	public boolean placeOrder(String custEmailId) 
	{
		double totalBill=0;
		String orderDate = new Date().toString();
		con = DBUtility.establishConnection();
		query = "select sum(g.garPrice * c.garQty) AS totalBill from garment AS f INNER JOIN cart AS c where g.garmentId = c.foodId and custEmailId = ?";
		try 
		{
			ps = con.prepareStatement(query);
			ps.setString(1,custEmailId);
			rs = ps.executeQuery();
			if(rs.next())
			{
				totalBill = rs.getDouble("totalBill");
			}	
			query = "insert into Orderrs(totalBill,custEmailId,orderDate) values (?,?,?)";
			ps = con.prepareStatement(query);
			ps.setDouble(1, totalBill);
			ps.setString(2,custEmailId);
			ps.setString(3,orderDate);
			row = ps.executeUpdate();
			if(row>0)
			{
				return true;
			}
			
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
		}
		return false;
	}

	public List<Order> showOrder() {
		
		

		List<Order> list = new ArrayList<Order>();
		con = DBUtility.establishConnection();
		query = "select * from Order_21828";
		try 
		{
			Order o = new Order();
			ps = con.prepareStatement(query);
			rs = ps.executeQuery();
			while(rs.next())
			{
				o.setOrderId(rs.getInt(1));
				o.setCustEmailId(rs.getString(2));
				o.setOrderDate(rs.getString(3));
				o.setTotalBill(rs.getDouble(4));
				list.add(o);
			}
			return list;
		
		} 
		catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return null;
	}

}
