const express = require('express');
const bodyParser = require('body-parser');
const bloomFilter = require('./bloomFilter');

const app = express();
app.use(bodyParser.json());

let users = []; // Simulating a database

// Register a new user
app.post('/register', (req, res) => {
    const { email, name } = req.body;

    if (bloomFilter.contains(email)) {
        return res.status(400).json({ message: "Email already exists (or false positive detected)." });
    }

    // Add email to Bloom Filter and "Database"
    bloomFilter.add(email);
    users.push({ email, name });

    res.status(201).json({ message: "User registered successfully!", user: { email, name } });
});

// List all registered users
app.get('/users', (req, res) => {
    res.json(users);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
