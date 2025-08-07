const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// SQLite Database Connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Test DB Connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite connected');
  } catch (error) {
    console.error('SQLite connection error:', error);
  }
})();

// Define a Model (Example: Invoice)
const Invoice = sequelize.define('Invoice', {
  clientName: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  paid: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Sync Database
sequelize.sync({ force: true }); // Remove `force: true` in production

// API Routes
app.get('/api/invoices', async (req, res) => {
  const invoices = await Invoice.findAll();
  res.json(invoices);
});

app.post('/api/invoices', async (req, res) => {
  const invoice = await Invoice.create(req.body);
  res.status(201).json(invoice);
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});