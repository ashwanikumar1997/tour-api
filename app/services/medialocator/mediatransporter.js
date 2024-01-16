/**
 * @file Copy and move files between locations
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var MediaLocation = require('./medialocation');
var MediaLocator = require('./medialocator');
//var pkgcloud = require('pkgcloud');
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');

class MediaTransporter {
    /**
     * Constructor
     * @param {MediaLocator} mediaLocator
     */
    constructor(mediaLocator) {
        if ( ! (mediaLocator instanceof MediaLocator)) throw new Error('Invalid MediaLocator in MediaTransporter constructor');

        this.mediaLocator = mediaLocator;
    }

    /**
     * Copy a file from a source media location to a destination media location
     * @param {MediaLocation} src
     * @param {MediaLocation} dst
     */
    copy(src, dst) {

        this._validateSrcDst(src, dst);

        return new Promise( (resolve, reject) => {

            var srcStream = this.getSourceStream(src);
            var dstStream = this.getDestinationStream(dst);

            var active = true; // Set to false if response has already been returned

            /**
             * Source error handling
             */
            srcStream.on('error', err => {
                console.log('src.error');
                if (active) {
                    reject(err);
                    active = false;
                }
            });
            /**
             * Destination error handling
             */
            dstStream.on('error', err => {
                console.log('dst.error');
                if (active) {
                    reject(err);
                    active = false;
                }
            });
            /**
             * Transfer success (local file system)
             */
            dstStream.on('finish', () => {
                // console.log('dst.finish');
                if (active) {
                    resolve();
                    active = false;
                }
            });
            /**
             * Transfer success (pkgcloud)
             */
            dstStream.on('success', () => {
                // console.log('dst.success');
                if (active) {
                    resolve();
                    active = false;
                }
            });

            srcStream.pipe(dstStream);
        });
    }

    /**
     * Move a media file from a source media location to a destination media location
     * @param {MediaLocation} src
     * @param {MediaLocation} dst
     */
    move(src, dst) {
        return this.copy(src, dst)
            .then(() => {
                this._delete(src);
            });
    }

    /**
     * Quick way to copy source media location to another storage engine
     * @param src
     * @param dstStorageEngine
     * @returns {*}
     */
    copyTo(src, dstStorageEngine) {
        var dst = new MediaLocation(dstStorageEngine, src.path);
        return this.copy(src, dst);
    }

    /**
     * Quick way to move source media location to another storage engine
     * @param src
     * @param dstStorageEngine
     */
    moveTo(src, dstStorageEngine) {
        return this.copyTo(src, dstStorageEngine)
            .then(() => {
                this._delete(src);
            });
    }

    /**
     * Delete a file at a location
     * @param loc
     * @returns {Promise.<T>}
     * @private
     */
    _delete(loc) {

        // console.log
        return Promise.resolve();

    }

    /**
     * Check if location config has a pkgcloud property, indicating that it should be handled by pkgcloud package
     * @param config
     * @returns {boolean}
     */
    /*isPkgCloud(config) {

        if (config.pkgcloud) return true;

        return false;

    }*/

    /**
     * Build a filesystem or pkgcloud source stream
     * @param {MediaLocation} src
     * @returns {Stream}
     */
    /*getSourceStream(src) {

        var config = this.mediaLocator.getLocatorConfig(src);

        /**
         * If this is a pkgcloud src then shortcircuit and use download as the stream
         */
        /*if (this.isPkgCloud(config)) {
            var client = pkgcloud.storage.createClient(config.pkgcloud.client);

            var opts = this._shallowMerge({
                container: config.pkgcloud.container,
                remote: this.mediaLocator.systemPath(dst).substring(1)
            }, config.pkgcloud.download);

            return client.download(opts);
        }

        // Return reference to local file system stream
        return fs.createReadStream( this.mediaLocator.systemPath(src) );

    }*/

    /**
     * Build a filesystem or pkgcloud destination stream
     * @param {MediaLocation} dst
     * @returns {Stream}
     */
    /*getDestinationStream(dst) {

        var config = this.mediaLocator.getLocatorConfig(dst);

        if (this.isPkgCloud(config)) {
            var client = pkgcloud.storage.createClient(config.pkgcloud.client);

            var opts = this._shallowMerge({
                container: config.pkgcloud.container,
                remote: this.mediaLocator.systemPath(dst).substring(1)
            }, config.pkgcloud.upload);

            return client.upload(opts);
        }

        return fs.createWriteStream(this.mediaLocator.systemPath(dst));
    }*/

    /**
     * Merge all arguments into a single object, later arguments override earlier argument objects
     * @param opts
     * @private
     */
    _shallowMerge(opts) {

        var rtn = {};
        for(var i=0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (arg) {
                for(var k in arg) {
                    rtn[k] = arg[k];
                }
            }
        }
        return rtn;
    }

    _validateSrcDst(src, dst) {
        this._validateLocation(src, 'source');
        this._validateLocation(dst, 'destination');
    }

    _validateLocation(loc, label) {
        if ( ! (loc instanceof MediaLocation)) throw new Error('Invalid location specified for ' + label);
    }
}

module.exports = MediaTransporter