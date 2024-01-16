/**
 * @file Types of badges
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var UserBadge = require('../app/enums/userbadge')

module.exports = {
    [UserBadge.ambassador]: {
        name: 'Ambassador'
    },
    [UserBadge.elite]: {
        name: 'Elite'
    },
    [UserBadge.stylist]: {
        name: 'Stylist'
    }
}