const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: "user1", password: "password1" },
  { username: "user2", password: "password2" }
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
    const token = jwt.sign({username: username}, "fingerprint_customer");
    return res.status(200).json({token:token});
  } else {
    return res.status(401).json({message: "Invalid username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
 const isbn = req.params.isbn;
 const review = req.body.review;

 if(!isbn || !review){
   return res.status(400).json({message: "Invalid request"});
 }

 if (books[isbn]){
   books[isbn].reviews.push({user: req.user.username, review});
   return res.status(200).json({message: "Review added successfully"});
 } else {
   return res.status(404).json({message: "Book not found"});
 }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
