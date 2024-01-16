/**
 * @file Check if a supplied Place ID is valid
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var Place = require('../../models/place');
var Promise = require('promise');

module.exports = function getPlaceById(placeId) {
    return new Promise( (resolve, reject) => {
        Place.findById(placeId, (err, place) => {
            if (err) reject(err);
            else if ( ! place) reject(new Error('Invalid place ID'));
            else resolve(place);
        });
    });
}