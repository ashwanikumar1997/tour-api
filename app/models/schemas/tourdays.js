/**
 * @file Folder for saving content
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var Schema = require("mongoose").Schema;

var TourDaysSchema = new Schema({
  count: Number,
  details: [
    {
      day: { type: Number },
      file: { type: String },
      detail: { type: String },
      title: { type: String },
    },
  ],
});

module.exports = TourDaysSchema;
