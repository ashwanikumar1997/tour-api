/**
 * @file Collection of user settings validators
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var InvalidPreferenceValueException = require('../../exceptions/invalidpreferencevalue');
var Promise = require('bluebird');
/**
 * Updates user display name
 * @param config
 * @param user
 * @param preference
 * @returns {Promise}
 */
function updateDisplayName(config, user, preference) {
    var minLength = config.accounts.displayName.minLength;

    return new Promise((fulfill, reject) => {
        if (preference.value && preference.value.length >= minLength) {
            user.name = preference.value;
            fulfill();
        } else {
            reject(new InvalidPreferenceValueException('Display name must be at least ' + minLength + ' characters'));
        }
    })
}
/**
 * Updates user email value (does not commit)
 * @param config
 * @param user
 * @param preference
 * @returns {Promise}
 */
function updateEmail(config, user, preference) {
    return new Promise( (fulfill, reject) => {
        user.email = preference.value;
        fulfill();
    });
}
/**
 * Changes user's password (does not commit)
 * @param config
 * @param user
 * @param preference
 * @returns {Promise}
 */
function changePassword(config, user, preference) {
    var minLength = config.accounts.password.minLength;

    return new Promise((fulfill, reject) => {
        if (preference.value && preference.value.length >= minLength) {
            user.setPassword(preference.value, err => {
                if (err) reject(err);
                else fulfill();
            });
        } else {
            reject(new InvalidPreferenceValueException('Password must be at least ' + minLength + ' characters'));
        }
    });
}
/**
 * Changes a user preference value
 * @param config
 * @param user
 * @param preference
 * @returns {Promise}
 */
function changePreference(config, user, preference) {
    return new Promise(fulfill => {
        user.preferences[preference.name] = preference.value;
        fulfill();
    });
}
/**
 * Change user's location
 * @param config
 * @param user
 * @param preference
 */
function changeLocation(config, user, preference) {
    if (typeof(preference.value) == 'string') return; // Prevent current iOS bug from breaking API
    return changePreference(config, user, preference);
}

module.exports = {
    updateDisplayName,
    updateEmail,
    changePassword,
    changePreference,
    changeLocation
}