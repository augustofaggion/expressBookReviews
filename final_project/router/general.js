const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });

});

const getAllBooks = async () => {
  return new Promise((resolve, reject) => {
    // Simulate async operation with a delay (e.g., fetching from DB)
    setTimeout(() => {
      resolve(books); // Resolve the promise with the books object
    }, 1000); // Simulating delay of 1 second
  });
};

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const allBooks = await getAllBooks(); // Await the async function
    return res.status(200).json(allBooks); // Return the list of books
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books', error });
  }
});

const findBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
      const book = books[isbn]; // Look for the book using the ISBN
      if (book) {
          resolve(book); // Resolve the promise with the found book
      } else {
          reject(new Error('Book not found')); // Reject if not found
      }
  });
};

// Function to find books by author using Promises
const findBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
      const foundBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
      if (foundBooks.length > 0) {
          resolve(foundBooks); // Resolve with found books
      } else {
          reject(new Error('No books found for this author')); // Reject if no books found
      }
  });
};

const findBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
      const foundBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
      if (foundBooks.length > 0) {
          resolve(foundBooks); // Resolve with found books
      } else {
          reject(new Error('No books found with this title')); // Reject if no books found
      }
  });
};

// Route to get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn; // Get the ISBN from the URL parameters
  findBookByISBN(isbn)
      .then(book => {
          return res.status(200).json(book); // Send the book details as a response
      })
      .catch(error => {
          return res.status(404).json({ message: error.message }); // Handle errors
      });
});

// Route to get books based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author; // Get the author from the URL parameters
  findBooksByAuthor(author)
      .then(booksByAuthor => {
          return res.status(200).json(booksByAuthor); // Send the found books as a response
      })
      .catch(error => {
          return res.status(404).json({ message: error.message }); // Handle errors
      });
});
module.exports.general = public_users;
