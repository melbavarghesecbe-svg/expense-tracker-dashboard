import { useState, useEffect } from "react";
import "./App.css";

import jsPDF from "jspdf";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");

  const [darkMode, setDarkMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!expense || !amount || !date) return;

    const newExpense = {
      expense,
      amount: Number(amount),
      category,
      date,
    };

    if (editIndex !== null) {
      const updated = [...expenses];
      updated[editIndex] = newExpense;
      setExpenses(updated);
      setEditIndex(null);
    } else {
      setExpenses([newExpense, ...expenses]);
    }

    setExpense("");
    setAmount("");
    setDate("");
  };

  const deleteExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const pieData = Object.keys(categoryTotals).map((key) => ({
    category: key,
    value: categoryTotals[key],
  }));

  const COLORS = [
    "#16a34a",
    "#2563eb",
    "#a855f7",
    "#dc2626",
    "#f59e0b",
    "#14b8a6",
    "#ec4899",
    "#6b7280",
  ];

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Expense Report", 20, 20);

    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(12);

    let y = 40;

    expenses.forEach((e, index) => {
      doc.text(`${index + 1}. ${e.expense}`, 20, y);
      doc.text(`Rs. ${e.amount}`, 90, y);
      doc.text(e.category, 130, y);
      doc.text(e.date, 165, y);

      y += 10;
    });

    y += 10;

    doc.setFontSize(14);
    doc.text(`Total Expense: Rs. ${total}`, 20, y);

    doc.save("Expense_Report.pdf");
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>

      {/* NAVBAR */}
      <header className="navbar">

        <div className="brand">
          <div className="logo">₹</div>
          <h1>Finance Dashboard</h1>
        </div>

        <div className="nav-actions">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button onClick={exportPDF}>
            Export PDF
          </button>
        </div>

      </header>

      <div className="container">

        {/* SUMMARY */}
        <div className="summary">

          <div className="card">
            <h3>Total Expense</h3>
            <p>₹{total}</p>
          </div>

          <div className="card">
            <h3>Total Items</h3>
            <p>{expenses.length}</p>
          </div>

        </div>

        {/* FORM */}
        <div className="form-card">

          <input
            type="text"
            placeholder="Enter expense name"
            value={expense}
            onChange={(e) => setExpense(e.target.value)}
          />

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button onClick={addExpense}>
            {editIndex !== null ? "Update Expense" : "Add Expense"}
          </button>

        </div>

        {/* CHART */}
        {expenses.length > 0 && (
          <div className="chart-card">

            <h3>Expense Breakdown</h3>

            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}

        {/* EXPENSE LIST */}
        <div className="list">

          {expenses.map((item, index) => (
            <div className="item" key={index}>

              <div>
                <h4>{item.expense}</h4>

                <small className="category-tag">
                  {item.category}
                </small>

                <small className="date">
                  {item.date}
                </small>
              </div>

              <div className="right">

                <span>₹{item.amount}</span>

                <button
                  onClick={() => {
                    setExpense(item.expense);
                    setAmount(item.amount);
                    setCategory(item.category);
                    setDate(item.date);
                    setEditIndex(index);
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteExpense(index)}
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default App;