const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

// REGISTER
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// GET ALL BOOKS
public_users.get('/', (req, res) => {
  res.status(200).json(books);
});

// GET BY ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

// GET BY AUTHOR
public_users.get('/author/:author', (req, res) => {
  const result = Object.values(books).filter(
    book => book.author === req.params.author
  );
  res.json(result);
});

// GET BY TITLE
public_users.get('/title/:title', (req, res) => {
  const result = Object.values(books).filter(
    book => book.title === req.params.title
  );
  res.json(result);
});

// GET REVIEW
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book.reviews);
});

/* ===== ASYNC / PROMISE ===== */

// TASK 10
public_users.get("/async/books", async (req, res) => {
  const response = await axios.get("http://localhost:5000/");
  res.json(response.data);
});

// TASK 11
public_users.get("/async/isbn/:isbn", (req, res) => {
  axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
    .then(r => res.json(r.data));
});

// TASK 12
public_users.get("/async/author/:author", (req, res) => {
  axios.get(`http://localhost:5000/author/${req.params.author}`)
    .then(r => res.json(r.data));
});

// TASK 13
public_users.get("/async/title/:title", async (req, res) => {
  const response = await axios.get(
    `http://localhost:5000/title/${req.params.title}`
  );
  res.json(response.data);
});

module.exports.general = public_users;
