/**
 * @file SQS QueueStrategy
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var Dictionary = require('../../shared/dictionary');
var QueueProvider = require('../queueprovider');
var randomstring = require('randomstring');
var SqsConsumer = require('sqs-consumer');
var Message = require('../message');
var Promise = require('bluebird');
var AWS = require('aws-sdk');

class SQSQueueProvider extends QueueProvider {
    constructor(config) {
        super();
        this.config = config;
        this.queues = new Dictionary();
        this.sqs = new AWS.SQS(config.sqs);
    }

    /**
     * Send a message
     * @param {String} queueName
     * @param {Message} message
     * @returns {Promise}
     */
    sendMessage(queueName, message) {
        var queueUrl = this.queueUrl(queueName);

        var sqsOriginalMessage = message.originalMessage;
        var messageGroupId = null;
        if (sqsOriginalMessage && sqsOriginalMessage.MessageGroupId) messageGroupId = sqsOriginalMessage.MessageGroupId;
        else messageGroupId = randomstring.generate(12);

        var params = {
            MessageBody: JSON.stringify(message.data),
            QueueUrl: queueUrl
        };

        var isFIFOMessage = (queueUrl.substring(queueUrl.length - 5) == '.fifo');
        if (isFIFOMessage) params.MessageGroupId = messageGroupId;

        return new Promise((resolve, reject) => {
            this.sqs.sendMessage(params, (err, data) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    /**
     * Handles the receipt of a message from a queue
     * @param {String} queueName
     * @param {fn} fnHandler Callback signature function handleMessage({Message}message, {fn}done)
     */
    receiveMessage(queueName, fnHandler) {

        var queueUrl = this.queueUrl(queueName);

        const consumer = SqsConsumer.create({
            queueUrl: queueUrl,
            handleMessage: (sqsMessage, done) => {
                var message = new Message(JSON.parse(sqsMessage.Body), sqsMessage);
                fnHandler(message, done)
            },
            sqs: this.sqs
        })

        consumer.on('error', err => console.log(err));

        consumer.start();
    }

    queueUrl(queueName) {
        var queueConfig = this.queueConfig(queueName);

        return queueConfig.url;
    }
    queueConfig(queueName) {
        return this.config.queues && this.config.queues[queueName] ? this.config.queues[queueName] : {};
    }
}

module.exports = SQSQueueProvider