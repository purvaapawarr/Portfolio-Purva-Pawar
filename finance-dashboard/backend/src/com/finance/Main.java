package com.finance;

import com.finance.controller.TransactionController;
import com.finance.service.TransactionService;

import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;

public class Main {

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        TransactionService transactionService = new TransactionService();

        TransactionController transactionController = new TransactionController(transactionService);

        server.createContext("/api/transactions", transactionController::handle);
        server.setExecutor(null); // creates a default executor
        System.out.println("Server started at http://localhost:8080");
        server.start();
    }
}
