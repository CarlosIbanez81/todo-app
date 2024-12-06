require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

// Middleware for CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

// Login route
app.post('/login', (req, res) => {
    const { password } = req.body;
    const storedPassword = process.env.SECRET_PASSWORD;

    if (password !== storedPassword) {
        return res.status(401).json({ error: "Incorrect password" });
    }

    const token = jwt.sign({ access: 'granted' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ secret: "This is protected data" });
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the API! Use /todos, /login, or other endpoints.');
});

// Middleware for authentication
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Access Denied" });

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) return res.status(403).json({ error: "Invalid Token" });
        next();
    });
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
