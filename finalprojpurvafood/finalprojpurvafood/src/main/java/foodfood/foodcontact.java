package foodfood;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/foodcoontact")

public class foodcontact extends HttpServlet{
	
	String name, email;
	long phone;
	int guests;
	
	
	
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
	{
		String name = req.getParameter("name");
        String email = req.getParameter("email");
       
        long phone = Long.parseLong(req.getParameter("phone"));
        int guests = Integer.parseInt(req.getParameter("guests"));
        

        try {
        	Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DBConnection.establishConnection();
            String query = "INSERT INTO users(name, email, pass, num, address) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, name);
            preparedStatement.setString(2, email);
          preparedStatement.setLong(3, phone);
          preparedStatement.setInt(4, guests);
          
          
           
            preparedStatement.executeUpdate();
            preparedStatement.close();
            connection.close();

            resp.sendRedirect("index.html"); // Redirect to login page
        } catch (Exception e)
        {
            e.printStackTrace();
        }
	}

}
