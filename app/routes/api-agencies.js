/**
 * 
 * @file Tour Packages Routes
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 * 
**/
const routes = require('express').Router();

// var requireAdmin = require('../middleware/requireadmin');
const agencies = require('../controllers/agencies');

// requireAdmin, 
// routes.get('/', agencies.all); // GET /agencies
// routes.get('/search', agencies.search); // GET /agencies/search?q=query-term
// routes.get('/findNew', agencies.findNew); // GET /agencies/findNew?keyword=&lon=&lat=&radius=
routes.post('/', agencies.create); // POST /agencies
// routes.delete('/:agencyId', requireAdmin, agencies.delete); // DELETE /place/123
routes.get('/:agencyId', agencies.get); // GET /agencies/123

// routes.put('/:agencyId', agencies.update); // PUT /agencies/123

module.exports = routes;