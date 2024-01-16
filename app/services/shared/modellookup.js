/**
 * @file Creates a model lookup using IDs
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
/**
 * Create lookup for a Model using ids
 *
 * @param Model The model to use for creating the query
 * @param {Array} ids
 * @param Object[] objects
 * @param Object query
 * @param {function} [fnResult] function Creates object from result
 * @param function callback
 */
var Dictionary = require('./dictionary');

function modelLookup(Model, ids, fields, fnResult, callback) {

    var lookup = new Dictionary();

    /**
     * fnResult is optional, so if it is st and callback is null then assume that we need to swap those arguments
     */
    if (typeof(callback) == 'undefined' && typeof(fnResult) == 'function') {
        callback = fnResult;
        fnResult = null;
    }

    if (ids.length == 0) {
        callback(null, lookup);
        return;
    }

    var query = { _id: { $in: ids }};

    Model.find(query, fields).exec( (err, results) => {

        if (err) {
            return callback(err);
        } else {

            results.forEach(result => {

                var lookupValue = (typeof(fnResult) == 'function') ? fnResult(result) : result;
                lookup.set(result._id, lookupValue);

            });
            callback(null, lookup);
        }
    });
}

module.exports = modelLookup