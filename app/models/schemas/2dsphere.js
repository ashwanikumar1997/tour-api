/**
 * @file 2d sphere schema
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
const Schema = require('mongoose').Schema;

const Mongo2dSphere = new Schema({
    type: String,
    coordinates: [Number]
});

module.exports = Mongo2dSphere;