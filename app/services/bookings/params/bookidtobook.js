/**
 * @file Takes a placeId URL param and adds a corresponding place to the request object
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 */
var Booking = require('../../../models/booking');

module.exports = (routes) => {

    // Route param
    routes.param('bookingId', (req, res, next, bookingId) => {

        Booking.findById(bookingId).populate('sourceId')
				.populate('destinationId').exec(function (err, booking)	{

            if (err) return next(err);
            if (!booking) res.status(404).send({success: false, message: 'Unable to find requested booking'});
            req.booking = booking;
            next();
        });
    });
}