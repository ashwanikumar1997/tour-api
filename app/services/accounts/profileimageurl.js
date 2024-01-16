/**
 * @file Get image from user model
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var MediaLocator = require('../medialocator/medialocator');
var appConfig = require('../../../config/config');
var resolveMedia = require('../medialocator/resolvemedia');

function profileImageUrl(user) {

    var config = appConfig();
    var mediaLocations = config.mediaLocations;

    // Default:
    var url = config.mediaLocations.static.webUrl + '/profile-default.jpg';

    /**
     * Use local user profile reference, if available
     */
    if (user.images && user.images.profile) {

        var mediaLocator = new MediaLocator(mediaLocations);
        var resolvedMedia = resolveMedia(mediaLocator, user.images.profile)
        url = resolvedMedia.url;

    } else if (user.providers) {
        /**
         * Otherwise check if we can pull an image from Facebook
         */
        user.providers.forEach(provider => {
            if (provider.name == 'facebook' &&
                provider.profile &&
                provider.profile.photos && provider.profile.photos.length > 0)
            {
                url = provider.profile.photos[0].value;
            }
        });
    }

    return url;
}

module.exports = profileImageUrl