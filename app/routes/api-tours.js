/**
 * 
 * @file Tour Routes
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 * 
**/
const routes = require('express').Router();

const tourIdToTour = require('../services/tours/params/touridtotour');
//console.log(tourpackageIdToTourPackage); process.exit;
const requireAdmin = require('../middleware/requireadmin');
const tours = require('../controllers/tours');
const fileupload = require('express-fileupload');

tourIdToTour(routes);
//requireAdmin, 
routes.get('/', tours.all); // GET /tours
routes.get('/search', tours.search); // GET /tours/search?q=query-term
//routes.get('/findNew', tours.findNew); // GET /tours/findNew?keyword=&lon=&lat=&radius=
routes.post('/create-tours', tours.create); // POST /tours
routes.post('/:tourId/media/:mediaKey/:variationKey/', fileupload(), tours.handleMediaUpload);
routes.delete('/:tourId', requireAdmin, tours.delete); // DELETE /place/123
routes.get('/agency-tour/:tourId', tours.get); // GET /place/123
routes.get('/:cityName', tours.getTourByCityName); // GET /place/123
routes.put('/:tourId', requireAdmin, tours.update); // PUT /place/123
routes.get('/relatedtour/:sourceId', tours.getTourByPlace);

module.exports = routes;