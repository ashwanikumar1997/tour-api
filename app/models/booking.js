/**
 * @file BookModel
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
const normalizeForSearch = require("../utils/strings/normalizeforsearch");
const mongoose = require("mongoose");
const Tour = require("./tour");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  //type: { type: String, default: TourPackageType.listing },
  //reviewStatus: { type: String, default: TourReviewStatus.approved },
  enable: { type: Boolean, default: true },
  full_name: String,
  email_address: String,
  searchableName: String,
  tourId: {
    type: Schema.Types.ObjectId,
    ref: "Tour",
    required: true,
  },
  persons: { type: Number },
  children: { type: Number },
  phone: { type: String },
  tour_date: { type: Date },
  no_days: { type: Number },
  trip_finalized: { type: Boolean },
  user: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

BookingSchema.query.active = function () {
  return this.find({ enable: true });
};

BookingSchema.pre("save", function (next) {
  this.searchableName = normalizeForSearch(this.full_name);
  next();
});

// Make sure that source and destination exists on save
BookingSchema.pre("save", async function(next) {
  //For Source
  if (!this.tourId) return next();
 
  await Tour.findById({ _id: this.tourId }, (err, tour) => {
    if (err || !tour) {
      this.tourId = null;
    }
    next();
  });
});
module.exports = mongoose.model("Booking", BookingSchema);
