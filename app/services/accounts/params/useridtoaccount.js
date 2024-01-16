/**
 * @file Converts profile id URL param to user
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var User = require('../../../models/user');

module.exports = routes => {

    routes.param('userId', function (req, res, next, userId) {

        User.findById(userId, function (err, user) {
            if (err) next(err);
            // if (!user) res.status(404).send({success: false, message: 'Unable to find requested user'});

            req.account = user;

            next();
        });

    });
}