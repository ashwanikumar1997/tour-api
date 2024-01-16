var express = require('express');
var server = express();
var startup = require('./app/startup');
module.exports = startup(server); // *A* it is output of current module.