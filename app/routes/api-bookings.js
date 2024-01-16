/**
 * 
 * @file Tour Routes
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 * 
**/
var routes = require('express').Router();

var bookidToBook = require('../services/bookings/params/bookidtobook');
//console.log(tourpackageIdToTourPackage); process.exit;
var requireAdmin = require('../middleware/requireadmin');
var bookings = require('../controllers/bookings');

bookidToBook(routes);
routes.get('/', bookings.all);// GET  /bookings
routes.get('/search', bookings.search); // GET /bookings/search?q=query-term
//routes.get('/findNew', bookings.findNew); // GET /bookings/findNew?keyword=&lon=&lat=&radius=
routes.post('/', bookings.create); // POST /bookings/tour packages
routes.delete('/:placeId', requireAdmin, bookings.delete); // DELETE /place/123
routes.get('/:bookingId', bookings.get); // GET /place/123
//routes.put('/:bookingId', requireAdmin, bookings.update); // PUT /place/123

module.exports = routes;