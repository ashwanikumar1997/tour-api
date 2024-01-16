/**
 * @file Takes a placeId URL param and adds a corresponding place to the request object
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 */
var Place = require('../../../models/place');

module.exports = (routes) => {

    // Route param
    routes.param('placeId', (req, res, next, placeId) => {

        Place.findById(placeId, (err, place) => {

            if (err) return next(err);
            if (!place) res.status(404).send({success: false, message: 'Unable to find requested place'});

            req.place = place;

            next();
        }).populate({path:'parentId'}).populate({path:'createdBy'});
    });
}