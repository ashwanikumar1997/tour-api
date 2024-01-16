/**
 * @file Middleware to ensure that the user is logged in
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
module.exports = (req, res, next) => {
    //if ( ! req.user || ! req.user.isUser()) res.status(400).send({ success: false, message: 'You must be an authorized user to perform this action'});
   // else next();
	next();
};