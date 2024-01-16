/**
 * @file Takes place database result and formats it for output
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var appConfig = require('../../../config/config');
var formatTourForOutput = require('../tours/formatforoutput');

/**
 * Formats place for output
 * @param model Place
 * @returns Object
 */
function formatTourPackageForOutput(p, includeAdminFields) {

    var config = appConfig();

    var tour_package = {
        id: p._id,
        name: p.name,
	//	tour: formatTourForOutput(p.tourId),
		description: p.description,
		price: p.price,
    };
    return tour_package;
}

module.exports = formatTourPackageForOutput