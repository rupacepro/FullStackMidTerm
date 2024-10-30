CREATE DATABASE mid_term;
USE mid_term;

CREATE TABLE Books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  price DECIMAL(10, 2),
  stock INT
);

CREATE TABLE Customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255)
);

CREATE TABLE Orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  book_id INT,
  quantity INT,
  order_date DATE,
  FOREIGN KEY (customer_id) REFERENCES Customers(id),
  FOREIGN KEY (book_id) REFERENCES Books(id)
);
