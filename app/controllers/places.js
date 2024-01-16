/**
 * @file PlacesController
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
const formatPlaceForOutput = require("../services/places/formatforoutput");
const formatTourForOutput = require("../services/tours/formatforoutput");
const restObjectController = require("../services/restobjectcontroller");
//var doIFollowObject = require('../services/following/doifollowobject');
const searchPlaces = require("../services/places/search");
//var handleMediaUpload = require('./places/mediaupload');
const handleMediaUpload = require("../services/mediaupload");
const getToursBydestination = require("../services/tours/getplacerelatedtours");
//var followingType = require('../enums/feedobjecttype');
//var PlaceType = require('../enums/placetype');
const Place = require("../models/place");
const Tour = require("../models/tour");
const https = require("https");
//var supportedLocations = require('../bandaids/supportedlocations');
const UserBadge = require("../enums/userbadge");
const User = require("../models/user");
const tours = require("../controllers/tours");

const PlacesController = {
  /**
   * Get all places
   **/
  //all: restObjectController.all(Place, 'places'),
  all: (req, res, next) => {
    var results = Place.find()
      .limit(100)
      .populate({ path: "parentId" })
      .populate({ path: "createdBy" })
      .exec(function (err, results) {
        // console.log(results);
        if (err) return next(err);
        const data = {};

        data["places"] = results.map(function (place) {
          return formatPlaceForOutput(place);
        });

        res.send(results);
      });
  },
  ambassador: (req, res, next) => {
    User.find({ "badges.badge": UserBadge.ambassador })
      .then((users) => {
        res.send({
          amb: users,
        });
      })
      .catch(next);
  },

  search: (req, res, next) => {
    const searchquery = req.query.place;

    // Find all documents in the collection
    Place.collection.find({}).toArray((err, documents) => {
      if (err) {
        console.error("Error fetching documents:", err);
        return;
      }
      const filterCity = documents.filter((city) =>
        city.city.toLowerCase().includes(searchquery)
      );
      res.send(filterCity);
      return;
    });

    // Place.find(query, (err, matchingPlaces) => {
    //   console.log("matchingPlaces", matchingPlaces);
    // });

    // searchPlaces(
    //   req.query.q,
    //   limit,
    //   columns,
    //   nearCoordinates,
    //   withinDistance,
    //   req.user
    // )
    //   .then((places) => {
    //     res.send({
    //       places: places.map((place) => formatPlaceForOutput(place)),
    //     });
    //   })
    //   .catch(next);
  },

  /**
   *
   * Get a single place
   *
   **/
  get: (req, res) => {
    let place_id = { _id: req.params.placeId };

    Place.findById(place_id, (err, data) => {
      if (data !== 0) {
        res.json(data);
      } else {
        res.send({
          err: err,
          message: "Something went wrong?",
        });
      }
    });
  },

  /**
   * Create a place
   **/
  create: (req, res, next) => {
    const body = req.body;

    var placeStruct = {
      city: body.city,
      info: body.info,
      distance: body.distance,
      time: body.time,
      language: body.language,
      city_img: body.city_img,
      createdBy: req.userId,
    };

    const place = new Place(placeStruct);

    place.save(function (err, place) {
      if (err) return next(err);
      res.send({
        success: true,
        place: place,
      });
    });
  },

  /**
   *
   * Update a place
   *
   **/
  update: (req, res, next) => {
    var place = req.place;
    var body = req.body;

    if (body.name) place.name = body.name;
    if (body.parentId) place.parentId = body.parentId;
    if (body.city) place.city = body.city;
    if (body.state) place.state = body.state;
    if (body.zip) place.zip = body.zip;
    if (body.featured) {
      place.featured = body.featured;
    } else {
      place.featured = false;
    }
    if (body.coordinates) {
      place.location = {
        type: "Point", //not working
        coordinates: [body.coordinates.longitude, body.coordinates.latitude],
      };
    }
    //console.log(place.address.location);
    place.location.type = "Point";
    place.isImportLocked = true;

    /*if (body.type) {
            if ( ! isValidPlaceTypeName(body.type)) {
                res.status(400).send({ success: false, message: 'Invalid type specified' });
                return;
            }
            place.type = body.type;
        }*/

    place.save(function (err, place) {
      if (err) return next(err);

      res.send({
        success: true,
        place: formatPlaceForOutput(place),
      });
    });
  },
  //handleMediaUpload: handleMediaUpload,
  handleMediaUpload: (req, res, next) => {
    var result = handleMediaUpload(Place, "placeId", "places", req);
    // console.log(result);
    res.send(result);
  },

  /**
   * Delete a place
   **/
  delete: restObjectController.delete("place"),

  /**
   * get list of places
   **/
  placesList: (req, res, next) => {
    var places_list = [];
    Place.find({}, { name: true, _id: true }, function (err, places) {
      places.forEach(function (place) {
        //places_list[place._id]={'id':place._id,'name':place.name};
        places_list.push({
          id: place._id,
          name: place.name,
        });
      });
      res.send({ results: places_list });
    });
  },
  relatedTours: (req, res, next) => {
    Place.findById(req.params.id, (err, place) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Internal error occurred when getting place.",
        });
      }
      var data = {};
      data["place"] = formatPlaceForOutput(place);
      getrelatedtours(req.params.id, function (result) {
        data["tours"] = result.tours;
        res.send(data);
      });
    });
    function getrelatedtours(destinationId, callback) {
      // after some calculation
      Tour.find({ destinationId: destinationId }, (err, tours) => {
        if (err) {
          return {
            success: false,
            message: "Internal error occurred when listing tours.",
          };
        }
        callback({ tours: tours.map((tour) => formatTourForOutput(tour)) });
      });
    }
  },
};
/*
	
	//relatedTours(destinationId, function(tours_data) {
		//console.log(tours_data);
		//callback(tours_data);function relatedTours(destinationId, callback) {
		// after some calculation
		Tour.find({destinationId: destinationId}, (err, tours) => {
				if (err) {
					return {
						success: false,
						message: "Internal error occurred when listing tours."
					};
				}
				//var data={}
				//data['tours'] = {tours: tours.map(tour => formatTourForOutput(tour))}
				callback({tours: tours.map(tour => formatTourForOutput(tour))});
				//return {tours: tours.map(tour => formatTourForOutput(tour))};
			});
		
		}
	}
};*/
//relatedTours: (req, res, next) => {
/* Place.findById(placeId, function (err, place) {
           
            });
            res.send({ 'results': places_list });
        });*/
