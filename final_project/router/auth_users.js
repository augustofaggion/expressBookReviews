const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
];

// Use token to authenticate user

const isValid = (username)=>{ //returns boolean
  const user = users.find(user => user.username === username);
  return !!user; // if values are undefined or null it will return false or true
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const user = users.find(user => user.username === username && user.password === password);
  return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  if(!username || !password){
    return res.status(400).json({message: "Invalid username or password"});
  }

  if (authenticatedUser(username,password)){
    const token = jwt.sign({username: username}, "fingerprint_customer", { expiresIn: '1h' });
    return res.status(200).json({message: "Login successful",token:token});
  } else {
    return res.status(401).json({message: "Invalid username or password"});
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;  // Get the book's ISBN from the URL
  const { review } = req.body;   // Get the new review content from the request body
  const username = req.session.username;  // Get the username from the session (assuming authentication)

  // Check if the book exists
  if (books[isbn]) {
      // Check if the user already has a review for this book
      if (books[isbn].reviews[username]) {
          // Update the review
          books[isbn].reviews[username] = review;
          return res.status(200).json({ message: "Review updated successfully." });
      } else {
          // If no existing review, add a new review
          books[isbn].reviews[username] = review;
          return res.status(200).json({ message: "Review added successfully." });
      }
  } else {
      // If the book with the given ISBN is not found
      return res.status(404).json({ message: "Book not found." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
