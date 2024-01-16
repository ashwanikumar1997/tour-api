/**
 * @file UserModel
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
const normalizeForSearch = require('../utils/strings/normalizeforsearch');
const ResetPasswordSchema = require('./schemas/resetpasswordschema');
//const UserProviderSchema = require('./schemas/userprovider');
//const UserBadgeSchema = require('./schemas/userbadge');
//const UserStatsSchema = require('./schemas/userstats');
//const FolderSchema = require('./schemas/folder');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
    created: { type: Date, default: Date.now },
    accountType: String,
    name: String, 
    email: String,
    password: String,
    admin: { 
        type: Boolean, 
        default: false
     },
    resetPassword: ResetPasswordSchema,
   /* preferences: {
        gender: String,
        location: {
            label: String,
            coordinates: {
                latitude: Number,
                longitude: Number
            },
        },
        radius: Number,
    },
    devices: [
        {
            id: { type: String, default: '' },
            name: { type: String, default: '' },
            os: {
                name: String,
                version: String
            },
            notifications: {
                token: String, // device native notifcation token
                fcmToken: String, // Google Firebase token
            },
            app: {
                version: String,
                build: String
            }
        }
    ],*/
   // badges: [ UserBadgeSchema ]
});

UserSchema.index({ name: 1 });
UserSchema.index({ name: 'text' });
//UserSchema.index({ 'badges.badge': 1 }, { sparse: true });
UserSchema.pre('save', function(next) {
    if(this.username) {
      this.searchableName = normalizeForSearch(this.username);
    }
    next();
});

/*serSchema.static('findByProvider', function(provider, providerId, cb) {
    return this.findOne({
        'enable': true,
        'providers.name': provider,
        'providers.id': providerId
    }).select('providers.name providers.name').exec(cb);
});*/
UserSchema.static('findByEmail', function(email, cb) {
    return this.findOne({
        'enable': true,
        'email': email
    }).exec(cb);
   
});

UserSchema.static('findByUsername', function(username, cb) {
    return this.findOne({
        'enable': true,
        'username': username
    }).exec(cb);
});

UserSchema.methods.verifyPassword = function(password, cb) {
    if ( ! this.password || (this.password && this.password.length == 0)) {
        cb(new Error('User does not have a password'));
    } else {
        bcrypt.compare(password, this.password, cb);
    }
};

UserSchema.methods.setPassword = function(password, cb) {
    let self = this;
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            cb(err);
        } else {
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) cb(err);
                self.password = hash;
                cb(null);
            });
        }
    });
};
/**
 * Get folders
 * @returns {Array}
 */
/*UserSchema.methods.getPostFolders = function() {
    return this.postFolders ? this.postFolders : [];
};*/
/**
 * Add folder to folder stack (does not commit)
 * @param folder
 */
/*UserSchema.methods.addPostFolder = function(folder) {
    var folders = this.getPostFolders();
    folders.push(folder);
    this.postFolders = folders;
    return folder;
}*/
/**
 * Updates a folder
 * @param {Object} folder structure
 */
/*UserSchema.methods.updatePostFolder = function(folder) {
    var folders = this.getPostFolders();

    folders.forEach((f,ix) => {
        if (f._id == folder._id) {
            folders[ix] = folder;
        }
    });
}*/
/**
 * Set folder stack (does not commit)
 * @type {object[]}
 */
/*UserSchema.methods.setPostFolders = function(folders) {
    this.postFolders = folders;
}
UserSchema.methods.getBadges = function() {
    return this.badges ? this.badges : [];
}
UserSchema.methods.getBadgeKeys = function() {
    return this.getBadges().map(badge => badge.badge);
}*/
/**
 * Add badge
 * @param {object}
 * @returns {UserSchema.query}
 */
/*UserSchema.methods.addBadgeByKey = function(badgeKey) {
    var badges = this.getBadges();
    var badgeKeys = this.getBadgeKeys();

    var existingMatchingBadges = (badgeKeys.filter(testBadgeKey => badgeKey == testBadgeKey));
    if (existingMatchingBadges.length == 0) {
        badges.push({badge:badgeKey});
    }

    this.badges = badges;
}*/
/**
 * Remove badge
 * @returns {UserSchema.query}
 */
/*UserSchema.methods.removeBadgeByKey = function(badgeKey) {
    /*
     var badges = this.getBadges();
     var badgeKeys = this.getBadgeKeys();

     badges.length = 0;
     */

    /*
     for (var i in badgeKeys) {
     if(i == badgeKey) {
     //dont add
     } else {
     badges.push({badge:i});
     }
     }
     */
   /* this.badges = [];
}*/
    /**
     * @TODO Look for instances and remove (shouldn't be used)
    **/
UserSchema.query.active = function() {
    return this;
}

module.exports = mongoose.model('User', UserSchema);