//console.log(req.params.placeId);
/*	var data = {};
		Place.findById(req.params.placeId, (err, place) => {
            //if (err) reject(err);
            //else if ( ! place) reject(new Error('Invalid place ID'));
            if (err) {
                    res.status(500).send({
                        success: false,
                        message: "Internal error occurred when getting place."
                    });
                    return;
                }
			//console.log(getToursBydestination(res, place._id));
			//var related_tours=getToursBydestination(place.destinationId);
			//console.log(related_tours);
			//data = {'place':formatPlaceForOutput(place),'related_tours':related_tours};
			var data = {};
			//var tours=Tour.find({destinationId: place._id});
			//console.log(tours._id);
			data['place']=formatPlaceForOutput(place);
			//data['related_tours'] = {tours: tours.map(tour => formatTourForOutput(tour))};
            console.log(getToursBydestination(place._id));

			data['related_tours']=getToursBydestination(place._id);

//console.log(result);
				//res.send(data);
			//res.send({place:formatPlaceForOutput(place)});
			//res.send({'place':formatPlaceForOutput(place),'related_tours':related_tours});
			//res.send(data);
        });
		//console.log(results);
		/*var results2 = Tour.find({destinationId: destinationId}, (err, tours) => {
		if (err) {
			return {
				success: false,
				message: "Internal error occurred when listing tours."
			};
		}
		var test = {tours: tours.map(tour => formatTourForOutput(tour))};
		//console.log({tours: tours.map(tour => formatTourForOutput(tour))})
		//return test.tours;
		//return ['test','heloo'];
		var data = {};
            data['tours'] = tours.map(function (tour) {
                return formatTourForOutput(tours);
            });
		//return [{tours: tours.map(tour => formatTourForOutput(tour))}];
		return data;
		//res.send({tours: tours.map(tour => formatTourForOutput(tour))});
	//	return {tour:{id:20}}
	});*/
//res.send(results2);
//console.log(place);
//var isAdmin = req.user.isAdmin();
// res.send({
//     iManage: false,
//     place: formatPlaceForOutput(place, isAdmin),
// });

//  let data = {};
//console.log(place);
//PostLike.find({like: true, postId: new ObjectId(req.params.postId)}, processActionObjects);
//  data = {'place':formatPlaceForOutput(place),'related_tours':getToursBydestination(place._id)};
//console.log(getToursBydestination(place._id));
//data['related_tours']=getToursBydestination(place._id);
//console.log(place._id);
//console.log('ddddddddddd');
//Tour.find({destinationId: place._id}, (err, tours) => {
//	console.log(tours);
//console.log('-----------------');
//users: users.map(user => formatUserForOutput(user))
//data['related_tours']=tours.map(tour => formatTourForOutput(tour));
//console.log(data['related_tours']);
//});
////data['related_tours']=related_tours.tours;
//console.log(data);
//res.send(data);
/**
 * Retrieves users basing on "createdBy" field and returns them in a response.
 */
/* function processActionObjects(err, results) {
            let destination_id = results.map(result => result.destinationId);

           Tour.find({destinationId: destination_id}, (err, tours) => {
                if (err) {
                    res.status(500).send({
                        success: false,
                        message: "Internal error occurred when listing tours."
                    });
                    return;
                }
                res.send({
                    users: users.map(tour => formatTourForOutput(tour))
                });
            });
        }*/
/*function getToursBydestination(destinationId){
			Tour.find({destinationId: destinationId}, (err, tours) => {
				if (err) {
					return {
						success: false,
						message: "Internal error occurred when listing tours."
					};
				}
				return {tours: tours.map(tour => formatTourForOutput(tour))};
			});
		}*/

//Place.find({like: true, postId: new ObjectId(req.params.postId)}, processActionObjects);
//},Place.findById(req.params.placeId, (err, place) => {
//	}
/*getToursBydestination: (destinationId) => {
		var results = Tour.find({destinationId: destinationId}, (err, tours) => {
			if (err) {
				return {
					success: false,
					message: "Internal error occurred when listing tours."
				};
			}
			return {tours: tours.map(tour => formatTourForOutput(tour))};
		});
	},*/
//relatedTours: restObjectController.get('place', (req, res, place, next) => {
/*relatedTours: (req, res, next) => { 
var id=req.params.placeId;
var userBlogs = function(id, next) {
Place.find({_id: req.params.placeId}, function(err, place) {
if (err) {

} else {
next(place)
}
})
}
userBlogs(id, function(place) {

res.send({'place':formatPlaceForOutput(place),'related_tours':getToursBydestination(place.place_id)});
})*/

/*function isValidPlaceTypeName(name) {
    for (var typeKey in PlaceType) {
        if (PlaceType[typeKey] == name) return true;
    }
    return false;
}*/
/**
 *
 * Return list of relatedTours
 *
 **/

module.exports = PlacesController;
