'use strict';

var _module = null,
    _exports = null;
if (typeof(module) !== 'undefined' && module.exports) {
    _exports = module.exports;
    _module = {
        SuperLazyPromise: require('superlazypromise').SuperLazyPromise
    };
} else {
    _exports = window;
    _module = _exports;
}

((module, exports) => {
    const SuperLazyPromise = module.SuperLazyPromise;

    const   EMPTY_FN = function() {},
            NS_SEPARATOR = '.';

    /**
     * A manager for listening and emitting event on a object.
     *
     *
     * Each listener are stored to be fired later on a `SuperLazyPromise`
     *
     * |     emit\on    | event | event.* | event.context | event.context! |
     * |:--------------:|:-----:|:-------:|:-------------:|:--------------:|
     * |      event     |   ✓   |    ✓    |       ✓       |        ✓       |
     * |  event.context |   ✓   |         |       ✓       |        ✓       |
     * | event.context! |       |         |       ✓       |        ✓       |
     *
     * **!** : Firing an event on strict context (`event.context!`) is not yet implemented.
     *
     * @abstract
     */
    class EventEmitter {

        /**
         * Build the internal super lazy promise pool.
         */
        constructor() {

            /**
             * @type {Map<String, SuperLazyPromise>}
             * @private
             */
            this._promises = new Map();
        }

        /**
         * Listen the given event.
         * Contrary to classic event manager like `addEventListener` for DOM, `EventEmitter` provide a `Promise`-like
         * to manipulate instead of a callback.
         *
         * This `Promise` will be **SuperLazy** which means that it will be active only when we fire it.
         *
         * See `SuperLazyPromise` for more explanation.
         *
         * @param {String} event Type of event with context or not
         * @return {LazyPromise} The promise to manipulate
         *
         * @see SuperLazyPromise
         * @listening event
         */
        on(event) {
            let SLP = this._promises.get(event),
                hasContext = event.includes(NS_SEPARATOR),
                splitEvent = event.split(NS_SEPARATOR),
                promiseMainEvent = this._promises.get(splitEvent[0]);

            if (hasContext) {
                if (SLP) {
                    if (!promiseMainEvent) {
                        promiseMainEvent = new SuperLazyPromise(SLP.fn);
                        promiseMainEvent.updatePromise(SLP.promise);
                        this._promises.set(splitEvent[0], promiseMainEvent);
                    }
                } else {
                    if (promiseMainEvent) {
                        SLP = new SuperLazyPromise(promiseMainEvent.fn);
                        SLP.updatePromise(promiseMainEvent.promise);
                        this._promises.set(event, SLP);
                    } else {
                        this._promises.set(splitEvent[0], new SuperLazyPromise(EMPTY_FN));
                        this._promises.set(event, new SuperLazyPromise(EMPTY_FN));
                    }
                }
            } else {
                if (!SLP) {
                    this._promises.set(event, new SuperLazyPromise(EMPTY_FN));
                }
            }
            return this._promises.get(event);
        }

        /**
         * Stop listening on the given event.
         * The promise stored by `on` or `emit` will become not usable.
         *
         * @param {String} event Type of event with context or not
         * @listened event
         */
        off(event) {
            if (!event.includes(NS_SEPARATOR)) {
                this._destroyPromise(event);
            } else {
                for (let keyVal of this._promises) {
                    if (keyVal[0].split(NS_SEPARATOR)[0] === event) {
                        this._destroyPromise(keyVal[0]);
                    }
                }
            }
        }

        /**
         * Kill & destroy a lazy promise to prevent future use.
         *
         * @param {String} event Type of event with context or not
         * @private
         */
        _destroyPromise(event) {
            this._promises[event].kill();
            delete this._promises[event];
        }

        /**
         * Emit a possibly listened event and call the function associated with some param.
         * See the array in class description for event specific firing.
         *
         * @param {String} event Type of event with context or not
         * @param {...*} data What is fired to the first listener
         *
         * @emit event
         */
        emit(event, ...data) {
            const executor = (ok, ko) => ok(...data);

            let SLP = this._promises.get(event),
                hasContext = event.includes(NS_SEPARATOR),
                splitEvent = event.split(NS_SEPARATOR),
                promiseMainEvent = this._promises.get(splitEvent[0]);

            if (hasContext) {
                if (SLP) {
                    SLP.awake(executor);
                    if (promiseMainEvent) {
                        promiseMainEvent.awake(executor);
                    } else {
                        promiseMainEvent = new SuperLazyPromise(EMPTY_FN);
                        promiseMainEvent.updatePromise(SLP.promise);
                        this._promises.set(splitEvent[0], promiseMainEvent);
                    }
                } else {
                    if (promiseMainEvent) {
                        promiseMainEvent.awake(executor);
                        SLP = new SuperLazyPromise(EMPTY_FN);
                        SLP.updatePromise(promiseMainEvent.promise);
                    } else {
                        promiseMainEvent = new SuperLazyPromise(executor);
                        promiseMainEvent.awake();
                        SLP = new SuperLazyPromise(EMPTY_FN);
                        SLP.updatePromise(promiseMainEvent.promise);
                    }
                }
            } else {
                if (SLP) {
                    SLP.awake(executor);
                } else {
                    SLP = new SuperLazyPromise(executor);
                    SLP.awake();
                    this._promises.set(event, SLP);
                }

                for (let keyVal of this._promises) {
                    if (keyVal[0].includes(NS_SEPARATOR) && keyVal[0].split(NS_SEPARATOR)[0] === event) {
                        let subEvent = keyVal[0],
                            subPromise = this._promises.get(subEvent);
                        subPromise.updatePromise(SLP.promise);
                        subPromise.awake();
                    }
                }
            }
        }
    }

    exports.EventEmitter = EventEmitter;
})(_module, _exports);
