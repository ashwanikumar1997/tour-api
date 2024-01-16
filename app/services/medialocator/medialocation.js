/**
 * @file Represents single MediaLocation
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
class MediaLocation {
    constructor(storageEngine, path) {
        this.storageEngine = storageEngine;
        this.path = path;
    }
}

module.exports = MediaLocation