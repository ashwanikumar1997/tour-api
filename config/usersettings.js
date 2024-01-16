/**
 * @file User settings configuration
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var settingUpdator = require('../app/services/accounts/settingupdator');
var InputType = require('../app/enums/inputtype');
var Gender = require('../app/enums/gender');
var validator = require('validator');

module.exports = {
    // "name" is temporary fix for iPhone
    name: {
        label: 'Name',
        getter: user => user.name,
        setter: settingUpdator.updateDisplayName,
        inputType: InputType.text
    },
    displayName: {
        label: 'Name',
        getter: user => user.name,
        setter: settingUpdator.updateDisplayName,
        inputType: InputType.text
    },
    email: {
        label: 'Email',
        getter: user => user.email,
        setter: settingUpdator.updateEmail,
        inputType: InputType.text,
        validate: validator.isEmail
    },
    password: {
        label: 'Password',
        // getter: user => null,
        setter: settingUpdator.changePassword,
        inputType: InputType.password
    },
    gender: {
        label: 'Gender',
        getter: user => user.preferences.gender,
        setter: settingUpdator.changePreference,
        inputType: InputType.select,
        options: Gender,
        validate: val => {
            // if ( ! val) return true;
            // else if ( ! Gender[val]) return false;
            return true;
        }
    },
    location: {
        label: 'Location',
        getter: user => user.preferences.location,
        setter: settingUpdator.changeLocation,
        inputType: InputType.locationSearch,
    },
    radius: {
        label: 'Radius',
        getter: user => user.preferences.radius,
        setter: settingUpdator.changePreference,
        inputType: InputType.slider,
        defaultValue: 20,
        minValue: 5,
        maxValue: 50,
        validate: (val, preference, settingConfig) => {
            if ( ! validator.isNumeric(val)) return false;
            else if (val < settingConfig.minValue) return 'Value must be greater than ' + settingConfig.minValue;
            else if (val > settingConfig.maxValue) return 'Value must be less than ' + settingConfig.maxValue;
            else return true;
        }
    }
}