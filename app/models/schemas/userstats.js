/**
 * @file UserStatsSchema
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var Schema = require('mongoose').Schema;

module.exports = new Schema({
    numLikes: { type: Number, default: 0 },
    numFollowers: { type: Number, default: 0 },
    numFollowing: { type: Number, default: 0 },
    numPlacesFollowing: { type: Number, default: 0 },
    numCategoriesFollowing: { type: Number, default: 0 },
    numPosts: { type: Number, default: 0 }
}, {_id: false});