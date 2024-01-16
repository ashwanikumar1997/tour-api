/**
 * @file Update settings for current user
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var InvalidPreferenceValueException = require('../../exceptions/invalidpreferencevalue');
var InvalidPreferenceException = require('../../exceptions/invalidpreference');
var userSettings = require('../../../config/usersettings');
var appConfig = require('../../../config/config');
var validator = require('validator');
var Promise = require('bluebird');

function updateMyself(req, res, next) {

    var body = req.body;
    var preferences = null;
    if (body.settings) preferences = body.settings; // Temporary fix for iOS, which incorrectly sends preferences under "settings"
    else preferences = body.preferences;

    userFromRequest(req)
        .then(user => processPreferences(user, preferences))
        .then(user => {
           return new Promise((next, reject) => {
               user.save(err => {
                   if (err) reject(err);
                   next();
               });
           });
        })
        .then(() => res.send({
            success: true
        }))
        .catch(InvalidPreferenceException, e => {
            res.status(400).send({
                success: false,
                message: e.message
            });
        })
        .catch(InvalidPreferenceValueException, e => {
            res.status(400).send({
                success: false,
                message: e.message
            });
        })
        .catch(err => { next(err); });
}

function userFromRequest(req) {
    return new Promise((fulfill, reject) => {
        var user = req.user;
        if (user && user.isUser()) fulfill(user.getModel());
        else reject(new Error('Missing user'));
    });
}

function processPreferences(user, preferences) {
    /**
     * Promise chain
     * @type {Array}
    **/
    var changes = [];
    var config = appConfig();

    if (Array.isArray(preferences)) {

        preferences.forEach(preference => {

            if (userSettings[preference.name]) {

                var configSetting = userSettings[preference.name];
                var label = configSetting.label;
                var setter = configSetting.setter;
                var validate = configSetting.validate;

                // Run pre-validation, if defined
                if (validate && (validationMessage = validate(preference.value, preference, configSetting)) !== true) {

                    if (validationMessage === false) validationMessage = 'Invalid value for ' + label;

                    changes.push(
                        Promise.reject(
                            new InvalidPreferenceValueException(validationMessage)
                        )
                    );

                } else {

                    changes.push(setter(config, user, preference));

                }

            } else {

                changes.push(Promise.reject(new InvalidPreferenceException('Invalid preference: ' + preference.name)));

            }

        });

        return Promise.all(changes).then(() => {
            return Promise.resolve(user)
        });
    }

    return Promise.reject(new Error('Missing preferences'));
}

module.exports = updateMyself