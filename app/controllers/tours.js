/**
 * @file ToursController
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
const formatTourForOutput = require("../services/tours/formatforoutput");
const Tour = require("../models/tour");
const searchTours = require("../services/tours/search");
//var handleMediaUpload = require('./tours/mediaupload');
const handleMediaUpload = require("../services/mediaupload");
//var handleTourMediaUpload = require('../services/mediatourupload');
const restObjectController = require("../services/restobjectcontroller");
const https = require("https");
const User = require("../models/user");
const Agency = require("../models/agency");
const upload = require("../fileupload/handleFileUpload");

const ToursController = {
  /**
   * Get all Tour
   **/
  //all: restObjectController.all(Tour, 'tours'),
  all: (req, res, next) => {
    let results = Tour.find()
      .limit(100)
      .exec(function (err, results) {
        if (err) return next(err);
        res.send(results);
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

        let url = `https://maps.googleapis.com/maps/api/tour/nearbysearch/json?type=establishment&key=${config.google.tours.apiKey}&location=${location}&radius=${radius}&keyword=${keyword}`;
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

        let url = `https://maps.googleapis.com/maps/api/tour/details/json?type=establishment&key=${config.google.tours.apiKey}&placeid=${req.params.googlePlaceId}`;
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

    searchTours(req.query.q, limit, columns, req.user)
      .then((tours) => {
        res.send({
          tours: tours.map((tour) => formatTourForOutput(tour)),
        });
      })
      .catch(next);
  },

  /* review: (req, res, next) => {
          Place.find({reviewStatus: PlaceReviewStatus.pending}, (err, results) => {
              if (err) {
                  return next(err);
              }
     
              res.send({
                  tours: results.map(tour => formatTourForOutput(tour))
              });
          });
      },*/

  /**
   * Get a single tour
   **/
  get: async (req, res) => {
    let ownerId = req.params.tourId;

    try {
      const tours = await Tour.find({ ownerId: ownerId });
      if (tours !== null) {
        res.json(tours);
      } else {
        res.status(404).send({ message: "agency have not any packages" });
      }
    } catch (err) {
      console.error("Error:", err);
    }
  },

  getTourByCityName: async (req, res) => {
    let city = req.params.cityName;
    console.log("city",city);

    try {
      const tours = await Tour.findOne({ endTourCity: city });
      if (tours !== null) {
        res.status(200).json(tours);
      } else {
        res.status(404).send({ message: "agency have not any packages" });
      }
    } catch (err) {
      res.status(400).send({ message: "agency have error while finding packages" }, err);
    }
  },

  // getTourByPlace: restObjectController.getMulti(['tour'], (req, res, tour, next) => {
  //     var isAdmin = req.user.isAdmin();
  //     res.send({
  //         iManage: false,
  //         tour: formatTourForOutput(tour, isAdmin)
  //     });
  // }),

  // getTourByPlace: restObjectController.getMulti(['tours'], function (req, res, tours, next) {
  //     res.send({
  //         success: tours,
  //     });
  // }),

  getTourByPlace: (req, res, tour, next) => {
    // console.log('req');
    // console.log(req);
    //console.log('req');
    // var query = { sourceId: "5d79d68ab0544a1af4cc24de" };
    // console.log(query);
    // res.send({
    //   tours: "query",
    // });
    // Tour.find(query).toArray(function (err, results) {
    //     if (err) throw err;
    //     results.send({
    //         tours: results.map(tour => formatTourForOutput(tour))
    //     });
    // });
  },

  /**
   * Create a tour
   **/
  create: async (req, res, next) => {
    try {
      upload.array("tourImage", 10)(req, res, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error uploading file" });
        }

        let body = req.body;
        let userId = req.body.ownerId;

        const agency_Id = await Agency.findOne({ userId });

        if (!agency_Id) {
          return res.status(401).json({ message: "Agency owner not found" });
        }

        let tourImages = req.files;
        let newImages = [];
        await tourImages.map((image) => {
          let obj = {
            originalname: image.originalname,
            mimetype: image.mimetype,
            filename: image.filename,
            data: image.buffer,
          };
          newImages.push(obj);
        });

        let tourStruct = {
          agency_name: body.agency_name,
          tourTitle: body.tourTitle,
          agencyId: agency_Id._id,
          ownerId: userId,
          endTourCity: body.endTourCity,
          tourDuration: body.tourDuration,
          tourImage: newImages,
          isImportLocked: true,
          tourStartCity: body.tourStartCity,
          tourPackageAmount: body.tourPackageAmount,
        };

        let tour = new Tour(tourStruct);

        tour.save(function (err, tour) {
          if (err) return next(err);
          res.send({
            success: true,
            message: "data saved",
          });
        });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error creating tour" });
    }
  },
  /**
   * Update a tour
   **/
  update: (req, res, next) => {
    var tour = req.tour;
    var body = req.body;
    tour.isImportLocked = true;
    tour.name = body.name;
    //console.log('body='+body.featured);
    //console.log('tour='+tour.featured);
    if (body.sourceId) tour.sourceId = body.sourceId;
    if (body.destinationId) tour.destinationId = body.destinationId;
    if (body.days) tour.days = body.days;
    if (body.nights) tour.nights = body.nights;
    if (body.description) tour.description = body.description;
    if (body.featured) {
      tour.featured = body.featured;
    } else {
      tour.featured = false;
    }
    if (body.age_group) tour.age_group = body.age_group;
    if (body.best_time_to_visit)
      tour.best_time_to_visit = body.best_time_to_visit;
    if (body.availability) tour.availability = body.availability;
    if (body.cost_price) tour.cost_price = body.cost_price;
    if (body.discount_per) tour.discount_per = body.discount_per;
    if (body.tour_excerpt) tour.tour_excerpt = body.tour_excerpt;
    if (body.reviewStatus) {
      if (!isValidTourReviewStatusName(body.reviewStatus)) {
        res
          .status(400)
          .send({ success: false, message: "Invalid review status specified" });
        return;
      }
      tour.reviewStatus = body.reviewStatus;
    }

    tour.save(function (err, tour) {
      if (err) return next(err);

      res.send({
        success: true,
        tour: formatTourForOutput(tour),
      });
    });
  },

  handleMediaUpload: (req, res, next) => {
    var result = handleMediaUpload(Tour, "tourId", "tours", req);
    res.send(result);
  },

  /*handleTourMediaUpload: (req, res, next) => {
        var result = handleTourMediaUpload(Tour, "tourId", 'tours', req);
        res.send(result);
    },*/

  /**
   * Delete a tour
   **/
  delete: restObjectController.delete("tour"),
  /*
    addAddress: (req, res, next) => {
        var tour = req.tour;
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

        tour.addresses.push(address);

        tour.save(function(err) {
            if (err) return next(err);
            res.send({
                success: true
            })
        });
    },
    getAddress: (req, res, next) => {

        var tour = req.tour;
        var addressId = req.params.addressId;

        var address = tour.addresses.filter(element => {
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
        var tour = req.tour;
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

        tour.save(function(err) {
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

function isValidTourReviewStatusName(name) {
  for (let typeKey in TourReviewStatus) {
    if (TourReviewStatus[typeKey] === name) return true;
  }
  return false;
}

module.exports = ToursController;
