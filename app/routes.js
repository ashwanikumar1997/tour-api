/**
 * @file Sets up all routes
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
// req.app.permissions.canRead('posts

var express = require('express');
var passport = require('passport');
//var facebook = require('passport-facebook');

// Controllers
const homeController = require('./controllers/home');

// All routes
const routes = express.Router();
const apiRoutes = require('./routes/api');

/**
 * Root routes
**/
routes.get('/', homeController);

routes.use('/v1', apiRoutes);
routes.use('/dev', apiRoutes);
//To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
routes.use('/uploads', express.static('uploads'));
routes.use('/assets', express.static('assets'));
routes.use('/share', require('./routes/share'));

/**
 * Catch errors
**/
routes.use(function(err, req, res, next) {
    console.error(err.stack);
    // res.status(500).send({
    //     success: false,
    //     message: 'Ouch, that hurt.  I think I just broke something'
    // });
});

module.exports = routes;
