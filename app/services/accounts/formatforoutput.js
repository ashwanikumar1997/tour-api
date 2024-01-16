/**
 * @file Format an account for public use
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
//const badgeConfig = require('../../../config/badges');
//const profileImageUrl = require('./profileimageurl');

function formatAccountForOutput(user, isAdmin) {

    /*var badges = [];

    if (typeof user.badges  !== 'undefined') {
		console.log('dfdf');
        badges = user.badges.map(badge => {
            return {
                key: badge.badge,
                name: (typeof(badgeConfig[badge.badge]) == 'undefined') ? badge.badge+' (unknown)' : badgeConfig[badge.badge].name
            };
        });
    }*/
    let account = {
        id: user._id,
        name: user.name,
        // displayName: user.name,
        description: '',
       // location: '',
       // stats: user.stats ? user.stats : {},
       // profileImageUrl: profileImageUrl(user),
       // badges
    };
return account;
    if (isAdmin) {
        account['created'] = new Date(user.created).getTime() / 1000;
        account['email'] = user.email || '';
       // account['providers'] = (user.providers || []).map((item) => item.name);
        account['accountType'] = user.accountType || '';
    }

    return account;
}

module.exports = formatAccountForOutput