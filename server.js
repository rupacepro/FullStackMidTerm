const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Your DB user
  password: 'Rupesh@123', // Your DB password
  database: 'mid_term' // Your database name
});

db.connect(err => {
  if (err) throw err;
  console.log('Database connected!');
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'books.html')); // Serve books.html when accessing /
});

// Books Endpoints
app.get('/books', (req, res) => {
  db.query('SELECT * FROM Books', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database query failed' });
    }
    res.json(results);
  });
});

app.get('/books/:id', (req, res) => {
  const bookId = req.params.id;
  db.query('SELECT * FROM Books WHERE id = ?', [bookId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(results[0]);
  });
});

app.post('/books', (req, res) => {
  const { title, author, price, stock } = req.body;
  db.query('INSERT INTO Books (title, author, price, stock) VALUES (?, ?, ?, ?)',
    [title, author, price, stock], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error adding book' });
      }
      res.status(201).json({ id: results.insertId, title, author, price, stock });
    });
});

app.put('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const { title, author, price, stock } = req.body;
  db.query('UPDATE Books SET title = ?, author = ?, price = ?, stock = ? WHERE id = ?',
    [title, author, price, stock, bookId], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating book' });
      }
      res.json({ id: bookId, title, author, price, stock });
    });
});

app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;
  db.query('DELETE FROM Books WHERE id = ?', [bookId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error deleting book' });
    }
    res.json({ message: 'Book deleted successfully' });
  });
});

// Customers Endpoints
app.get('/customers', (req, res) => {
  db.query('SELECT * FROM Customers', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database query failed' });
    }
    res.json(results);
  });
});

app.get('/customers/:id', (req, res) => {
  const customerId = req.params.id;
  db.query('SELECT * FROM Customers WHERE id = ?', [customerId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(results[0]);
  });
});

app.post('/customers', (req, res) => {
  const { name, email } = req.body;
  db.query('INSERT INTO Customers (name, email) VALUES (?, ?)',
    [name, email], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error registering customer' });
      }
      res.status(201).json({ id: results.insertId, name, email });
    });
});

// Orders Endpoints
app.get('/orders', (req, res) => {
  db.query('SELECT * FROM Orders', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database query failed' });
    }
    res.json(results);
  });
});

app.get('/orders/:id', (req, res) => {
  const orderId = req.params.id;
  db.query('SELECT * FROM Orders WHERE id = ?', [orderId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(results[0]);
  });
});

app.post('/orders', (req, res) => {
  const { customer_id, book_id, quantity } = req.body;

  db.query('SELECT stock FROM Books WHERE id = ?', [book_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database query failed' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const stock = results[0].stock;
    if (stock >= quantity) {
      db.query('INSERT INTO Orders (customer_id, book_id, quantity, order_date) VALUES (?, ?, ?, NOW())',
        [customer_id, book_id, quantity], (err, orderResults) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error placing order' });
          }
          db.query('UPDATE Books SET stock = stock - ? WHERE id = ?', [quantity, book_id], (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Error updating book stock' });
            }
            res.status(201).json({ orderId: orderResults.insertId, customer_id, book_id, quantity });
          });
        });
    } else {
      res.status(400).json({ message: 'Insufficient stock available' });
    }
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
