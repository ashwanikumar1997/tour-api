/**
 * @file Handle a profile image upload
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var appConfig = require('../../../config/config')
var MediaType = require('../../enums/mediatype');
var Place = require('../../models/place');
var sharp = require('sharp');

function handleMediaUpload(req, res, next) {

    let params = req.params;
    if ( ! req.files) {
        res.status(400).send({ success: false, message: 'Missing file'});
        return;
	} else if (params.mediaKey !== 'featured') { //No use
        res.status(400).send({ success: false, message: 'Invalid mediaKey'})
        return;
    }
    
    if (params.placeId) {
        Place.findOne({_id: params.placeId}, function(err, place) {
            if (err) {
                res.status(400).send({success: false, message: 'Invalid place.'});
                return;
            }

            updatePlaceMedia(place, req, res);
        });
    }
   // else
    //updatePlaceMedia(req.place.getModel(), req, res);
}

function updatePlaceMedia(place, req, res) {

    let config = appConfig();
    let mediaKey = req.params.mediaKey; // the key used to identify the image
    let variationKey = req.params.variationKey; // the variation (key) of the image - a "sub" key
    let file = req.files.file;
	
    let newFileName = 't-' + place._id;
	let newFileName2 = 's-' + place._id;
    if (variationKey !== 'original') newFileName += '-' + variationKey;
    newFileName += '.jpg';
	let path = '/' + newFileName;
	let sub_f = '';
	if (variationKey == 'thumbnail') {
		sub_f = '/thumbnail/';
	}
	let destinationPath = config.uploadPaths.places + sub_f + path
	let destinationPath2 = config.uploadPaths.places + '/small' + newFileName2+ '.jpg'
	file.mv(destinationPath, function (err) {
        if (err) {
            console.error(err);
            res.status(500).send({success: false, message: 'Unknown error occurred while uploading your file'});
        } else {
				/*Save small size of image there*/
			/*sharp(mediaLocation.path)
			  .rotate()
			  .resize(200)
			  .toBuffer()
			  .then( data => { ... })
			  .catch( err => { ... });*/
			  console.log('file loc = '+destinationPath);
			 sharp(destinationPath).resize(300, 200).toFile(destinationPath2, function(err) {
         if (err) {
           
		     console.log('err = '+err);
         }
			 });
			console.log('Moved place media to ' + destinationPath);
			//Save to database
			 var placeObj = place.toObject();
             var images = placeObj.images ? placeObj.images : {};

             //Ensure media key exists withi n images object
                if ( ! images[mediaKey]) { //If already then no need to update info. Only love uplaoded file in uploads
					 console.log('ff');
                    images[mediaKey] = {
                        type: MediaType.image,
                        path: path
                    };
               }
			 place.images = images;
			 place.save();
			 res.send({success: true});
		}
	});
}

module.exports = handleMediaUpload