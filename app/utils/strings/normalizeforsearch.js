/**
 * @file Normalizes a string for consistent searchability
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var initNormalizer = require('normalize-for-search');

function normalizeForSearch(str) {
    str = initNormalizer(str);
    str = str.replace('-', ' ').replace(/[^a-zA-Z0-9 ]+/g, '').replace(/ +/g, ' ');
    str = str.replace(/^the /, '');
    return str;
}

module.exports = normalizeForSearch