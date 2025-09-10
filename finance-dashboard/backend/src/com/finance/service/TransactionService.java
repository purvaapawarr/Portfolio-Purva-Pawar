package com.finance.service;

import com.finance.model.Transaction;
import com.finance.util.JsonUtil;
import com.google.gson.reflect.TypeToken;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

public class TransactionService {

    private final File file = new File("backend/data/transactions.json");
    private final AtomicLong idGenerator = new AtomicLong(1);

    public TransactionService() {
        if (!file.exists()) {
            JsonUtil.writeToFile(file, new ArrayList<Transaction>());
        }
    }

    public List<Transaction> getAllTransactions() {
        return JsonUtil.readFromFile(file, new TypeToken<List<Transaction>>(){}.getType());
    }

    public void addTransaction(Transaction transaction) {
        List<Transaction> transactions = getAllTransactions();
        transaction.setId(idGenerator.getAndIncrement());
        transactions.add(transaction);
        JsonUtil.writeToFile(file, transactions);
    }
}
