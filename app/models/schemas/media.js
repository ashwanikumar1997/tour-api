/**
 * @file MediaSchema
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var Schema = require('mongoose').Schema;
var MediaLocation = require('./medialocation');

/**
 * Media schema, allows main media component and variations on that component.  All variations share the root "type".
 * 
 * @example new Media({
 *    type: 'image',
 *    location: {
 *        storageEngine: 'local',
 *        path: '/path/to/file'
 *    },
 *    variations: {
 *        thumbnail: {
 *            storageEngine: 'aws',
 *            path: '/path/to/file'
 *        }
 *    }
 * })
 */
var MediaSchema = new Schema({
    type: String,
    location: MediaLocation,
    variations: {
        thumbnail: MediaLocation
    },
    sortorder: Number
    // status: Uploaded, Transferring, Published
});

module.exports = MediaSchema

