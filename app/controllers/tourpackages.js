/**
 * @file TourPackagesController
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var formatTourPackageForOutput = require("../services/tourpackages/formatforoutput");
var TourPackage = require("../models/tourpackage");
const Tour = require("../models/tour");
var searchTourPackage = require("../services/tourpackages/search");
var restObjectController = require("../services/restobjectcontroller");
var https = require("https");
const Place = require("../models/place");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
var User = require("../models/user");

var TourPackagesController = {
  /**
   * Get all TourPackage
   **/
  //all: restObjectController.all(TourPackage, 'tourpackages'),
  all: (req, res, next) => {
    var results = TourPackage.find()
      .populate({ path: "sourceId", select: "_id name" })
      .populate({ path: "destinationId", select: "_id name" })
      .limit(100)
      .exec(function (err, results) {
        if (err) return next(err);
        var data = {};
        data["tourpackages"] = results.map(function (tourpackage) {
          return formatTourPackageForOutput(tourpackage);
        });
        res.send(data);
      });
  },
  /*findNew: (req, res, next) => {
        const config = req.app.get('config');

        const location = req.query.location,
            keyword = encodeURIComponent(req.query.keyword || ''),
            radius = req.query.radius;
        if (!(location && keyword && radius)) {
            res.status(400).send({
                success: false,
                message: "Missing parameters"
            });
            return;
        }

        let url = `https://maps.googleapis.com/maps/api/tourpackage/nearbysearch/json?type=establishment&key=${config.google.tourpackages.apiKey}&location=${location}&radius=${radius}&keyword=${keyword}`;
        https
            .get(url, (apiRes) => {
                apiRes.setEncoding('utf-8');

                let body = '';
                apiRes.on('data', data => body += data);
                apiRes.on('end', () => {
                    let data = JSON.parse(body);
                    res.status(apiRes.statusCode).send(data);
                });
            })
            .on('error', (err) => {
                res.status(400).send(err);
            });
    
	},*/

  /*findNewDetail: (req, res, next) => {
        const config = req.app.get('config');

        let url = `https://maps.googleapis.com/maps/api/tourpackage/details/json?type=establishment&key=${config.google.tourpackages.apiKey}&placeid=${req.params.googlePlaceId}`;
        https
            .get(url, (apiRes) => {
                apiRes.setEncoding('utf-8');

                let body = '';
                apiRes.on('data', data => body += data);
                apiRes.on('end', () => {
                    let data = JSON.parse(body);
                    res.status(apiRes.statusCode).send(data);
                });
            })
            .on('error', (err) => {
                res.status(400).send(err);
            });
    },

    supported: (req, res, next) => {
        res.send({
            availableLocations: supportedLocations
        })
    },
    ambassador: (req, res, next) => {

        User.find({'badges.badge': UserBadge.ambassador }).then(users => {
            res.send({
                amb: users
            })
        }).catch(next);
    },
	*/
  search: (req, res, next) => {
    if (!req.query.q || req.query.q.length == 0) {
      res.status(400).send({
        success: false,
        message: "Missing q parameter",
        test: req.query,
      });
      return;
    }
    // var latLng = req.query.latlng;

    var limit = 20;
    var columns = "name source destination";
    /* var nearCoordinates = null;
         var withinDistance = null;
 
         if (latLng) {
             var coords = latLng.split(',');
             if (coords.length == 2) {
                 var latitude = coords[0]
                 var longitude = coords[1];
                 nearCoordinates = { latitude, longitude };
             }
         }*/

    searchTourPackages(req.query.q, limit, columns, req.user)
      .then((tourpackages) => {
        res.send({
          tourpackages: tourpackages.map((tourpackage) =>
            formatTourPackageForOutput(tourpackage)
          ),
        });
      })
      .catch(next);
  },

  /*  review: (req, res, next) => {
          Place.find({reviewStatus: PlaceReviewStatus.pending}, (err, results) => {
              if (err) {
                  return next(err);
              }
  
              res.send({
                  tourpackages: results.map(tourpackage => formatTourPackageForOutput(tourpackage))
              });
          });
      },*/

  /**
   * Get a single tourpackage
   **/
  get: async (req, res) => {
    let tourPackageId = req.params.tourpackageId;
    try {
      let tour = await Tour.findById({ _id: tourPackageId }).populate("cityId");

      if (tour) {
        return res
          .status(200)
          .json(new ApiResponse(200, tour, "tour package get successfully"));
      } else {
        return res
          .status(404)
          .json(new ApiError(404, "Tour Package not found"));
      }
    } catch (error) {
      return res
        .status(404)
        .json(new ApiError(404, "Tour Package not found", error));
    }
  },
  /**
   * Create a tourpackage
   **/
  create: (req, res, next) => {
    var body = req.body;
    var days = {};
    var tourPackageStruct = {
      name: body.name,
      description: body.description,
      price: body.price,
    };

    // respect passed review status only if user is an admin
    /*if (req.user.isAdmin()) {
            if (body.reviewStatus) {
                if ( ! isValidPlaceReviewStatusName(body.reviewStatus)) {
                    res.status(400).send({ success: false, message: 'Invalid review status specified' });
                    return;
                }
            }
            placeStruct.reviewStatus = body.reviewStatus || PlaceReviewStatus.approved;
        }
        else {
            placeStruct.reviewStatus = PlaceReviewStatus.pending;
        }*/

    var tourpackage = new TourPackage(tourPackageStruct);

    tourpackage.save(function (err, tourpackage) {
      if (err) return next(err);

      res.send({
        success: true,
        tourpackage: formatTourPackageForOutput(tourpackage),
      });
    });
  },
  /**
   * Update a tourpackage
   **/
  update: (req, res, next) => {
    var tourpackage = req.tourpackage;
    var body = req.body;

    tourpackage.isImportLocked = true;
    tourpackage.name = body.name;
    //console.log('body='+body.featured);
    //console.log('tourpackage='+tourpackage.featured);
    if (body.sourceId) tourpackage.sourceId = body.sourceId;
    if (body.destinationId) tourpackage.destinationId = body.destinationId;
    if (body.days) tourpackage.days = body.days;
    if (body.nights) tourpackage.nights = body.nights;
    if (body.description) tourpackage.description = body.description;
    if (body.featured) {
      tourpackage.featured = body.featured;
    } else {
      tourpackage.featured = false;
    }

    if (body.reviewStatus) {
      if (!isValidTourPackageReviewStatusName(body.reviewStatus)) {
        res
          .status(400)
          .send({ success: false, message: "Invalid review status specified" });
        return;
      }
      tourpackage.reviewStatus = body.reviewStatus;
    }

    tourpackage.save(function (err, tourpackage) {
      if (err) return next(err);

      res.send({
        success: true,
        tourpackage: formatTourPackageForOutput(tourpackage),
      });
    });
  },
  /**
   * Delete a tourpackage
   **/
  /* delete: restObjectController.delete('tourpackage'),
 
     addAddress: (req, res, next) => {
         var tourpackage = req.tourpackage;
         var body = req.body;
 
         var address = {
             type: 'Primary',
             street1: body.street1,
             street2: body.street2,
             city: body.city,
             state: body.state,
             zip: body.zip,
             location: {
                 type: 'Point',
                 coordinates: [ body.longitude, body.latitude ]
             }
         };
 
         tourpackage.addresses.push(address);
 
         tourpackage.save(function(err) {
             if (err) return next(err);
             res.send({
                 success: true
             })
         });
     },
     getAddress: (req, res, next) => {
 
         var tourpackage = req.tourpackage;
         var addressId = req.params.addressId;
 
         var address = tourpackage.addresses.filter(element => {
             return(element.id == addressId);
         })[0];
         if (address) {
             res.send({
                 success: true,
                 address: address
             });
         } else {
             res.status(404).send({
                 success: false,
                 message: 'Address not found'
             });
         }
     },
     updateAddress: (req, res, next) => {
 
         var body = req.body;
         var tourpackage = req.tourpackage;
         var address = req.placeAddress;
 
         address.street1 = body.street1;
         address.street2 = body.street2;
         address.city = body.city;
         address.state =body.state;
         address.zip = body.zip;
         address.location = {
             type: 'Point',
             coordinates: [ body.coordinates.longitude, body.coordinates.latitude ]
         };
 
         tourpackage.save(function(err) {
             if (err) return next(err);
             res.send({
                 success: true,
                 address
             });
         });
     },
     deleteAddress: (req, res, next) => {
         res.send('address');
     },
 
     types: (req, res, next) => {
 
         var types = [];
         for (var elType in PlaceType) {
             types.push({
                 id: elType,
                 name: PlaceType[elType]
             })
         }
 
         res.send({types});
     },
 
     reviewStatuses: (req, res, next) => {
 
         let statuses = [];
         for (let status in PlaceReviewStatus) {
             statuses.push({
                 id: status,
                 name: PlaceReviewStatus[status]
             })
         }
 
         res.send({statuses});
     }*/
};

/*function isValidPlaceTypeName(name) {
    for (var typeKey in PlaceType) {
        if (PlaceType[typeKey] == name) return true;
    }
    return false;
}*/

function isValidTourPackageReviewStatusName(name) {
  for (let typeKey in TourPackageReviewStatus) {
    if (TourPackageReviewStatus[typeKey] === name) return true;
  }
  return false;
}

module.exports = TourPackagesController;
