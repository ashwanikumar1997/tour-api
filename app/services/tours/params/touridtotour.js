/**
 * @file Takes a placeId URL param and adds a corresponding place to the request object
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 */
var Tour = require('../../../models/tour');

module.exports = (routes) => {

    // Route param
    // routes.param('tourId', (req, res, next, tourId) => {

    //     Tour.findById(tourId).populate('sourceId')
	// 			.populate('destinationId').exec(function (err, tour)	{

    //         if (err) return next(err);
    //         if (!tour) res.status(404).send({success: false, message: 'Unable to find requested place'});

    //         req.tour = tour;
    //         next();
    //     });
    // });
}