/**
 * @file Check if we have a value
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
/**
 * Check if we have a value
 * @param value
 * @returns {boolean}
 */
module.exports = (value) => {

    if ( ! value) return false;

    if ((Array.isArray(value) || typeof(value) == 'string') && value.length == 0) return false;

    return true;
}