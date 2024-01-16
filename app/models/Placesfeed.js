var normalizeForSearch = require('../utils/strings/normalizeforsearch');
var TourPackageReviewStatus = require('../enums/tourpackagereviewstatus');
var Place = require('./place');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TourPackageSchema = new Schema({
    reviewStatus: { type: String, default: TourPackageReviewStatus.approved },
    enable: { type: Boolean, default: true },
    isImportLocked: { type: Boolean, default: false },
    name: String,
    searchableName: String,
    cretedBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    price: { type: Number },
    description: String
});

TourPackageSchema.query.active = function () {
    return this.find({ enable: true });
}

TourPackageSchema.pre('save', function (next) {
    this.searchableName = normalizeForSearch(this.name);
    next();
});

module.exports = mongoose.model('TourPackage', TourPackageSchema)