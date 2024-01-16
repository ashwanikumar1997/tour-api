/**
 * @file Takes a placeId URL param and adds a corresponding place to the request object
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 */
var TourPackage = require('../../../models/tourpackage');

module.exports = (routes) => {

    // Route param
    routes.param('tourpackageId', (req, res, next, tourpackageId) => {

        TourPackage.findById(tourpackageId).populate('sourceId')
				.populate('destinationId').exec(function (err, tourpackage)	{

            if (err) return next(err);
            if (!tourpackage) res.status(404).send({success: false, message: 'Unable to find requested place'});

            req.tourpackage = tourpackage;
            next();
        });
    });
}