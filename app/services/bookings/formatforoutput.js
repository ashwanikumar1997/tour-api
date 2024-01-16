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
function formatBookingForOutput(p, includeAdminFields) {
	var config = appConfig();
	var booking = {
		id: p._id,
		full_name: p.full_name,
		tourId: p.tourId._id,
		persons : p.persons,
		tour: { 'id': (p.tourId._id !== 'undefined') ? p.tourId._id: '' , 'name' : p.tourId.name },
		phone: p.phone,
		tour_date: p.tour_date,
		email_address: p.email_address,
	};
	return booking;
}

module.exports = formatBookingForOutput