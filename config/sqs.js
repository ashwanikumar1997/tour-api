/**
 * @file Configuration for AWS SQS service
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var QueueName = require('../app/enums/queuename');

function sqsConfig() {
    return {
        sqs: {
            accessKeyId: process.env.AWS_SQS_ACCESS_KEY || process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SQS_SECRET || process.env.AWS_SECRET,
            region: "us-west-2",
        },
        queues: {
            [QueueName.accountCreated]: {
                url: process.env.SQS_ACCOUNT_CREATED_URL || 'https://sqs.us-west-2.amazonaws.com/209876612521/account-created.fifo'
            },
            [QueueName.deleteAccount]: {
                url: process.env.SQS_DELETE_ACCOUNT_URL || 'https://sqs.us-west-2.amazonaws.com/209876612521/delete-account'
            },
            [QueueName.postCreated]: {
                url: process.env.SQS_POST_CREATED_URL || 'https://sqs.us-west-2.amazonaws.com/209876612521/post-created.fifo'
            },
            [QueueName.postPublished]: {
                url: process.env.SQS_POST_PUBLISHED_URL || 'https://sqs.us-west-2.amazonaws.com/209876612521/post-published.fifo'
            },
            [QueueName.passwordResetEmail]: {
                url: process.env.SQS_PASSWORD_RESET_EMAIL_URL || 'https://sqs.us-west-2.amazonaws.com/209876612521/password-reset-email'
            },
            [QueueName.postMediaOffloaded]: {
                url: process.env.SQS_POST_MEDIA_OFFLOADED_URL || 'https://sqs.us-west-2.amazonaws.com/209876612521/post-media-offloaded'
            },
            [QueueName.offloadProfileMedia]: {
                url: process.env.SQS_OFFLOAD_PROFILE_MEDIA_URL || 'https://sqs.us-west-2.amazonaws.com/209876612521/offload-profile-media'
            },
            [QueueName.profileMediaOffloaded]: {
                url: process.env.SQS_PROFILE_MEDIA_OFFLOADED_URL || 'https://sqs.us-west-2.amazonaws.com/209876612521/profile-media-offloaded'
            },
            [QueueName.checkPostReady]: {
                url: process.env.SQS_CHECK_POST_READY_URL || 'https://sqs.us-west-2.amazonaws.com/209876612521/check-post-ready.fifo'
            },
            [QueueName.activity]: {
                url: process.env.SQS_ACTIVITY_URL || 'https://sqs.us-west-2.amazonaws.com/209876612521/activity'
            },
            [QueueName.test]: {
                url: process.env.SQS_TEST_URL || 'https://sqs.us-west-2.amazonaws.com/209876612521/test'
            }
        }
    }
}

module.exports = sqsConfig