/**
 * @file Easy way to lookup key => value pairs
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
class Dictionary {
    /**
     * Constructor - bet you couldn't have figured that out by yourself
     */
    constructor() {
        this.reset();
    }
    /**
     * Zeros out _values
     */
    reset() {
        this._values = {};
    }
    /**
     * Get a value for key.  If not defined return defaultValue
     * @param {string} key
     * @param {mixed} [defaultValue]
     * @returns {*}
     */
    get(key, defaultValue) {
        if (!this.isDefined(key)) return defaultValue;
        else return this._values[key];
    }
    /**
     * Defines a value for key
     * @param {string} key
     * @param {mixed} value
     */
    set(key, value) {
        this._values[key] = value;
    }
    /**
     * Removes a key definition
     * @param key
     */
    del(key) {
        delete this._values[key];
    }
    /**
     * Get all defined keys
     * @returns {Array}
     */
    keys() {
        return Object.keys(this._values);
    }
    isDefined(key) {
        return (typeof(this._values[key]) != 'undefined');
    }
    toObject() { return JSON.parse(JSON.stringify(this._values)); }
}

module.exports = Dictionary