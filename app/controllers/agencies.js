/**
 * @file agenciesController
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
const formatAgencyForOutput = require("../services/agencies/formatforoutput");
const Agency = require("../models/agency");
const restObjectController = require("../services/restobjectcontroller");
const https = require("https");
const User = require("../models/user");

const agenciesController = {
  /**
   * Get all Agency
   **/
  all: restObjectController.all(Agency, "agencies"),

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

        let url = `https://maps.googleapis.com/maps/api/agency/nearbysearch/json?type=establishment&key=${config.google.agencies.apiKey}&location=${location}&radius=${radius}&keyword=${keyword}`;
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

        let url = `https://maps.googleapis.com/maps/api/agency/details/json?type=establishment&key=${config.google.agencies.apiKey}&placeid=${req.params.googlePlaceId}`;
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
	
    search: (req, res, next) => {

        if (!req.query.q || req.query.q.length == 0) {
            res.status(400).send({
                success: false,
                message: 'Missing q parameter',
                test: req.query
            });
            return;
        }
        var latLng = req.query.latlng;

        var limit = 20;
        var columns = 'name phone website reservationWebsite addresses address';
        var nearCoordinates = null;
        var withinDistance = null;

        if (latLng) {
            var coords = latLng.split(',');
            if (coords.length == 2) {
                var latitude = coords[0]
                var longitude = coords[1];
                nearCoordinates = { latitude, longitude };
            }
        }

        searchPlaces(req.query.q, limit, columns, nearCoordinates, withinDistance, req.user)
            .then(agencies => {
                res.send({
                    agencies: agencies.map( agency => formatPlaceForOutput(agency) )
                });
            })
            .catch(next);
    },

    review: (req, res, next) => {
        Place.find({reviewStatus: PlaceReviewStatus.pending}, (err, results) => {
            if (err) {
                return next(err);
            }

            res.send({
                agencies: results.map(agency => formatPlaceForOutput(agency))
            });
        });
    },*/

  /**
   * Get a single agency
   **/
  get:  async (req, res) => {
    let userId = req.params.agencyId;
    try {
        const agencies = await Agency.findOne({ userId: userId });
        if(agencies){
           res.json(agencies)
        }else{
            res.status(404).send({message:"your not authorized"})
        }
      } catch (err) {
        console.error('Error:', err);
      }


    // res.send({
    //   // iFollow,
    //   iManage: false,
    //   agency: formatAgencyForOutput(agency, isAdmin),
    // });
    // doIFollowObject(
    //   followingType.users,
    //   req.user.getId(),
    //   followingType.agencies,
    //   agency._id,
    //   (err, iFollow) => {
    //     if (err) {
    //       next(err);
    //       return;
    //     }

    //     res.send({
    //       iFollow,
    //       iManage: false,
    //       agency: formatAgencyForOutput(agency, isAdmin),
    //     });
    //   }
    // );
  },
  /**
   * Create a agency
   **/
  create: async (req, res, next) => {
    let body = req.body;

    let agenciestruct = {
      userId: body.userId,
      agency_name: body.agency_name,
      agencyOwner: body.agencyOwner,
      yearOfFounding: body.yearOfFounding,
      address: body.address,
      city: body.city,
      state: body.state,
      country: body.country,
      pin_code: body.pin_code,
      latitude: body.latitude,
      phoneNumber1: body.phoneNumber1,
      phoneNumber2: body.phoneNumber2,
      email: body.email,
      Agency_GSTN: body.Agency_GSTN,
      regNumber: body.regNumber,
      documentUpload: req.file,
      logoUpload: req.file,
      profileImage: req.file,
      galleryPictures: req.file,
    };

    let agency = new Agency(agenciestruct);

    agency.save(function (err, agency) {
      if (err) return next(err);

      res.send({
        success: true,
        agency: formatAgencyForOutput(agency),
      });
    });
  },
  /**
   * Update a agency
   **/
  update: (req, res, next) => {
    //console.log('there');
    var agency = req.agency;
    var body = req.body;
    agency.isImportLocked = true;
    //Set data

    if (body.c_owner) agency.c_owner = body.c_owner;
    if (body.c_owner) agency.c_owner = body.c_name;
    if (body.name) agency.name = body.name;
    if (body.phone) agency.phone = body.phone;
    if (body.email_id) agency.email_id = body.email_id;
    if (body.website) agency.website = body.website;
    if (body.message) agency.message = body.message;

    if (body.reviewStatus) {
      if (!isValidAgencyReviewStatusName(body.reviewStatus)) {
        res
          .status(400)
          .send({ success: false, message: "Invalid review status specified" });
        return;
      }
      agency.reviewStatus = body.reviewStatus;
    }

    agency.save(function (err, agency) {
      if (err) return next(err);

      res.send({
        success: true,
        agency: formatAgencyForOutput(agency),
      });
    });
  },
  /**
   * Delete a agency
   **/
  /* delete: restObjectController.delete('agency'),

    addAddress: (req, res, next) => {
        var agency = req.agency;
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

        agency.addresses.push(address);

        agency.save(function(err) {
            if (err) return next(err);
            res.send({
                success: true
            })
        });
    },
    getAddress: (req, res, next) => {

        var agency = req.agency;
        var addressId = req.params.addressId;

        var address = agency.addresses.filter(element => {
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
        var agency = req.agency;
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

        agency.save(function(err) {
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

function isValidAgencyReviewStatusName(name) {
  for (let typeKey in AgencyReviewStatus) {
    if (AgencyReviewStatus[typeKey] === name) return true;
  }
  return false;
}

module.exports = agenciesController;
