# Bookstore API

This is a simple Express.js application for managing a bookstore with functionalities for books, customers, and orders.

## Features

- Manage books (CRUD operations)
- Register customers
- Place orders with stock management
- Static file serving for the front-end


## Technologies

- Node.js
- Express.js
- MySQL
- body-parser
- mysql2
- path


## Setup Instructions
npm install

## Setup MySQL database
create database mid_term;
use mid_term;
CREATE TABLE Books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL
);

CREATE TABLE Customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(id),
    FOREIGN KEY (book_id) REFERENCES Books(id)
);

## Configure database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_user', // Your DB user
    password: 'your_mysql_password', // Your DB password
    database: 'mid_term'
});

## Run Applicatoin
node server.js

## API Endpoints
GET /books: Retrieve all books.
GET /books/ : Retrieve a book by ID.
POST /books: Add a new book.
PUT /books/ : Update a book by ID.
DELETE /books/ : Delete a book by ID.
POST /customers: Register a new customer.
GET /customers: Retrieve all customers.
GET /customers/ : Retrieve a customer by ID.
POST /orders: Place a new order.
GET /orders: Retrieve all orders.
GET /orders/ : Retrieve an order by ID.


### License
Rupesh Shrestha (C0908441), Lambton College
