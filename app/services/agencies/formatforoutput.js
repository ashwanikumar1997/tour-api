/**
 * @file Takes place database result and formats it for output
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var appConfig = require('../../../config/config');

/**
 * Formats place for output
 * @param model Place
 * @returns Object
 */
function formatAgencyForOutput(p, includeAdminFields) {

    var config = appConfig();

    var tour_package = {
        id: p._id,
        c_name: p.c_name,
		c_owner: p.c_owner,
		website: p.website,
		destination: p.destination,
		name:p.name,
		phone_no: p.phone_no,
		email_id: p.email_id,
		message: p.message,
        //profileImageUrl: config.mediaLocations.static.webUrl + '/place-default.jpg',
    };
    return tour_package;
}

module.exports = formatAgencyForOutput