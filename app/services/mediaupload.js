/**
 * @file Handle image upload
 * @author Inimist
**/
var appConfig = require('../../config/config')
var MediaType = require('../enums/mediatype');
var sharp = require('sharp');
/**
 * handleMediaUpload
**/
function handleMediaUpload(Model, IdField, uploadPath, req, fileName) {
	let params = req.params;
	console.log(req.params.fileName);
	if (!req.files) {
		return { success: false, message: 'Missing file', status: 400 }
	} else if (params.mediaKey !== 'featured') {
		// No use
		return { success: false, message: 'Invalid mediaKey', status: 400 }
	}
	if (params[IdField]) {
		Model.findOne({ _id: params[IdField] }, function (err, record) {
			if (err) {
				return { success: false, message: 'Invalid record.', status: 400 }
			}
			console.log('test1');
			return updateRecordMedia(Model, record, uploadPath, req);
			console.log('test2');
		});
	}
	return { success: false, 'test': 'err' }
};



function updateRecordMedia(Model, record, uploadPath, req) {
	let config = appConfig();
	let mediaKey = req.params.mediaKey; // the key used to identify the image
	// let variationKey = req.params.variationKey; // the variation (key) of the image - a "sub" key
	let file = req.files.file;
	let path = config.uploadPaths[uploadPath];
	//let ext = 
	let file_name = record._id + '.jpg';
	let ori_des = path + '/' + file_name;
	let s_des = path + '/small/' + file_name;
	let m_des = path + '/medium/' + file_name;
	let l_des = path + '/large/' + file_name;
	//let newFileName2 = 's-' + record._id;
    /*if (variationKey !== 'original') newFileName += '-' + variationKey;
    newFileName += '.jpg';
	let path = '/' + newFileName;
	let sub_f = '';
	if (variationKey == 'thumbnail') {
		sub_f = '/thumbnail/';
	}
	let destinationPath = config.uploadPaths[uploadPath] + sub_f + path
	let destinationPath2 = config.uploadPaths[uploadPath]+ '/' + newFileName2+ '.jpg'*/
	file.mv(ori_des, function (err) {
		if (err) {
			return { success: false, message: 'Unknown error occurred while uploading your file', status: 500 }
		} else {
			console.log(ori_des);

			sharp.cache(false);

			let resize_opts = { fit: 'fill' };
			sharp(ori_des).resize(630, 389, resize_opts).toFile(s_des, function (err) {
				if (err) {
					return { success: false, message: "Resize failed", error: err };
				}
			});
			sharp(ori_des).resize(1260, 778, resize_opts).toFile(m_des, function (err) {
				if (err) {
					return { success: false, message: "Resize failed", error: err };
				}
			});
			sharp(ori_des).resize(1890, 1167, resize_opts).toFile(l_des, function (err) {
				if (err) {
					return { success: false, message: "Resize failed", error: err };
				}
			});
			console.log('Moved record media to ' + ori_des);
			//Save to database
			var recordObj = record.toObject();
			var images = recordObj.images ? recordObj.images : {};


			//Ensure media key exists withi n images object
			// if ( ! images[mediaKey]) { //If already then no need to update info. Only uplaoded file in uploads
			images[mediaKey] = {
				type: MediaType.image,
				path: '/' + file_name
			};
			//  }
			record.images = images;
			if (record.save());
			return { success: true };
		}
	});
}
module.exports = handleMediaUpload