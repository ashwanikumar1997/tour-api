/**
 * @file Response for API home
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
module.exports = (req, res, next) => {
    res.status(400).json({ message: 'Invalid request'});
};