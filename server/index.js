const express = require('express');
const http = require('http'); // is a native low level node library
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// DB Setup
mongoose.connect('mongodb://localhost:auth/auth', { useNewUrlParser: true });

// App Setup

// both bodyParser and morgan are middleware
app.use(morgan('combined')); // morgan is a logging framework.
// bodyParser will attempt to parse the request for all request types.
// this would cause issues if we had files incoming.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.json({ type: '*/* ' }));
router(app);
// Server Setup
const port = process.env.PORT || 3090;
// create an http server that can recieve requests, and foward them to our app.
const server = http.createServer(app);
server.listen(port);
console.log(`Server listening on: ${port}`);
