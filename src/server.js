// Automatically load the .env file
require('dotenv').config();

// IMPORTS
const express = require('express');
const path = require('path');
const apiRoutes = require('./apiRoutes.js');

// VARIABLES
const app = express();
// If there's no env var, we use the 8080 port
const port = process.env.PORT || 8080;

// Middleware to parse JSON bodies
app.use(express.json());

// Express error middleware for JSON syntax errors
app.use((err, req, res, next) => {
    // Check that it's a syntax error present in the body
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: 'Malformed JSON',
            message: 'The JSON syntax is incorrect.',
        });
    }
    next(err);
});

// Log Middleware
app.use((req, res, next) => {
    if (req.url !== '/favicon.ico' && !req.url.startsWith('/script/') && !req.url.startsWith('/assets/')) {
        console.log(`[${req.method}] ${req.url}`);
        next();
        return;
    }
    next();
});

// Serve statics files
app.use(express.static(path.join(__dirname, '../public')));

// Use API routes
app.use('/api', apiRoutes);

// Serve dashboard.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/dashboard.html'));
});


app.listen(port, () => {
    console.log(`Server start on http://localhost:${port}`);
});
