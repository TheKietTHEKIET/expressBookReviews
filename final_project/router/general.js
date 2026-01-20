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

/*QUESTION 11 – AXIOS + ASYNC*/

// GET ALL BOOKS (ASYNC/AWAIT + AXIOS)
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// GET BY ISBN (PROMISE + AXIOS)
public_users.get('/isbn/:isbn', (req, res) => {
  axios
    .get(`http://localhost:5000/isbn/${req.params.isbn}`)
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(() => {
      res.status(404).json({ message: "Book not found" });
    });
});

// GET BY AUTHOR (ASYNC/AWAIT + AXIOS)
public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    const result = Object.values(response.data).filter(
      book => book.author === req.params.author
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// GET BY TITLE (ASYNC/AWAIT + AXIOS)
public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    const result = Object.values(response.data).filter(
      book => book.title === req.params.title
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "No books found with this title" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books by title" });
  }
});

// GET REVIEW
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book.reviews);
});

/* ===== ASYNC ROUTES */

public_users.get("/async/books", async (req, res) => {
  const response = await axios.get("http://localhost:5000/");
  res.json(response.data);
});

public_users.get("/async/isbn/:isbn", (req, res) => {
  axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
    .then(r => res.json(r.data));
});

public_users.get("/async/author/:author", (req, res) => {
  axios.get(`http://localhost:5000/author/${req.params.author}`)
    .then(r => res.json(r.data));
});

public_users.get("/async/title/:title", async (req, res) => {
  const response = await axios.get(
    `http://localhost:5000/title/${req.params.title}`
  );
  res.json(response.data);
});

module.exports.general = public_users;
