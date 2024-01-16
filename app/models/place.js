/**
 * @file PlaceModel
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
const normalizeForSearch = require('../utils/strings/normalizeforsearch');
//var PlaceType = require('../enums/placetype');
//var Category = require('./category');
const mongoose = require('mongoose');
const Mongo2dSphere = require('./schemas/2dsphere');

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    enable: { type: Boolean, default: true },
    isImportLocked: { type: Boolean, default: false },
    name: String,
    searchableName: String,
    parentId: { type: Schema.Types.ObjectId, required: false },
    location: { type: Mongo2dSphere },
    city: String,
    state: String,
    zip: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    featured: { type: Boolean, default: false },
    images: {
        featured: { type: { type: String }, path: String }
    }
    // parentId: { type: Schema.Types.ObjectId, required: false }
    // location: {    }
    /*dataSources: [
        {
            providerId: String,
            providerName: String,
            // dataFields: {}, // @TODO Lock specific fields to this data source
            data: {}
        }
    ]*/
});

//PlaceSchema.index({ enable: 1, name: 1 });
PlaceSchema.index({ enable: 1, searchableName: 1 }); // standard searchable index
PlaceSchema.index({ enable: 1, searchableName: 1, 'location': '2dsphere' }); // geospatial index
PlaceSchema.index({ type: 1, enable: 1, searchableName: 1 });
//PlaceSchema.index({ 'dataSource.localese.pid': 1 })
//PlaceSchema.index({ 'dataSources.providerName': 1, 'dataSources.providerId': 1 }, { sparse: true });
//PlaceSchema.index({ name: 'text' });

PlaceSchema.query.active = function () {
    return this.find({ enable: true });
}

PlaceSchema.pre('save', function (next) {
    this.searchableName = normalizeForSearch(this.name);
    next();
});

// Make sure that category exists on save
/*PlaceSchema.pre('save', function(next) {
    if (!this.categoryId)
        return next();

    Category.findOne({_id: this.categoryId}, (err, category) => {
        if (err || !category) {
            this.categoryId = null;
        }
        next();
    })
});*/




// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const placeSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    city: {
        type: String
    },
    price: {
        type: String
    },
    info: {
        type: String
    },
    time: {
        type: String
    },
    city_img:{
        type:String
    }
}, {
   timestamps:true
})
// module.exports = mongoose.model('Place', placeSchema)
module.exports = mongoose.model('Place', PlaceSchema)