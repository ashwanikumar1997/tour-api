/**
 * @file BookingsController
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var formatBookingForOutput = require("../services/bookings/formatforoutput");
var Booking = require("../models/booking");
var searchBookings = require("../services/bookings/search");
var restObjectController = require("../services/restobjectcontroller");
var https = require("https");

var BookingsController = {
  /**
   * Get all Booking
   **/
  //all: restObjectController.all(Booking, 'Bookings'),
  all: (req, res, next) => {
    var results = Booking.find()
      .populate({ path: "tourId", select: "_id name" })
      .limit(100)
      .exec(function (err, results) {
        if (err) return next(err);
        var data = {};
        data["Bookings"] = results.map(function (Booking) {
          return formatBookingForOutput(Booking);
        });
        res.send(data);
      });
  },
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
    searchBookings(req.query.q, limit, columns, req.user)
      .then((bookings) => {
        res.send({
          bookings: bookings.map((booking) => formatBookingForOutput(booking)),
        });
      })
      .catch(next);
  },
  /**
   * Get a single Booking
   **/
  get: restObjectController.get("Booking", (req, res, booking, next) => {
    var isAdmin = req.user.isAdmin();
    res.send({
      iManage: false,
      booking: formatBookingForOutput(booking, isAdmin),
    });
  }),
  //type: { type: String, default: TourPackageType.listing },
  //reviewStatus: { type: String, default: TourReviewStatus.approved },
  /**
   * Create a Booking
   **/
  create: (req, res, next) => {
    let body = req.body;

    let bookingStruct = {
      full_name:body.full_name,
      persons: body.persons,
      children: body.children,
      phone: body.phone,
      tour_date: body.tour_date,
      email_address: body.email_address,
      trip_finalized: body.trip_finalized,
      tourId:body.tourId,
      no_days: body.no_days,
    };
    console.log(bookingStruct);
    let booking = new Booking(bookingStruct);
    booking.save(function (err, booking) {
      if (err) return next(err);
      console.log(booking);
      // res.send({
      //   success: true,
      //   booking: formatBookingForOutput(booking),
      // });
    });
  },
  /**
   * Update a Booking
   **/
  /*update: (req, res, next) => {
        let Booking = req.Booking;
        let body = req.body;
        Booking.isImportLocked = true;
        Booking.name = body.name;
        //console.log('body='+body.featured);
        //console.log('Booking='+Booking.featured);
        if (body.sourceId) Booking.sourceId = body.sourceId;
        if (body.destinationId) Booking.destinationId = body.destinationId;
        if (body.days) Booking.days = body.days;
        if (body.nights) Booking.nights = body.nights;
        if (body.description) Booking.description = body.description;
        if (body.featured) { Booking.featured = body.featured } else { Booking.featured = false };

        if (body.reviewStatus) {
            if (!isValidBookingReviewStatusName(body.reviewStatus)) {
                res.status(400).send({ success: false, message: 'Invalid review status specified' });
                return;
            }
            Booking.reviewStatus = body.reviewStatus;
        }

        Booking.save(function (err, Booking) {
            if (err) return next(err);

            res.send({
                success: true,
                Booking: formatBookingForOutput(Booking)
            });
        });
    },

    // handleMediaUpload: (req, res, next) => {
    //     let result = handleMediaUpload(Booking, "BookingId", 'Bookings', req);
    //     res.send(result);
    // },


    handleBookingMediaUpload: (req, res, next) => {
        let result = handleBookingMediaUpload(Booking, "BookingId", 'Bookings', req);
        res.send(result);
    },*/

  /**
   * Delete a Booking
   **/
  delete: restObjectController.delete("bookings"),
};

function isValidBookingReviewStatusName(name) {
  for (let typeKey in BookingReviewStatus) {
    if (BookingReviewStatus[typeKey] === name) return true;
  }
  return false;
}
module.exports = BookingsController;
