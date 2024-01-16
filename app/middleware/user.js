/**
 * @file Middleware to handle authenticating logged in user tokens
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
//var badgeConfig = require('../../config/badges'); OR IN USE
var User = require('../models/user');
var jwt = require('jsonwebtoken');

class UserAccount {
    constructor(user) {
        this._user = user;
        this._userId = null;
        this._isAdmin = false;

        if (user) this._userId = user._id;
        if (user && true === user.admin) this._isAdmin = user.admin;
    }
    getId() { return this._userId; }
    isUser() {
        return (null !== this._userId);
    }
    isAdmin() {
        return this._isAdmin;
    }
    getModel() {
        return this._user;
    }
    getPostFolders() {
        return this.getModel().getPostFolders();
    }
    addPostFolder(folder) {
        return this.getModel().addPostFolder(folder);
    }
    setPostFolders(folders) {
        return this.getModel().setPostFolders(folders);
    }
    updatePostFolder(folder) {
        return this.getModel().updatePostFolder(folder);
    }
    // getBadges() {
    //     return this.getModel().getBadges();
    // }
    // addBadgeByKey(badgeKey) {
    //     return this.getModel().addBadge({badge: badgeKey});
    // }
    // removeBadgeByKey(badgeKey) {
    //     return this.getModel().removeBadge(badgeKey);
    // }
    save() {
        return this.getModel().save();
    }
}
module.exports = (req, res, next) => {
    const config = req.get('config');

    req.user = new UserAccount();

    // var token = req.body.token || req.query.token || req.headers['x-access-token'];
    const token = req.headers['x-access-token'];

    if (token) {
        const config = req.app.get('config');
        const appKey = config.app.key;

        // Verify token
        jwt.verify(token, appKey, function(err, decoded) {
            if (err) next(err);
            else {
                // if ( ! decoded.provider ||  ! decoded.providerId ||  ! decoded.providerToken ||  ! decoded.userId) {
                if ( ! decoded.userId) {
                    res.status(400).send({
                        success: false,
                        message: 'Authentication is missing data',
                        requireLogin: true
                    })
                } else {
                    User.findOne({_id: decoded.userId}, function(err, user) {
						//console.log(userId);
                        if (err) {
                            res.status(500).send({
                                success: false,
                                message: 'Error while retrieving user account'
                            });
                        } else {
                            // User NOT found
                            if ( ! user) {
                                res.status(500).send({
                                    success: false,
                                    message: 'No associated user account'
                                });
                            // User found
                            } else {
                                // Make sure user ID matches decoded user id value
                                if (user._id != decoded.userId) {
                                    res.status(400).send({
                                        success: false,
                                        message: 'Nice try'
                                    });

                                // Everything looks good, continue on!
                                } else {

                                    req.userId = decoded.userId;
                                    req.user = new UserAccount(user);

                                    next();
                                }
                            }
                        }
                    });

                }
            }
        });
    } else {
        next();
    }
};