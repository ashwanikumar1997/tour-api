/**
 * @file TourPackagePackageModel
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var normalizeForSearch = require("../utils/strings/normalizeforsearch");
//var FeedObjectStatsSchema = require('./schemas/feedobjectstats');
//var TourPackagePackageAddress = require('./schemas/placeaddress');
//var TourPackageDays = require('./schemas/tourdays');
var TourPackageReviewStatus = require("../enums/tourpackagereviewstatus");
var Place = require("./place");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TourPackageSchema = new Schema({
  //type: { type: String, default: TourPackagePackageType.listing },
  reviewStatus: { type: String, default: TourPackageReviewStatus.approved },
  enable: { type: Boolean, default: true },
  isImportLocked: { type: Boolean, default: false },
  name: String,
  cityId: String,
  searchableName: String,
  cretedBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
  //tourId: { type: Schema.Types.ObjectId, ref: 'Tour', required: true },
  price: { type: Number },
  description: String,
});
/*TourPackagePackageSchema.index({ enable: 1, name: 1 });
TourPackagePackageSchema.index({ enable: 1, searchableName: 1 }); // standard searchable index
TourPackagePackageSchema.index({ enable: 1, searchableName: 1, 'address.location':'2dsphere' }); // geospatial index
TourPackagePackageSchema.index({ type: 1, enable: 1, searchableName: 1 });
TourPackagePackageSchema.index({ 'dataSource.localese.pid': 1 })
TourPackagePackageSchema.index({ 'dataSources.providerName': 1, 'dataSources.providerId': 1 }, { sparse: true });
TourPackagePackageSchema.index({ reviewStatus: 1 });
TourPackagePackageSchema.index({ name: 'text' });
*/
TourPackageSchema.query.active = function () {
  return this.find({ enable: true });
};

TourPackageSchema.pre("save", function (next) {
  this.searchableName = normalizeForSearch(this.name);
  next();
});

// Make sure that tour exists on save
/*TourPackageSchema.pre('save', function(next) {
	if (!this.tourId)
        return next();
    Tour.findOne({_id: this.tourId}, (err, tour) => {
        if (err || !tour) {
            this.tourId = null;
        }
        next();
    })
});*/

module.exports = mongoose.model("TourPackage", TourPackageSchema);
