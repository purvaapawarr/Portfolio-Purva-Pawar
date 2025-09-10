package com.purva.test;

import java.util.List;
import java.util.Scanner;

import com.purva.daoimpl.CartDaoImpl;
import com.purva.pojo.Cart;

public class CartTest {
	public static void main(String[] args) {
		int cartid,gQty,choice,garId;
		String emailId;
		boolean flag;
		Cart ct=new Cart();
		CartDaoImpl cd=new CartDaoImpl();
		
		try (Scanner sc = new Scanner(System.in)) {
			System.out.println("Enter Your Choice : ");
			System.out.println("1.Add in Cart : ");
			System.out.println("2.Show Cart : ");
			System.out.println("3.Delete Cart Details : ");
			
			choice=sc.nextInt();
			
			switch(choice)
			{
			case 1:
				System.out.println("Enter Garment Id : ");
				garId=sc.nextInt();
				
				System.out.println("Enter Customer Email Id : ");
				emailId=sc.next();
				
				System.out.println("Enter garment Quantity : ");
				gQty=sc.nextInt();
				
				ct.setCartId(garId);
				ct.setCustEmailId(emailId);
				ct.setGarQty(gQty);
				
				flag=ct.addtoCart(ct);
				if(flag==true)

				{
					System.out.println("Add in cart Successfully");
				}
				else
				{
					System.out.println("Add failed");
				}
				
				break;
			
			case 2:
				System.out.println("Enter customer Email Id : ");
				emailId=sc.next();
				ct.setCustEmailId(emailId);
				List<Cart> ct1=cd.showCart(emailId);
			   for(Cart c: ct1)
			   {
				   System.out.println("Garment Name : "+c.getGarName());
				   System.out.println("Garment Price : " +c.getGarPrice()); 
				   System.out.println("Garment Quantity : " +c.getGarQty());
			   }
				break;
				
				
			case 3:
				System.out.println("Enter Cart Id to delete cart Details: ");
				cartid=sc.nextInt();
				
				ct.setCartId(cartid);
				flag=cd.deleteCart(cartid);			
				if(flag==true)
				{
					System.out.println("Delete Cart Details Successfully");
				}
				else
				{
					System.out.println("Not Deleted");
				}
				
			}
		}
		
		
	}


}
