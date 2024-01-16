function InvalidPreferenceValue(message) {
    this.message = message;
    this.name = 'InvalidPreferenceValue';
    Error.captureStackTrace(this, InvalidPreferenceValue);
}
InvalidPreferenceValue.prototype = Object.create(Error.prototype);
InvalidPreferenceValue.prototype.constructor = InvalidPreferenceValue;

module.exports = InvalidPreferenceValue