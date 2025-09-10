package com.purva.test;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import com.purva.daoimpl.CustomerDaoImpl;
import com.purva.pojo.Customer;

public class CustomerTest {
	public static void main(String[] args) {
		int id,cont,choice;
		String  name,address,email,password;
		boolean flag;
		
		Customer c=new Customer();
		CustomerDaoImpl cd=new CustomerDaoImpl();
		System.out.println("********WELCOME TO GARMENT SHOPPIEEEE*******");
		
		
		Scanner sc=new Scanner(System.in);
		
		System.out.println("1. ADD CUSTOMER DETAILS : ");
		System.out.println("2. UPDATE CUSTOMER DETAILS : ");
		System.out.println("3. DELETE  ANY CUSTOMER DETAILS ");
		System.out.println("4. DISPLAY CUSTOMER ID");
		System.out.println("5. DISPLAY ALL CUSTOMER DETAILS");

		System.out.println("Enter Your choice : ");
		choice=sc.nextInt();
		
	switch(choice)
	{
	case 1:
		System.out.println("Enter Customer Name : ");
		name=sc.next();
		
		System.out.println("Enter Customer Address : ");
		address=sc.next();
		
		System.out.println("Enter Customer Contact : ");
		cont=sc.nextInt();
		
		System.out.println("Enter Customer Email Id : ");
		email=sc.next();
		
		System.out.println("Enter Customer Password : ");
		password = sc.next();
		
		c.setCustName(name);
		c.setCustAddr(address);
		c.setCustCont(cont);
		c.setCustEmailId(email);
		c.setPassword(password);
		
		flag=cd.addCustomer(c);
		
		if(flag==true)
		{
			System.out.println("Add Customer Details Successfully");
		}
		else
		{
			System.out.println("Adding failed");
		}
				
		break;
		
		
	case 2:
		System.out.println("Enter Customer Id : ");
		id=sc.nextInt();
		
		System.out.println("Enter Customer Name : ");
		name=sc.next();
		
		System.out.println("Enter Customer Address : ");
		address=sc.next();
		
		System.out.println("Enter Customer Contact : ");
		cont=sc.nextInt();
		
		System.out.println("Enter Customer Email Id : ");
		email=sc.next();
		
		System.out.println("Enter Customer Password : ");
		password = sc.next();
		
		c.setCustId(id);
		c.setCustName(name);
		c.setCustAddr(address);
		c.setCustCont(cont);
		c.setCustEmailId(email);
		c.setPassword(password);
		
		flag=cd.updateCustomer(c);
		
		if(flag==true)
		{
			System.out.println("Update Successfully");
		}
		else
		{
			System.out.println("Update failed");
		}
		break;
		
		
	case 3:
		System.out.println("Enter Customer id : ");
		id=sc.nextInt();
		
		c.setCustId(id);
	flag=cd.deleteCustomer(id);

	if(flag==true)
	{
		System.out.println("Delete  Successfully");
	}
	else
	{
		System.out.println("Delete failed");
	}
	break;
		
		
	case 4:
		System.out.println("Enter Customer id to display Details : ");
		id=sc.nextInt();
		
		c.setCustId(id);
		Customer ct	=cd.displayCustId(id);
		

		System.out.println("Customer Id :"+ct.getCustId());
		System.out.println("Customer Name : "+ct.getCustName());
		System.out.println("Customer Address : "+ct.getCustAddr());
		System.out.println("Customer contact no : "+ct.getCustCont());
		System.out.println("Customer Email Id : "+ct.getCustEmailId());
		System.out.println("Customer Password : "+ct.getPassword());


		
		break;
		
	case 5:
		List<Customer> CustomerList=new ArrayList<Customer>();

		CustomerList=cd.displayAllCustomer();
		for(Customer i: CustomerList)
		{
			System.out.println("Customer Id :"+i.getCustId());
			System.out.println("Customer Name : "+i.getCustName());
			System.out.println("Customer Address : "+i.getCustAddr());
			System.out.println("Customer contact no : "+i.getCustCont());
			System.out.println("Customer Email Id : "+i.getCustEmailId());
			System.out.println("Customer Password : "+i.getPassword());
			System.out.println();
		}	
			
		break;
		
		
	case 6:
		System.exit(0);
		break;
		
		
	}
	sc.close();
	}

}
