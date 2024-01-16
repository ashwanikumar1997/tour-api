/**
 * @file UserProviderSchema
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var Schema = require('mongoose').Schema;

var UserProvider = new Schema({
    name: String,
    id: String,
    accessToken: String,
    refreshToken: String,
    profile: Object
});

UserProvider.index({ name: 1, id: 1 });

module.exports = UserProvider;