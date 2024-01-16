/**
 * @file TourPackageModel
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
const normalizeForSearch = require("../utils/strings/normalizeforsearch");
//const FeedObjectStatsSchema = require('./schemas/feedobjectstats');
//const TourPackageAddress = require('./schemas/placeaddress');
const AgencyReviewStatus = require("../enums/agencyreviewstatus");
//const Category = require('./category');
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AgencySchema = new Schema({
  //type: { type: String, default: TourPackageType.listing },
  // reviewStatus: { type: String, default: AgencyReviewStatus.approved },
  enable: { type: Boolean, default: true },
  isImportLocked: { type: Boolean, default: false },
  userId:String,
  agency_name: String,
  agencyOwner: String,
  yearOfFounding: String,
  address: String,
  city: String,
  country: String,
  state: String,
  pin_code: String,
  latitude: String,
  phoneNumber1: String,
  phoneNumber2: String,
  email: String,
  Agency_GSTN: String,
  regNumber: String,
  regNumber: String,
  documentUpload: { type: String, contentType: String },
  logoUpload: { type: String, contentType: String },
  profileImage: { type: String, contentType: String },
  galleryPictures: { type: String, contentType: String },
  cretedBy: {
     type: Schema.Types.ObjectId, 
     ref: "User", 
     required: false
     },
});
AgencySchema.query.active = function () {
  return this.find({ enable: true });
};

/*AgencySchema.pre('save', function(next) {
    this.searchableName = normalizeForSearch(this.name);
    next();
});*/

// Make sure that category exists on save
/*AgencySchema.pre('save', function(next) {
    if (!this.categoryId)
        return next();

    Category.findOne({_id: this.categoryId}, (err, category) => {
        if (err || !category) {
            this.categoryId = null;
        }
        next();
    })
});*/

module.exports = mongoose.model("Agency", AgencySchema);
