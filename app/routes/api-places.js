/**
 * 
 * @file Place Routes
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 * 
**/
const routes = require('express').Router();


const requireAdmin = require('../middleware/requireadmin');
const places = require('../controllers/places');
const fileupload = require('express-fileupload');


//requireAdmin, 
routes.get('/', places.all); // GET /places
routes.get('/ambassador', places.ambassador);// Suported locations
routes.get('/search', places.search); // GET /places/search?q=query-term
//routes.get('/findNew', places.findNew); // GET /places/findNew?keyword=&lon=&lat=&radius=
//routes.get('/findNew/:googlePlaceId', places.findNewDetail); // GET /places/findNew/qwerty879654erdfvbnhjuy76
//routes.get('/review', requireAdmin, places.review); // GET /places/review
routes.post('/:placeId/media/:mediaKey/:variationKey', fileupload(), places.handleMediaUpload);

routes.get('/placesList', places.placesList);
routes.post('/create-place', places.create); // POST /places

routes.delete('/:placeId', requireAdmin, places.delete); // DELETE /place/123
routes.get('/:placeId', places.get); // GET /place/123
routes.get('/:placeId/relatedtours', places.relatedTours); // GET /place/123
routes.put('/:placeId', requireAdmin, places.update); // PUT /place/123
module.exports = routes;

