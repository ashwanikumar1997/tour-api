/**
 * @file Enqueue data for later processing
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var SqsProvider = require('./queues/providers/sqs');
var JobManager = require('./queues/jobmanager');
var sqsConfig = require('../../config/sqs');
var Message = require('./queues/message');
var Promise = require('bluebird');
/**
 * Creates a new queued object on queueName
 * @param {string} queueName
 * @param {object} data
 * @param {Object} [app] An optional object to store the kue instance on for re-use
 * @return {Promise} resolve();
 */
module.exports = function enqueue(queueName, data, app) {

    if ( ! app) app = {};

    var jobManager = app.jobManager;

    if ( ! jobManager) {
        var sqsProvider = new SqsProvider(sqsConfig());
        jobManager = app.jobManager = new JobManager(sqsProvider);
    }

    var message = new Message(data);

    return jobManager.sendMessage(queueName, new Message(data));
}