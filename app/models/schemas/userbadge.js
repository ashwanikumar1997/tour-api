/**
 * @file UserBadgeModel
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var Schema = require('mongoose').Schema;

var UserBadge = new Schema({
    badge: String, /* e.g. Ambassador @see app/enums/userbadge.js */
    level: String, /* optional value to distinguish between badges of the same type */
}, { _id: false });

module.exports = UserBadge