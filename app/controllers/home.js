/**
 * @file HomeController
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
module.exports = (req, res, next) => {
    res.send({success: true, message: 'Hey, what are you doing here?'});
};