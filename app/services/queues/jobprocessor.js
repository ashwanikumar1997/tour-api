/**
 * @file Abstract class for jobs
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var Promise = require('bluebird');

class JobProcessor {
    constructor() {
        this.jobManager = null;
    }

    /**
     * Sets up the job for processing
     * @returns {Promise.<T>}
     */
    setup(queueName) {
        return Promise.resolve();
    }

    getJobManager() { return this.jobManager; }

    /**
     * Set the JobManager responsible for managing this job
     * @param jobManager
     */
    setJobManager(jobManager) {
        this.jobManager = jobManager;
    }

    process(job, done) {
        throw new Error('You must override process');
    }
}

module.exports = JobProcessor