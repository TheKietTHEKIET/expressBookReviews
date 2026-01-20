const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return !users.find(u => u.username === username);
};

const authenticatedUser = (username, password) => {
  return users.find(u => u.username === username && u.password === password);
};

// LOGIN
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  const user = authenticatedUser(username, password);
  if (!user) {
    return res.status(401).json({ message: "Invalid login" });
  }

  const accessToken = jwt.sign(
    { username },
    "fingerprint_customer",
    { expiresIn: "1h" }
  );

  req.session.authorization = { accessToken };
  return res.json({ message: "Login successful" });
});

// ADD / UPDATE REVIEW
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;
  res.json({ message: "Review added/updated successfully" });
});

// DELETE REVIEW
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  delete books[isbn].reviews[username];
  res.json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
