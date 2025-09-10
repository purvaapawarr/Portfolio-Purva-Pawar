package com.purva.test;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import com.purva.daoimpl.GarDaoImpl;
import com.purva.pojo.Garment;

public class GarTest {
	 

	public static void main(String[] args) 
	{
		String name,type;
		int price;
		int choice,id;
		boolean flag;
		Garment g=new Garment();
		GarDaoImpl gd=new GarDaoImpl();
		
		System.out.println("*************WELCOME TO GARMENT SHOPPIEEE************");
		Scanner sc=new Scanner(System.in);
		
		System.out.println("1.Add Garment Details");
		System.out.println("2.Update Garment Details");
		System.out.println("3.Delete any garment Details");
		System.out.println("4.Display Garment Id");
		System.out.println("5.Display All Garment Details");
		
		System.out.println("Enter Element Number :");
		choice=sc.nextInt();
		
		switch(choice)
		{
		case 1:
		
			System.out.println("Enter garment name : ");
			name=sc.next();
			
			System.out.println("Enter garment type : ");
			type=sc.next();
			
			System.out.println("Enter garment Price : ");
			price=sc.nextInt();
			
			g.setGarName(name);
			g.setGarType(type);
			g.setGarPrice(price);
			
			flag=gd.addGar(g);
			
			if(flag==true)
			{
				System.out.println("Add Garment Details Succesfully");
			}
			else
			{
				System.out.println("Garment Adding failed");
			}
			
			break;
		
		case 2:
		
			System.out.println("Enter Garment Id : ");
			id=sc.nextInt();
			
			System.out.println("Enter Garment name : ");
			name=sc.next();
			
			System.out.println("Enter Garment Type: ");
			type=sc.next();
			
			System.out.println("Enter  Garment price: ");
			price=sc.nextInt();
			
			g.setGarId(id);
			g.setGarName(name);
			g.setGarType(type);
			g.setGarPrice(price);
			
			flag=gd.updateGar(g);
			
			if(flag==true)

			{
				System.out.println("Update Successfully");
			}
			else {
				System.out.println("Update failed");
			}
			break;
				
		
		
		case 3:
			
			System.out.println("Enter Garment Id to delete the perticular Garment Details: ");
			id=sc.nextInt();
			
			g.setGarId(id);
			
			flag=gd.deleteGar(id);
			
			if(flag==true)

			{
				System.out.println("Delete Successfully");
			}
			else {
				System.out.println("Delete  failed");	
		    break;	
		    }
		
		case 4:
			
			System.out.println("Enter garment Id to Display details : ");
			id=sc.nextInt();
			
			g.setGarId(id);
			Garment gd1 = gd.displayGarId(id);
			
		
			{
				System.out.println("Garment Name : "+gd1.getGarName());
				System.out.println("Garment Type : "+gd1.getGarType());
				System.out.println("Garment Price : "+gd1.getGarPrice());
			}
			break;
		
		case 5:
		
		List<Garment> garList=new ArrayList<Garment>();
		garList=gd.displayAllGar();
		for(Garment i: garList)
		{
	       System.out.println("Garment Id : "+i.getGarId());
	       System.out.println("Garment Name : "+i.getGarName());
	       System.out.println("Garment Type : "+i.getGarType());
	       System.out.println("Garment Price : "+i.getGarPrice());
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
