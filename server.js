const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());  // For parsing application/json

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Default user in XAMPP
  password: '',  // Default password is empty
  database: 'chatbot_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

// Simple route for the root URL "/"
app.get('/', (req, res) => {
  res.send('Welcome to the Chatbot API!');  // Send a simple welcome message
});

// Function to generate dynamic responses based on user input
const getBotResponse = (userMessage) => {
  const message = userMessage.toLowerCase();

  if (message.includes('hello') || message.includes('hi')) {
    return 'Hello! How can I assist you today?';
  } else if (message.includes('how are you')) {
    return 'I am doing great, thank you for asking!';
  } else if (message.includes('your name')) {
    return 'I am a chatbot created to assist you.';
  } else if (message.includes('bye')) {
    return 'Goodbye! Have a great day!';
  } else {
    return "Sorry, I didn't understand that. Can you ask something else?";
  }
};

// POST route to insert a message and generate a bot response
app.post('/messages', (req, res) => {
  console.log('Received POST request for /messages');
  const { user_message } = req.body;

  // Generate bot response dynamically
  const bot_response = getBotResponse(user_message);

  // Store the user message and bot response in the database
  const query = 'INSERT INTO messages (user_message, bot_response) VALUES (?, ?)';
  
  db.query(query, [user_message, bot_response], (err, results) => {
    if (err) {
      console.error('Error inserting message:', err);
      return res.status(500).json({ error: 'Failed to insert message' });
    }
    return res.status(201).json({ message: 'Message added successfully', bot_response });
  });
});

// GET route to fetch previous messages from the database
app.get('/messages', (req, res) => {
  const query = 'SELECT * FROM messages ORDER BY id ASC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
    return res.status(200).json(results);  // Send the messages as a response
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
