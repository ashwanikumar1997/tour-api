/**
 * @file MediaLocationSchema
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var Schema = require('mongoose').Schema;

module.exports = new Schema({
    storageEngine: String,
    storageId: String,
    path: String,
    body: String
    //mediaType: ['Image', 'Video']
});