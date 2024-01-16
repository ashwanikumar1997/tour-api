function InvalidPreference(message) {
    this.message = message;
    this.name = 'InvalidPreference';
    Error.captureStackTrace(this, InvalidPreference);
}
InvalidPreference.prototype = Object.create(Error.prototype);
InvalidPreference.prototype.constructor = InvalidPreference;

module.exports = InvalidPreference