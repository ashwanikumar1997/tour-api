/**
 * @file Middleware to handle 404 Page Not Found
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
module.exports = function(req, res) {
    res.status(404).send({success: false, message: 'Not found.  Did you forget where you placed your keys?'});
}