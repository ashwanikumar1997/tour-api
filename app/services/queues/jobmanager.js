/**
 * @file Wrapper for kue job processing
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/

var ServiceManager = require('../servicemanager');
var JobProcessor = require('./jobprocessor');

class JobManager {

    constructor(provider, serviceManager) {
        this.provider = provider;
        /**
         * EVENTS
         * - `enqueue` the job is now queued
         * - `start` the job is now running
         * - `promotion` the job is promoted from delayed state to queued
         * - `progress` the job's progress ranging from 0-100
         * - `failed attempt` the job has failed, but has remaining attempts yet
         * - `failed` the job has failed and has no remaining attempts
         * - `complete` the job has completed
         * - `remove` the job has been removed
         *
         * queue.on("job [event]", )
         */
        // this.queue = kue.createQueue();
        // this.queue.watchStuckJobs(5000);

        // this.queue.on('job enqueue', function (id, type) {
        //     console.log('Job %s got queued of type %s', id, type);
        // });
        //
        // this.queue.on('job complete', function (id, result) {
            // kue.Job.get(id, function(err, job){
            //     if (err) return;
            //     job.remove(function(err){
            //         if (err) throw err;
            //         console.log('removed completed job #%d', job.id);
            //     });
            // });
            // status(queue);
        // });

        // Services that can be invoked by jobs
        if ( ! serviceManager) serviceManager = new ServiceManager();
        this._services = serviceManager;
    }
    
    /**
     * Add a jobProcessor for a given queue name
     * @param queueName
     * @param jobProcessor
     */
    /**
     * Convenience wrapper for getService(...)/setService(...)
     * @param {String} serviceKey A key that identifies a service
     * @param {Function} [fnSetupHandler] A handler function to setup the required service
     * @throws {Error}
     */
    service(serviceKey, fnSetupHandler) {
        return this._services.service(serviceKey, fnSetupHandler);
    }

    /**
     * Send a message
     * @param {String} queueName
     * @param {Message} message
     */
    sendMessage(queueName, message) {
        return this.provider.sendMessage(queueName, message);
    }

    /**
     * Handles the receipt of message from a queue
     * @param {String} queueName
     * @param {JobProcessor} jobProcessor Handles processing of received message
     */
    handleQueue(queueName, jobProcessor) {

        if ( ! (jobProcessor instanceof JobProcessor)) throw new Error('jobProcessor must be an instance of Job');

        jobProcessor.setJobManager(this);

        jobProcessor.setup(queueName)
            .then(() => {
                /** @var {Message} message **/
                this.provider.receiveMessage(queueName, (message, done) => {
                    jobProcessor.process(message, done);
                });
            })
    }
}

module.exports = JobManager