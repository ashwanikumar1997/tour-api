/**
 * @file Handle a profile image upload
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var appConfig = require('../../../config/config')
var MediaType = require('../../enums/mediatype');
var Tour = require('../../models/tour');

function handleMediaUpload(req, res, next) {

    let params = req.params;
    if ( ! req.files) {
        res.status(400).send({ success: false, message: 'Missing file'});
        return;
	} else if (params.mediaKey !== 'featured') { //No use
        res.status(400).send({ success: false, message: 'Invalid mediaKey'})
        return;
    }
    
    if (params.tourId) {
        Tour.findOne({_id: params.tourId}, function(err, tour) {
            if (err) {
                res.status(400).send({success: false, message: 'Invalid tour.'});
                return;
            }

            updateTourMedia(tour, req, res);
        });
    }
   // else
    //updateTourMedia(req.tour.getModel(), req, res);
}

function updateTourMedia(tour, req, res) {

    let config = appConfig();
    let mediaKey = req.params.mediaKey; // the key used to identify the image
    let variationKey = req.params.variationKey; // the variation (key) of the image - a "sub" key
    let file = req.files.file;
	
    let newFileName = 't-' + tour._id;
    if (variationKey !== 'original') newFileName += '-' + variationKey;
    newFileName += '.jpg';
	let path = '/' + newFileName;
	let sub_f = '';
	if (variationKey == 'thumbnail') {
		sub_f = '/thumbnail/';
	}
	let destinationPath = config.uploadPaths.tours + sub_f + path
	file.mv(destinationPath, function (err) {
        if (err) {
            console.error(err);
            res.status(500).send({success: false, message: 'Unknown error occurred while uploading your file'});
        } else {
			console.log('Moved tour media to ' + destinationPath);
			//Save to database
			 var tourObj = tour.toObject();
             var images = tourObj.images ? tourObj.images : {};

             //Ensure media key exists withi n images object
                if ( ! images[mediaKey]) { //If already then no need to update info. Only love uplaoded file in uploads
					 console.log('ff');
                    images[mediaKey] = {
                        type: MediaType.image,
                        path: path
                    };
               }
			 tour.images = images;
			 tour.save();
			 res.send({success: true});
		}
	});
}

module.exports = handleMediaUpload