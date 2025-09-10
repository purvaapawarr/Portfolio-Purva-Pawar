package com.purva.daoimpl;

import java.util.List;

import com.purva.pojo.Customer;

public interface CustomerDao {
	
	boolean addCustomer(Customer g);
	boolean updateCustomer(Customer g);
    boolean	deleteCustomer(int CustId);
	Customer displayCustId(int CustId);
	List<Customer> displayAllCustomer();

}
