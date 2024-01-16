/**
 * 
 * @file TourPackage Routes
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 * 
**/
//console.log('Batman begins');

//process.on('exit', function(code) {
   // return console.log(`About to exit with code ${code}`);
//});
const routes = require('express').Router();

//var requireAdmin = require('../middleware/requireadmin');
const feeds = require('../controllers/feeds');

routes.get('/', feeds.homePlacesfeed);
routes.get('/featured', feeds.featured);


module.exports = routes;