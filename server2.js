const express = require('express');
const morgan = require('morgan');
const path = require('path');

const DEFAULT_PORT = process.env.PORT || 3002;

// initialize express.
const app = express();

// Initialize variables.
let port = DEFAULT_PORT;

// Configure morgan module to log all requests.
app.use(morgan('dev'));

// Setup app folders.
app.use(express.static('app2'));

// Set up a route for index.html
app.get('/ssout', (req, res) => {
    console.log(req.query);
    res.sendFile(path.join(__dirname + '/app2/ssout.html'));
});

// Set up a route for index.html
app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname + '/app2/auth.html'));
});

// Set up a route for index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/app2/index.html'));
});

// Start the server.
app.listen(port);
console.log(`Listening on port ${port}...`);
