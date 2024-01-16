/**
 * @file UserStatsSchema
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var Schema = require('mongoose').Schema;

module.exports = new Schema({
    numFollowers: { type: Number, default: 0 },
    numLikes: { type: Number, default: 0 },
    numPosts: { type: Number, default: 0 }
}, {_id: false});