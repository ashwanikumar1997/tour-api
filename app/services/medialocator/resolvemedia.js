/**
 * @file Resolves a db media reference to a usable media reference
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var MediaLocation = require('./medialocation');
/**
 * Takes an MediaSchema object (which includes variations) and resolves all URLs
 * @param {MediaLocator} mediaLocator
 * @param {MediaSchema} mediaItem
 * @param {String} [mediaType] The root mediaItem will provide the initial value, then nested variations will inherit
 * @return {Object}
 */

function resolveMedia(mediaLocator, mediaItem, defaultMediaType) {

    /**
     * Root mediaItem will have its location under .location,
     * whereas for variations the mediaItem is the location
     */
    var mediaItemLocation = mediaItem.location ? mediaItem.location : mediaItem;

    var mediaLocation = new MediaLocation(
        mediaItemLocation.storageEngine,
        mediaItemLocation.path
    );

    var mediaType = mediaItem.type ? mediaItem.type : defaultMediaType;

    var url = mediaLocator.webUrl(mediaLocation);

    var resolvedMedia = {
        type: mediaType,
        url,
        sortorder: mediaItem.sortorder
    };

    /**
     * Retrieve variations
     */
    if (mediaItem.variations) {
        var variations = typeof(mediaItem.variations.toObject) == 'function' ? mediaItem.variations.toObject() : mediaItem.variations;
        resolvedMedia.variations = {};

        for (var i in variations) {
            resolvedMedia.variations[i] = resolveMedia(mediaLocator, mediaItem.variations[i], mediaType);
        }
    }

    return resolvedMedia;
}

module.exports = resolveMedia