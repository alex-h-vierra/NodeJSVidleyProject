//define our global variables 
//if this don't work, just swithc to middleware function ./async.js
const express = require( 'express');
const app = express();
const winston = require('winston');
const logger = require('./startups/logging');
require('./startups/routes')(app);
require('./startups/db')();
require('./startups/config')();
require('./startups/validation')();

const port = process.env.PORT || 8080;
const server = app.listen(port, () =>{
   logger.info(`Listening on port ${port}.... `); 
}); 
module.exports = server;
