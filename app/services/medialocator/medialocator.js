/**
 * @file Resolves media references based on media location
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
class MediaLocator {

    constructor(mediaLocationTypes) {
        this.mediaLocationTypes = mediaLocationTypes;
    }

    webUrl(mediaLocation) {

        var locator = this.getLocatorConfig(mediaLocation);

        if (locator) {
            return locator.webUrl + mediaLocation.path;
        }
    }

    systemPath(mediaLocation) {
        var locator = this.getLocatorConfig(mediaLocation);
        if (locator) {
            return (locator.systemPath?locator.systemPath:'') + mediaLocation.path;
        }
    }

    getLocator(engine) {
        return this.mediaLocationTypes[engine];
    }

    getLocatorConfig(mediaLocation) {
        if ( ! mediaLocation.storageEngine) console.log('NO ENGINE', mediaLocation);
        if ( ! this.mediaLocationTypes[mediaLocation.storageEngine]) console.log('NO DEFINITION');

        if ( ! mediaLocation.storageEngine) return;
        if ( ! this.mediaLocationTypes[mediaLocation.storageEngine]) return;

        return this.mediaLocationTypes[mediaLocation.storageEngine];
    }

}

module.exports = MediaLocator