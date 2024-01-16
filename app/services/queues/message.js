/**
 * @file A generic message object that can be used for different strategies
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
class Message {
    /**
     * @param {Mixed} data Any type of data that can be sent to a queue
     * @param {Mixed} [originalMessage] The message as originall returned by the strategy class's receiveMessage()
     */
    constructor(data, originalMessage) {
        this.data = data;
        this.originalMessage = originalMessage;
    }
}

module.exports = Message