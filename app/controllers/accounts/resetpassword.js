/**
 * @file AccountsController.resetPassword
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var appConfig = require('../../../config/config');
var hasValue = require('../../utils/hasvalue');
var User = require('../../models/user');

function resetPassword(req, res, next) {

    var body = req.body;
    var email = body.email;
    var code = body.code;
    var password = body.password;

    if (
        ! hasValue(email) ||
        ! hasValue(code) ||
        ! hasValue(password)
    ) {
        res.status(400).send({
            success: false,
            message: 'Missing one of email, code, or password',
        });
        return;
    }

    User.findOne({email, enable: true}).exec( (err, user) => {

        var saveUser = false;

        if (err) next(err);
        else {

            var errMessage = null;

            var resetPassword = user ? user.resetPassword : null;

            if (user && resetPassword &&
                resetPassword.codeRequested &&
                resetPassword.code && resetPassword.code.length > 0)
            {

                var config = appConfig().accounts.password;
                var maxAge = config.resetMaxAge;
                var maxAttempts = config.maxAttempts;
                var minLength = config.minLength;

                var age = (Date.now()/1000) - (resetPassword.codeRequested/1000);
                var numAttempts = resetPassword.numAttempts;
                numAttempts ++;

                if (age > maxAge) {

                    errMessage = 'The maximum amount of time to reset the password has been exceeded.  Please request a new password reset';

                } else if (code != resetPassword.code) {

                    errMessage = 'The code entered does not match';
                    resetPassword.numAttempts++;

                    saveUser = true;

                } else if (numAttempts > maxAttempts) {

                    errMessage = 'You have exceeded the maximum number of attempts.  Please request a new password reset';

                } else if (password.length < minLength) {

                    errMessage = 'Password must be at least ' + minLength + ' characters';

                }

            } else {

                errMessage = 'Invalid request';
            }

            if (null === errMessage) {

                user.setPassword(password, err => {

                    if (err) next(err);
                    else user.save(err => {
                        if (err) next(err);
                        else return res.send({ success: true });
                    });

                });

            } else {

                if (saveUser) {

                    user.resetPassword.numAttempts = numAttempts;
                    user.markModified('resetPassword');

                    user.save(err => {
                        if (err) next(err);
                        else {
                            var attemptsRemaining = maxAttempts - numAttempts;
                            if (attemptsRemaining < 0) attemptsRemaining = 0;

                            res.
                            status(400
                            ).send
                            ({success: false, message: errMessage, attemptsRemaining});
                        }

                    });

                } else {

                    res.status(400).send({success: false, message: errMessage});

                }

            }
        }
    });
}

module.exports = resetPassword