package com.purva.daoimpl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.purva.pojo.Garment;
import com.purva.utility.DBUtility;


public class GarDaoImpl {
	
	Connection con=null;
	PreparedStatement ps=null;
	int rows;
	String query;


		public boolean addGar(Garment g) {
			con= DBUtility.establishConnection();
			query="insert into Garment(garName, garType,garPrice)values(?,?,?)";
			try 
			{
				ps= con.prepareStatement(query);

				ps.setString(1, g.getGarName());
				ps.setString(2, g.getGarType());
				ps.setInt(3,  g.getGarPrice());
				
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

		
		
		public boolean updateGar(Garment g) {
			con=DBUtility.establishConnection();
			query="Update Garment set garName=?, garType=?, garPrice=? where garId=?";
			
			
			try {
				ps=con.prepareStatement(query);
				
				ps.setString(1, g.getGarName());
				ps.setString(2, g.getGarType());
				ps.setDouble(3, g.getGarPrice());
				
				ps.setInt(4, g.getGarId());
				
				rows=ps.executeUpdate();
				if(rows>0) {
					return true;
				}
			}
			catch(SQLException e) {
				System.out.println(e);
				e.printStackTrace();
			}
			return false;
		}

		
		

		public boolean deleteGar(int garId) {
			con=DBUtility.establishConnection();
			query="Delete From Garment where garId=?";
			
			try {
				ps=con.prepareStatement(query);
				
				ps.setInt(1,garId);
			
			rows=ps.executeUpdate();
			if(rows>0) {
				return true;
			}
		}
			catch(SQLException e)
			{
				System.out.println(e);
				e.printStackTrace();
			}
			return false;
		}

		

		

		public Garment displayGarId(int garId) {
			ResultSet rs=null;
			con=DBUtility.establishConnection();
			query="Select * from Garment where garId=?";
			
			try
			{
				ps=con.prepareStatement(query);
				ps.setInt(1, garId);
				
				rs=ps.executeQuery();
				
			while(rs.next())
			{
				Garment gd=new Garment();
				gd.setGarId(rs.getInt(1));
				gd.setGarName(rs.getString(2));
				gd.setGarType(rs.getString(3));
				gd.setGarPrice(rs.getInt(4));

			return gd;
		}
			}
			catch(SQLException e)
			{
				System.out.println(e);
				e.printStackTrace();
			}
			return null;
		}
			
		
		public List<Garment> displayAllGar() {
			con=DBUtility.establishConnection();
			query="Select * from Garment";
			List<Garment> garList = new ArrayList<Garment>();
			try
			{
				ps=con.prepareStatement(query);
				ResultSet rs=ps.executeQuery();
				
				while(rs.next()) {
					Garment gda=new Garment();
					gda.setGarId(rs.getInt(1));
					gda.setGarName(rs.getString(2));
					gda.setGarType(rs.getString(3));
					gda.setGarPrice(rs.getInt(4));
					garList.add(gda);
				}
				
			
			return garList;
		}


		catch(SQLException e)
		{
			System.out.println(e);
			e.printStackTrace();
		}
		return null;
	}

}
