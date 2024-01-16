const formatPlaceForOutput = require('../services/places/formatforoutput');
const Place = require('../models/place');

const feeds = {
    homePlacesfeed: (req, res, next) => {
        Place.find().limit(6).exec(
            function (err, results) {
                if (err) return next(err);
                var data = {};
                data['places'] = results.map(function (place) {
                   
                    return formatPlaceForOutput(place);
                    
                });
                res.send(results);
               
            }
        )
    },
    featured: (req, res, next) => {
        Place.find({ 'featured': true }).exec(
            function (err, results) {
                if (err) return next(err);
                var data = {};
                data['featured'] = results.map(function (place) {
                    return formatPlaceForOutput(place);
                });
                res.send(data);
            }
        )
    },
};

module.exports = feeds