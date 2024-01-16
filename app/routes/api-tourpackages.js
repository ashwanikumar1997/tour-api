/**
 * 
 * @file TourPackage Routes
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 * 
**/
var routes = require('express').Router();

var tourpackageIdToTP = require('../services/tourpackages/params/tourpackageidtotp');
//console.log(tourpackagepackageIdToTourPackagePackage); process.exit;
var requireAdmin = require('../middleware/requireadmin');
var tourpackages = require('../controllers/tourpackages');

// tourpackageIdToTP(routes);
//requireAdmin, 
routes.get('/', tourpackages.all); // GET /tourpackages
routes.get('/search', tourpackages.search); // GET /tourpackages/search?q=query-term
//routes.get('/findNew', tourpackages.findNew); // GET /tourpackages/findNew?keyword=&lon=&lat=&radius=
routes.post('/', tourpackages.create); // POST /tourpackages
//routes.delete('/:placeId', requireAdmin, tourpackages.delete); // DELETE /place/123
routes.get('/:tourpackageId', tourpackages.get); // GET /place/123
routes.put('/:tourpackageId', requireAdmin, tourpackages.update); // PUT /place/123

module.exports = routes;