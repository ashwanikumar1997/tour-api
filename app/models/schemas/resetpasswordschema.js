/**
 * @file ResetPasswordSchema
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var Schema = require('mongoose').Schema;

var ResetPasswordSchema = new Schema({
    codeRequested: { type: Date, default: Date.now },
    code: { type: String },
    numAttempts: { type: Number, default: 0 }
});