/**
 * @file Takes place database result and formats it for output
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var appConfig = require('../../../config/config');
var formatPlaceForOutput = require('../places/formatforoutput');

/**
 * Formats place for output
 * @param model Place
 * @returns Object
 */
function formatTourForOutput(p, includeAdminFields) {
	let config = appConfig();
	// return p;
	let SITE_URL = 'http://localhost:8081';
	let tour = {
		id: p._id,
		agency_name: p.agency_name,
		agencyId: p.agencyId._id,
		ownerId:p.ownerId,
		// source: (typeof p.sourceId !== 'undefined') ? formatPlaceForOutput(p.sourceId) : {}, //electS fields to get in find query
		//destination: (typeof p.destinationId !== 'undefined')? formatPlaceForOutput(p.destinationId) : {},
		tourDuration: p.tourDuration,
		tourTitle: p.tourTitle,
		tourImage: p.tourImage.path ? SITE_URL + '/uploads/tours' + p.tourImage.path : '',
		tourStartCity: p.tourStartCity,
		tourPackageAmount: p.tourPackageAmount,
		endTourCity: p.endTourCity,

	};
	//console.log(tour_package); 
	return tour;
}

module.exports = formatTourForOutput