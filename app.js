// app.js

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Mobile App' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:3000`);
});
