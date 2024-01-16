/**
 * @file AccountsController.initResetPassword
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
const randomString = require('randomstring');
const User = require('../../models/user');
const config = require('../../../config/config')();
const mailgun = require('mailgun-js')({
    apiKey: config.mailgun.apiKey,
    domain: config.mailgun.domain
});


/**
 * Initialize the password reset process
 * Unless an email address is not passed, there is no indication of any problem.
 * We want to avoid tipping anyone off about whether an account is valid or not
 * @param req
 * @param res
 * @param next
 */
function initResetPassword(req, res, next) {

    var email = req.body.email;

    if ( ! email || email.length === 0) {
        res.status(400).send({ success: false, message: 'Email is required'} );
    }
    else {
        let query = {
            email: {
                $regex: new RegExp('^' + email + '$', 'i')
            },
            enable: true
        };

        User.findOne(query).exec( (err, user) => {

            if (err) {
                return next(err);
            }
            if (!user) {
                res.send({
                    success: false,
                    message: "User with given email doesn't exist."
                });
                return;
            }

            let code = randomString.generate({
                length: 6,
                charset: 'numeric'
            });

            user.resetPassword = {
                codeRequested: Date.now(),
                code: code,
                numAttempts: 0
            };

            user.save(err => {
                if (err) {
                    return next(err);
                }

                let data = {
                    from: 'Envy <no-reply@mg.findyourenvy.com>',
                    to: email,
                    subject: 'Envy Password Reset',
                    text: 'Enter the code: ' + code + ' into the app',
                    'h:Reply-To': 'info@findyourenvy.com',
                };

                mailgun.messages().send(data, (error, body) => {
                    if (error) {
                        res.send({
                            success: false,
                            message: "Unknown error occurred when sending the email message. Please try again later."
                        });
                    }
                    else {
                        res.send({success: true});
                    }
                });
            });

        });
    }
}

module.exports = initResetPassword;
