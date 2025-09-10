package com.purva.test;

import java.util.List;
import java.util.Scanner;

import com.purva.daoimpl.OrderDaoImpl;
import com.purva.pojo.Order;

public class OrderTest {
	private static double totalbill;
	private static String date;
	private static int id;

	public static void main(String[] args) {
		int choice;
		String emailid;
		boolean flag;
		
		Order or=new Order();
		OrderDaoImpl od=new OrderDaoImpl();
	     try (Scanner sc = new Scanner(System.in)) {
			System.out.println("1.Place Order");
			 System.out.println("2.Show Order");
			 
			 System.out.println("Enter your choice : ");
			 choice=sc.nextInt();
			 
			 switch(choice)
			 {
			 case 1:
				 
				 System.out.println("Enter Customer EmailId : ");
				 emailid =sc.next();
				 
				 or.setCustEmailId(emailid);
				 flag=od.placeOrder(emailid);
				if(flag)
				{
					System.out.println("Order placed Successfully");
				}
				else
				{
					System.out.println("Order placed failed");
				}
				 
				 break;
				 
				 
			 case 2:
				 System.out.println("All orders");
					List<Order> l = od.showOrder();
					for(Order i : l)
					{
						System.out.println(i);
					} 
				 break;
				 
			 
			 }
		}

	}

	public static double getTotalbill() {
		return totalbill;
	}

	public static void setTotalbill(double totalbill) {
		OrderTest.totalbill = totalbill;
	}

	public static String getDate() {
		return date;
	}

	public static void setDate(String date) {
		OrderTest.date = date;
	}

	public static int getId() {
		return id;
	}

	public static void setId(int id) {
		OrderTest.id = id;
	}

}
