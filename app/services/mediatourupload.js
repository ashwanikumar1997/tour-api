var appConfig = require('../../config/config')
var MediaType = require('../enums/mediatype');
var sharp = require('sharp');

function handleTourMediaUpload(Model, IdField, uploadPath, req, fileName) {
    let params = req.params;
    console.log(req.params.fileName);
    if (!req.files) {
        return { success: false, message: 'Missing file', status: 400 }
    } else if (params.mediaKey !== 'featured') {
        return { success: false, message: 'Invalid mediaKey', status: 400 }
    }
    if (params[IdField]) {
        Model.findOne({ _id: params[IdField] }, function (err, record) {
            if (err) {
                return { success: false, message: 'Invalid record.', status: 400 }
            }
            return updateRecordMedia(Model, record, uploadPath, req);
        });
    }
    return { success: false, 'test': 'err' }
};

function updateRecordMedia(Model, record, uploadPath, req) {
    let config = appConfig();
    let mediaKey = req.params.mediaKey;
    let file = req.files.file;
    let path = config.uploadPaths[uploadPath];
    let file_name = req.params.fileName + '.jpg';
    let ori_des = path + '/' + file_name;
    let s_des = path + '/small/' + file_name;
    let m_des = path + '/medium/' + file_name;
    let l_des = path + '/large/' + file_name;
    file.mv(ori_des, function (err) {
        if (err) {
            return { success: false, message: 'Unknown error occurred while uploading your file', status: 500 }
        } else {
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
            // console.log('Moved record media to ' + ori_des);
            return { success: true };
        }
    });
}
module.exports = handleTourMediaUpload