import React, { useState, useEffect } from 'react';
import { useFinanceStore } from '../store/finance-store';

const HomePage = () => {
  const { transactions, addTransaction, removeTransaction, setTransactions } = useFinanceStore();
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/transactions')
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error('Error fetching transactions', err));
  }, []);

  const handleAdd = () => {
    if (!desc || !amount || !category || !date) return;

    const transaction = {
      description: desc,
      amount: parseFloat(amount),
      category,
      date
    };

    fetch('http://localhost:8080/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    })
    .then(res => res.json())
    .then(data => addTransaction(data))
    .catch(err => console.error('Error adding transaction', err));

    setDesc('');
    setAmount('');
    setCategory('');
    setDate('');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">व्यक्तिगत वित्त डैशबोर्ड</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <input
          className="border p-2 w-full mb-2"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          type="number"
          className="border p-2 w-full mb-2"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 w-full mb-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button className="bg-saffron text-white p-2 rounded w-full" onClick={handleAdd}>
          Add Transaction
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((t) => (
          <div key={t.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h2 className="font-bold">{t.description}</h2>
              <p>₹{t.amount.toLocaleString('en-IN')}</p>
              <p>{t.category}</p>
              <p>{t.date}</p>
            </div>
            <button className="bg-red-500 text-white p-2 rounded" onClick={() => removeTransaction(t.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
