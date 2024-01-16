/**
 * @file Handle a profile image upload
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var MediaLocation = require('../../services/medialocator/medialocation');
var MediaLocator = require('../../services/medialocator/medialocator');
var appConfig = require('../../../config/config')
var MediaType = require('../../enums/mediatype');
var QueueName = require('../../enums/queuename');
var enqueue = require('../../services/enqueue');
var User = require('../../models/user');

function handleMediaUpload(req, res, next) {

    let params = req.params;
    if ( ! req.files) {
        res.status(400).send({ success: false, message: 'Missing file'});
        return;
    } else if ( ! req.user.isUser()) {
        res.status(400).send({ success: false, message: 'Missing user'});
        return;
    } else if (params.mediaKey !== 'profile') {
        res.status(400).send({ success: false, message: 'Invalid mediaKey'})
        return;
    }
    
    if (params.userId && req.user.isAdmin()) {
        User.findOne({_id: params.userId}, function(err, user) {
            if (err) {
                res.status(400).send({success: false, message: 'Invalid user.'});
                return;
            }

            updateUserMedia(user, req, res);
        });
    }
    else
    updateUserMedia(req.user.getModel(), req, res);
}

function updateUserMedia(user, req, res) {
    let config = appConfig();
    let mediaKey = req.params.mediaKey; // the key used to identify the image
    let variationKey = req.params.variationKey; // the variation (key) of the image - a "sub" key
    let file = req.files.file;

    let newFileName = 'u-' + user._id;
    if (variationKey !== 'original') newFileName += '-' + variationKey;
    newFileName += '.jpg';

    console.log(newFileName);

    let mediaLocator = new MediaLocator(config.mediaLocations);
    let mediaLocation = new MediaLocation('uploads', '/' + newFileName);

    file.mv(mediaLocator.systemPath(mediaLocation), function (err) {

        if (err) {
            console.error(err);
            res.status(500).send({success: false, message: 'Unknown error occurred while uploading your file'});
        } else {
            if (variationKey === 'original' || variationKey === 'thumbnail' || variationKey === 'cover') {
                let data = {
                    userId: user._id,
                    mediaType: MediaType.image,
                    mediaKey,
                    variationKey,
                    srcStorageEngine: mediaLocation.storageEngine,
                    srcPath: mediaLocation.path,
                    dstStorageEngine: config.accounts.mediaTargetLocation
                };

                enqueue(QueueName.offloadProfileMedia, data, req.app) // runs asynchronously
                    .then(() => user.save())
                    .catch(err => console.error(err));

                res.send({success: true})
            } else {
                res.status(400).send({
                    success: false,
                    message: 'The original version for this media has not been uploaded'
                });
                return;
            }
        }
    });
}

module.exports = handleMediaUpload