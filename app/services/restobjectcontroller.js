/**
 * @file Helper methods for common controller actions
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
module.exports = {
    /**
     * Get all results
     **/
    all: (Model, resultsKey) => {
        return (req, res, next) => {
            Model.find().limit(100).exec(function (err, results) {
                if (err) return next(err);

                var data = {};
                data[resultsKey] = results;
                res.send(data);
            });
        };
    },

    /**
     * Get a single result
     * @param string reqInstanceKey The key where an object is cached
     **/
    get: (reqInstanceKey, callback) => {
        return (req, res, next) => {
            if (req[reqInstanceKey]) {

                let obj = req[reqInstanceKey];

                if (callback) {
                    callback(req, res, obj, next);
                } else {
                    res.send(obj);
                }

            } else {

                res.status(404).send({ success: false, message: 'Unable to find requested object' });

            }
        };
    },


    /**
     * Ensures that keys exist within the request object
     *
     * Used in conjuction with Express route.param('paramId',...)
     *
     * @param reqInstanceKey
     * @param callback
     * @returns {function(*=, *=, *=)}
     * @example
     * 1. First setup a route param to a request object based on an ID:
     *     route.param('categoryId', function(req, res, next, categoryId) { req.category = getCategoryById(categoryId); });
     *
     * 2. Next setup a route to use the newly set request object
     *     route.get('/category/:categoryId', restObjectController.getMulti(['category'], function(req, res, category, next) {}))
     *
     * When multiple keys are passed in reqInstanceKeys then those values will be mapped to the return in the same order, e.g.
     *     route.get('/category/:categoryId/filters/:filterId', restObjectController.getMulti(['category', 'filter'], function(req, res, category, filter, next) {}...
    **/

    getMulti: (reqInstanceKeys, callback) => {

        return (req, res, next) => {
            if (Array.isArray(reqInstanceKeys)) {

                var argStack = [req, res];
                var i;

                for (i = 0, j = reqInstanceKeys.length; i < j; i++) {

                    var reqInstanceKey = reqInstanceKeys[i];

                    if (req[reqInstanceKey]) {

                        var obj = req[reqInstanceKey];
                        argStack.push(obj);

                    } else {

                        res.status(404).send({ success: false, message: 'Unable to find requested object: ' + reqInstanceKey });
                        return;

                    }

                }

                argStack.push(next);

                callback.apply(null, argStack);

            } else {
                res.status(500).send({ success: false, message: 'Ill formatted reqInstanceKeys' });
            }
        };
    },

    /**
     * 
     * Create an object
     * 
    **/
    // create: (Model, req, res, next) => {
    //     var obj = new Model({
    //         name: req.body.name,
    //         parentId: 0
    //     });
    //     obj.save(function(err, obj) {
    //         res.send(obj);
    //     });
    // },

    /**
     * 
     * Update a category
     * 
    **/
    // update: (req, res, next) => {
    //     var category = req.category;
    //     category.name = req.body.name;
    //
    //     category.save(function(err, category) {
    //         if (err) return next(err);
    //
    //         res.send(category);
    //     });
    // },

    /**
     * 
     * Delete an object
     * 
    **/
    delete: (reqInstanceKey, req, res, next) => {
        return (req, res, next) => {
            var obj = req[reqInstanceKey];
            console.log(req)
            obj.remove(function (err) {
             if (err) return next(err);
            res.send({ success: true });
            });
        };
    }
};