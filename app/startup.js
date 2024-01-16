/**
 * @file Initializes server and all requirements for app
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
const setupMongo = require('./services/dbs/setupmongo');
// const setupRedis = require('./services/dbs/setupredis');
const fourOhFour = require('./middleware/404');
const cors = require("cors")
const appConfig = require('../config/config');
const bodyParser = require('body-parser');
const user = require('./middleware/user');
const cookieParser = require("cookie-parser")
const mongoose = require('mongoose');
const promise = require('bluebird');
const express = require('express');
const dotenv = require('dotenv'); //This module loads environment variables from a .env file that you create and adds them to the process.env object that is made available to the application.
const morgan = require('morgan'); //Morgan is used for logging request details.
const kue = require('kue'); //Kue is a feature rich priority job queue for node.js backed by redis.


module.exports = function (app) { //anonymous function
    var config = setupConfig(app); //defined belows
    setupDB(config);
    setupBodyParser(app);
    setupLogging(app);
    setupMiddleware(app);
    setupRouting(app);
    setupServices(app);
    // setupCors(app);
    return startServer(app, config.app.port);
}

/**
 * Setup app configuration
 **/
function setupConfig(app) {
    dotenv.config(); //it is for loading configurations from .env file to process.env
    let config = appConfig(); //it loads configurations fro config file
    app.set('config', config); // stores a named property on the app object that can be retrieved later with app.get(name)
    return config;
}
/**
 * Setup database connection
 **/
function setupDB(config) {
    setupMongo(config.mongoDb);
    // setupRedis(config.redis);
}


/**
 * Setup app cors configuration
 **/
// function setupCors(app) {
   
// }

// function setupRedis(config) {
//     var client = redis.createClient();
//     client.on('connect', () => {
//         app.redis = client;
//     });
// }

/**
 * Configure body parser
 **/
function setupBodyParser(app) {
    //use is a method to configure the middleware used by the routes of the Express HTTP server object. 
    app.use(bodyParser.urlencoded({ extended: false })); //support parsing of application/x-www-form-urlencoded post data
    app.use(bodyParser.json()); // support parsing of application/json type post data
}
/**
 * Setup app logging
 * @TODO Change logging based on environment
 **/
function setupLogging(app) {
    // HTTP request logger middleware - https://www.npmjs.com/package/morgan
    // if (app.get('env') == 'production') {
    //     app.use(morgan('common', { skip: function(req, res) { return res.statusCode < 400 }, stream: __dirname + '/../morgan.log' }));
    // } else {
    //     app.use(morgan('dev'));
    // }
    if (process.env.APP_ENV !== 'test') {
        app.use(morgan('dev'));
        // it is showing requests on the console where you start node app
        //Example : GET /dev/places/review 200 145.595 ms - 13


    }
}
/**
 * Add any middleware
 **/
function setupMiddleware(app) {
    // Make sure app is available in request object
    app.use(function (req, res, next) {
        if (!req.app) req.app = app;
        next();
    });

    app.use(user);
}
/**
 * Setup routing 
 **/
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

function setupRouting(app) {
    app.use('/doc-editor', express.static(__dirname + '/../node_modules/swagger-editor'));
    app.use(express.static('public'));
    app.use(cors())
    app.use(cookieParser())
    var routes = require(app.get('config').routesFile);
    app.use(passport.initialize()); //passport.initialize() is a middle-ware that initialises Passport.
    app.use('/', routes);
    app.use(fourOhFour);
}
/**
 * Setup services
 **/
function setupServices(app) {

}
/**
 * Start server
 **/
function startServer(app, port) {
    console.log('Magic happens at http://localhost:' + port);

    return new Promise((resolve, reject) => {
        //console.log(resolve());
        app.listen(port, () => resolve());
        // app.listen(port,"171.61.213.67");
    });
}