/**
 * @file Search places by keyword
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var normalizeForSearch = require('../../utils/strings/normalizeforsearch');
//var GeoType = require('../../enums/geotype');
var TourReviewStatus = require('../../enums/tourreviewstatus');
var Tour = require('../../models/tour');
var ObjectId = require('mongoose').Types.ObjectId;

/**
 * @param {String} keyword
 * @param {Int} limit
 * @param {String} columns List of columns (space delimited)
 * @param {Object} nearCoordinates { latitude, longitude }
 * @param {Integer} withinDistance Number of miles that the places must be within
 * @returns {Array|{index: number, input: string}|*|Promise}
 */
function searchTours(keyword, limit, columns, user) {

    keyword = normalizeForSearch(keyword);
    var regExKeyword = new RegExp('^' + keyword);

    /*var near = [];
    var latitude = nearCoordinates ? parseFloat(nearCoordinates.latitude) : null;
    var longitude = nearCoordinates ? parseFloat(nearCoordinates.longitude) : null;
    if (latitude && longitude) {
        near = [ longitude, latitude ];
    }*/

    var $project = {};
    var cols = columns.split(' ');
    cols.forEach(col => $project[col] = 1);
    $project['distance'] = 1;

    //var placeQuery = null;

    let findQuery = {
        enable: true,
        searchableName: regExKeyword,
    };

    if (user) {
        if (!user._isAdmin) {
            findQuery['$or'] = [
                { createdBy: new ObjectId(user._userId) },
                { reviewStatus: TourReviewStatus.approved }
            ];
        }
    }
    else {
        findQuery.reviewStatus = TourReviewStatus.approved;
    }

    /**
     * Use geo query only if coordinates are defined
     */
    /*if (nearCoordinates) {

        var $geoNear = {
            spherical: true,
            limit: limit,
            near,
            distanceMultiplier: 3959,
            // maxDistance: 60/3959,
            distanceField:'distance',
            query: findQuery
        };

        if (null !== withinDistanceMiles) $geoNear.maxDistance = withinDistanceMiles / 3959;

        placeQuery = Tour.aggregate([
            { $geoNear },
            { $project }
        ]);
    } else {*/
    /**
     * Otherwise perform standard search
     */
    tourpackageQuery = Tour.find(findQuery).limit(limit).lean();
    //}


    return tourpackageQuery.exec();
}

module.exports = searchTours
