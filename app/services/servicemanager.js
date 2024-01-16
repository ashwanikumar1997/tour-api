/**
 * @file Shared service manager
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var Promise = require('bluebird');

class ServiceManager {
    constructor() {
        this._services = {};
        this._instantiated = {};
    }

    service(serviceKey, fnSetupHandler) {
        if (fnSetupHandler) {
            return this.setService(serviceKey, fnSetupHandler);
        } else {
            return this.getService(serviceKey);
        }
    }
    /**
     * Sets a service handler by name
     * @param {String} serviceKey
     * @param {Function} fnSetupHandler
     */
    setService(serviceKey, fnSetupHandler, shared) {
        if (typeof(fnSetupHandler)!='function') throw new Error('fnSetupHandler should be a function: ' + typeof(fnSetupHandler));

        if (typeof(shared) == 'undefined') shared = true;
        else shared = ! (false === shared);

        this._services[serviceKey] = {
            shared: shared,
            handler: fnSetupHandler
        };
    }

    /**
     * Creates an instance of object based on a registered serviceKey
     * @param serviceKey
     * @returns {Promise.<T>}
     */
    getService(serviceKey) {
        if ( ! this._services[serviceKey]) throw new Error('Service not found: ' + serviceKey);

        var shared = this._services[serviceKey].shared;

        /**
         * If the service is already initiated, return directly
         */
        if (shared && this._instantiated[serviceKey]) {
            return this._instantiated[serviceKey];
        }
        /**
         * Otherwise, you know what to do
         */
        else {

            var result = this._services[serviceKey].handler.call(null, this /* ServiceManager */);
            var isPromise = (typeof(result.then) == 'function');
            /**
             * Response may be a promise, or a direct value.  Act accordingly
             */
            // if (isPromise) {
            //     return result.then(instance => {
            //         if (shared) this._instantiated[serviceKey] = instance;
            //         return Promise.resolve(instance);
            //     });
            // } else {
            //     if (shared) this._instantiated[serviceKey] = result;
            //     return Promise.resolve(result);
            // }

            if (isPromise) {
                result = result.then(instance => instance);
            } else {
                result = Promise.resolve(result);
            }

            if (shared)
                this._instantiated[serviceKey] = result;
            }
            return result;
    }
}

module.exports = ServiceManager