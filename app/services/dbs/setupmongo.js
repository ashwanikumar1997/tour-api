/**
 * @file Startup mongo using config
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var mongoose = require('mongoose');
var Promise = require('bluebird');

function startMongo(mongoConfig) {
    // mongoose.set('debug', true);
    return new Promise( (resolve, reject) => {
        mongoose.Promise = Promise;

        mongoose.connect(mongoConfig.uri, err => {
            if (err) reject(err);
            else resolve(mongoose);
        });
        return mongoose;
    });
}

module.exports = startMongo