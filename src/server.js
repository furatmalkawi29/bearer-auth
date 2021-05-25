'use strict';

//setup
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

//import
// const errorHandler = require('./error-handlers/500.js');
// const notFound = require('./error-handlers/404.js');
const authRoutes = require('./auth/router.js');

// Prepare the express app
const app = express();

//use
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use(authRoutes);

// Catchalls
// app.use(notFound);
// app.use(errorHandler);

module.exports = {
  server: app,
  start: (port) => {
    const PORT = port || 4000;
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  },
};
