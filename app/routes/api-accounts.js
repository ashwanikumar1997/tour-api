/**
 * 
 * @file Account Routes
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 * 
**/

var routes = require('express').Router();

//var deleteBadgeFromAccount = require('../controllers/accountbadges/deletefromaccount');
//var getAvailableBadges = require('../controllers/accountbadges/getavailablebadges');
var userIdToAccount = require('../services/accounts/params/useridtoaccount');
var initPasswordReset = require('../controllers/accounts/initresetpassword');
//var addBadgeToAccount = require('../controllers/accountbadges/addtoaccount');
var requireAuthorizedUser = require('../middleware/requireauthorizeduser');
var resetPassword = require('../controllers/accounts/resetpassword');
var updateMyself = require('../controllers/accounts/updatemyself');
//var getBadges = require('../controllers/accountbadges/getbadges');
var genericController = require('../controllers/temporary.js');
var accountsController = require('../controllers/accounts');
var requireAdmin = require('../middleware/requireadmin');

userIdToAccount(routes);

routes.post('/login', accountsController.login);
routes.post('/register', accountsController.register);
routes.post('/checkusername', accountsController.checkusername);
//routes.post('/initpasswordreset', initPasswordReset);
routes.post('/resetpassword', resetPassword);

routes.use(requireAuthorizedUser);

routes.get('/me', accountsController.me);
routes.put('/me', updateMyself);
routes.delete('/me', accountsController.deleteMyself);
//routes.post('/me/media/:mediaKey/:variationKey', fileupload(), accountsController.handleMediaUpload);
routes.use(requireAdmin);

routes.get('/', accountsController.all);
routes.get('/search', accountsController.search);
//routes.get('/badges', getAvailableBadges);
routes.get('/:userId', accountsController.get);
routes.delete('/:userId', accountsController.delete);
/*routes.get('/:userId/badges', getBadges);
routes.post('/:userId/badges', addBadgeToAccount);
routes.post('/:userId/badgedelete', deleteBadgeFromAccount);
routes.delete('/:userId/badges', deleteBadgeFromAccount);
routes.post('/:userId/media/:mediaKey/:variationKey', fileupload(), accountsController.handleMediaUpload);
*/
// routes.put('/:userId', accountsController.update);
// routes.get('/settings', genericController);
// routes.put('/settings/:settingId', genericController);


module.exports = routes;