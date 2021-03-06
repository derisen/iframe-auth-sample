const express = require('express');
const path = require('path');

const DEFAULT_PORT = process.env.PORT || 3002;

// initialize express.
const app = express();

// Initialize variables.
let port = DEFAULT_PORT;

// Setup app folders.
app.use(express.static('./'));

// Set up a route for redirect response
app.get('/redirect', (req, res) => {
    res.sendFile(path.join(__dirname + '/redirect.html'));
});

// Set up a route for front-channel logout
app.get('/ssout', (req, res) => {
    res.sendFile(path.join(__dirname + '/ssout.html'));
});

// Set up a route for index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Start the server.
app.listen(port);
console.log(`Listening on port ${port}...`);
