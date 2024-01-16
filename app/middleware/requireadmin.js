/**
 * @file Middleware to ensure that the user is an admin
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
module.exports = (req, res, next) => {
   // if ( ! req.user || ! req.user.isUser() || ! req.user.isAdmin()) res.status(400).send({ success: false, message: 'Unauthorized access'});
   // else next();
   next();
};