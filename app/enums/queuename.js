/**
 * @file Enumerated queue names
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
module.exports = {
    accountCreated: 'account-created.fifo',
    postCreated: 'post-created.fifo',
    postPublished: 'post-published.fifo',
    passwordResetEmail: 'password-reset-email',
    // offloadPostMedia: 'offload-post-media',
    postMediaOffloaded: 'post-media-offloaded',
    offloadProfileMedia: 'offload-profile-media',
    profileMediaOffloaded: 'profile-media-offloaded',
    checkPostReady: 'check-post-ready.fifo',
    deleteAccount: 'delete-account',
    activity: 'activity',
    notification: 'notification'
}