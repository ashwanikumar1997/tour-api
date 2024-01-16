/**
 * @file TourPackageModel
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var normalizeForSearch = require("../utils/strings/normalizeforsearch");
//var FeedObjectStatsSchema = require('./schemas/feedobjectstats');
//var TourPackageAddress = require('./schemas/placeaddress');
const TourDays = require("./schemas/tourdays");
const TourReviewStatus = require("../enums/tourreviewstatus");
const Place = require("./place");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TourSchema = new Schema({
  //type: { type: String, default: TourPackageType.listing },
  // reviewStatus: { type: String, default: TourReviewStatus.approved },
  enable: { type: Boolean, default: true },
  isImportLocked: { type: Boolean, default: false },
  agency_name: String,
  tourTitle: String,
  ownerId: String,
  cretedBy: { type: Date, default: Date.now, ref: "Agency", required: false },
  // address: TourPackageAddress,
  // stats: { type: FeedObjectStatsSchema, default: FeedObjectStatsSchema },
  agencyId: String,
  tourDuration: { type: String },
  tourStartCity: { type: String },
  tour_description: String,
  // featured: { type: Boolean, default: false },
  tourImage: Array,

  // tour_excerpt : String,
  // best_time_to_visit: String,
  endTourCity: String,
  tourPackageAmount: { type: String },
  notification: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
  cityId: {
    type: Schema.Types.ObjectId,
    ref: "Place",
  },
  // sale_price: { type: Number },
  // discount_per:{ type: Number },
  /*images: { type: [{
		featured: {type: String, path: String}
	}]},*/
});
/*TourPackageSchema.index({ enable: 1, name: 1 });
TourPackageSchema.index({ enable: 1, searchableName: 1 }); // standard searchable index
TourPackageSchema.index({ enable: 1, searchableName: 1, 'address.location':'2dsphere' }); // geospatial index
TourPackageSchema.index({ type: 1, enable: 1, searchableName: 1 });
TourPackageSchema.index({ 'dataSource.localese.pid': 1 })
TourPackageSchema.index({ 'dataSources.providerName': 1, 'dataSources.providerId': 1 }, { sparse: true });
TourPackageSchema.index({ reviewStatus: 1 });
TourPackageSchema.index({ name: 'text' });
*/
// TourSchema.query.active = function () {
//     return this.find({ enable: true });
// }

// TourSchema.pre('save', function (next) {
//     this.searchableName = normalizeForSearch(this.name);
//     next();
// });

// Make sure that source and destination exists on save
// TourSchema.pre('save', function (next) {
//     //For Source
//     if (!this.sourceId)
//         return next();
//     Place.findOne({ _id: this.sourceId }, (err, place) => {
//         if (err || !place) {
//             this.sourceId = null;
//         }
//         next();
//     })
//For Destination
//For Source
//     if (!this.destinationId)
//         return next();
//     Place.findOne({ _id: this.destinationId }, (err, place) => {
//         if (err || !place) {
//             this.destinationId = null;
//         }
//         next();
//     })

// });
/*function getToursBydestination(destinationId) {
    Tour.find({destinationId: destinationId}, (err, tours) => {
		if (err) {
			
			return {
				success: false,
				message: "Internal error occurred when listing tours."
			};
		}
		return {
			tours: tours.map(tour => formatTourForOutput(tour))
		};
	});
});	
*/
module.exports = mongoose.model("Tour", TourSchema);
