package com.purva.daoimpl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.purva.pojo.Customer;
import com.purva.utility.DBUtility;



public class CustomerDaoImpl {
	Connection con=null;
	PreparedStatement ps=null;
	int rows;
	String query;
	
	public boolean addCustomer(Customer g) {
		con= DBUtility.establishConnection();
		query="insert into Customer_21828(custName, custAddr, custCont,custEmailId, custPassword) "
				+ "values(?,?,?,?,?)";
		
		try {
			
		ps=con.prepareStatement(query);
		ps.setString(1, g.getCustName());
		ps.setString(2, g.getCustAddr());
		ps.setInt(3, g.getCustCont());
		ps.setString(4, g.getCustEmailId());
		ps.setString(5, g.getPassword());
		
		rows=ps.executeUpdate();
		if(rows>0) 
		{
			return true;
		}
	}
	catch (SQLException e)
	{
		System.out.println(e);
		e.printStackTrace();
	}
		return false;
	}


	public boolean updateCustomer(Customer g) {
		
		con= DBUtility.establishConnection();
		query="Update Customer_21828 set custName=?, custAddr=?, custCont=?,custEmailId=?, custPassword=? where custId=?";
		
		try {
			
		ps=con.prepareStatement(query);
		ps.setString(1, g.getCustName());
		ps.setString(2, g.getCustAddr());
		ps.setInt(3, g.getCustCont());
		ps.setString(4, g.getCustEmailId());
		ps.setString(5, g.getPassword());
		ps.setInt(6, g.getCustId());
		
		rows=ps.executeUpdate();
		if(rows>0) 
		{
			return true;
		}
	}
	catch (SQLException e)
	{
		System.out.println(e);
		e.printStackTrace();
	}
		return false;
		}

	
	
	
	
	public boolean deleteCustomer(int CustId) {
		con=DBUtility.establishConnection();
		query="Delete From Customer_21828 where custId=?";
		
		try {
			ps=con.prepareStatement(query);
		ps.setInt(1,CustId);
		
		rows=ps.executeUpdate();
		if(rows>0)
		{
			return true;
		}
		}
		catch(SQLException e)
		{
			e.printStackTrace();
		}
		return false;
	}

	
	
	
	
	
	public Customer displayCustId(int CustId) {
		
		ResultSet rs=null;
		con=DBUtility.establishConnection();
		query="Select * from Customer_21828 where custId=?";
		
		try
		{
			ps=con.prepareStatement(query);
			ps.setInt(1,CustId);
			
			rs=ps.executeQuery();
			
		while(rs.next())
		{
			Customer ct=new Customer();
			ct.setCustId(rs.getInt(1));
			ct.setCustName(rs.getString(2));
			ct.setCustAddr(rs.getString(3));
			ct.setCustCont(rs.getInt(4));
			ct.setCustEmailId(rs.getString(5));
			ct.setPassword(rs.getString(6));

		return ct;
	}
		}
		catch(SQLException e)
		{
			System.out.println(e);
			e.printStackTrace();
		}
		return null;
	}

	public List<Customer> displayAllCustomer() 
	{
		con=DBUtility.establishConnection();
		query="Select * from Customer_21828";
		List<Customer> CustomerList = new ArrayList<Customer>();
		try
		{
			ps=con.prepareStatement(query);
			ResultSet rs=ps.executeQuery();
			
			while(rs.next()) {
				Customer co=new Customer();
				co.setCustId(rs.getInt(1));
				co.setCustName(rs.getString(2));
				co.setCustAddr(rs.getString(3));
				co.setCustCont(rs.getInt(4));
				co.setCustEmailId(rs.getString(5));
				co.setPassword(rs.getString(6));
				CustomerList.add(co);
			}
			
		
		return CustomerList;
	}


	catch(SQLException e)
	{
		System.out.println(e);
		e.printStackTrace();
	}
		return null;
	}

}
