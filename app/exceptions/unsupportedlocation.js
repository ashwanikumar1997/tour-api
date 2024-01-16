function UnsupportedLocation(message) {
    this.message = message;
    this.name = 'UnsupportedLocation';
    Error.captureStackTrace(this, UnsupportedLocation);
}
UnsupportedLocation.prototype = Object.create(Error.prototype);
UnsupportedLocation.prototype.constructor = UnsupportedLocation;

module.exports = UnsupportedLocation