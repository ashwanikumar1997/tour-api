/**
 * @file Folder for saving content
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var Schema = require('mongoose').Schema;

var FolderSchema = new Schema({
    name: String,
    itemCount: Number,
    note: { type: String, default: '' }
});

module.exports = FolderSchema