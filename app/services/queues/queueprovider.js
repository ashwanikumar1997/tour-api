/**
 * @file Queue strategy
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/

class QueueProvider {
    /**
     * Sent a message to the queue
     * @param {String} queueName
     * @param {Message} message
     * @returns {Promise}
     */
    sendMessage(queueName, message) {
        throw new Error('You have to override sendMessage()')
    }

    /**
     * Handles the receipt of a message from a queue
     * @param {String} queueName
     * @param {fn} fnHandler Callback signature function handleMessage({Message}message, {fn}done)
     */
    receiveMessage(queueName, fnHandler) {
        throw new Error('You have to override receiveMessage()')
    }
    /**
     * @param {Message} message
     */
    deleteMessage(message) {
        throw new Error('You have to override receiveMessage()')
    }
}

module.exports = QueueProvider