'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _module = null,
    _exports = null;
if (typeof module !== 'undefined' && module.exports) {
    _exports = module.exports;
    _module = {
        SuperLazyPromise: require('superlazypromise').SuperLazyPromise
    };
} else {
    _exports = window;
    _module = _exports;
}

(function (module, exports) {
    var SuperLazyPromise = module.SuperLazyPromise;

    var EMPTY_FN = function EMPTY_FN() {},
        NS_SEPARATOR = '.';

    var EventEmitter = function () {
        function EventEmitter() {
            _classCallCheck(this, EventEmitter);

            this._promises = new Map();
        }

        _createClass(EventEmitter, [{
            key: 'on',
            value: function on(event) {
                var SLP = this._promises.get(event),
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
        }, {
            key: 'off',
            value: function off(event) {
                if (!event.includes(NS_SEPARATOR)) {
                    this._destroyPromise(event);
                } else {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = this._promises[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var keyVal = _step.value;

                            if (keyVal[0].split(NS_SEPARATOR)[0] === event) {
                                this._destroyPromise(keyVal[0]);
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                }
            }
        }, {
            key: '_destroyPromise',
            value: function _destroyPromise(event) {
                this._promises[event].kill();
                delete this._promises[event];
            }
        }, {
            key: 'emit',
            value: function emit(event) {
                for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    data[_key - 1] = arguments[_key];
                }

                var executor = function executor(ok, ko) {
                    return ok.apply(undefined, data);
                };

                var SLP = this._promises.get(event),
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

                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = this._promises[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var keyVal = _step2.value;

                            if (keyVal[0].includes(NS_SEPARATOR) && keyVal[0].split(NS_SEPARATOR)[0] === event) {
                                var subEvent = keyVal[0],
                                    subPromise = this._promises.get(subEvent);
                                subPromise.updatePromise(SLP.promise);
                                subPromise.awake();
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            }
        }]);

        return EventEmitter;
    }();

    exports.EventEmitter = EventEmitter;
})(_module, _exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50RW1pdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Ii4uL2Jpbi9FdmVudEVtaXR0ZXIuYnJvd3Nlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIF9tb2R1bGUgPSBudWxsLFxuICAgIF9leHBvcnRzID0gbnVsbDtcbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIF9leHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XG4gICAgX21vZHVsZSA9IHtcbiAgICAgICAgU3VwZXJMYXp5UHJvbWlzZTogcmVxdWlyZSgnc3VwZXJsYXp5cHJvbWlzZScpLlN1cGVyTGF6eVByb21pc2VcbiAgICB9O1xufSBlbHNlIHtcbiAgICBfZXhwb3J0cyA9IHdpbmRvdztcbiAgICBfbW9kdWxlID0gX2V4cG9ydHM7XG59XG5cbihmdW5jdGlvbiAobW9kdWxlLCBleHBvcnRzKSB7XG4gICAgdmFyIFN1cGVyTGF6eVByb21pc2UgPSBtb2R1bGUuU3VwZXJMYXp5UHJvbWlzZTtcblxuICAgIHZhciBFTVBUWV9GTiA9IGZ1bmN0aW9uIEVNUFRZX0ZOKCkge30sXG4gICAgICAgIE5TX1NFUEFSQVRPUiA9ICcuJztcblxuICAgIHZhciBFdmVudEVtaXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgICAgICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBFdmVudEVtaXR0ZXIpO1xuXG4gICAgICAgICAgICB0aGlzLl9wcm9taXNlcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9jcmVhdGVDbGFzcyhFdmVudEVtaXR0ZXIsIFt7XG4gICAgICAgICAgICBrZXk6ICdvbicsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgU0xQID0gdGhpcy5fcHJvbWlzZXMuZ2V0KGV2ZW50KSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQ29udGV4dCA9IGV2ZW50LmluY2x1ZGVzKE5TX1NFUEFSQVRPUiksXG4gICAgICAgICAgICAgICAgICAgIHNwbGl0RXZlbnQgPSBldmVudC5zcGxpdChOU19TRVBBUkFUT1IpLFxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlTWFpbkV2ZW50ID0gdGhpcy5fcHJvbWlzZXMuZ2V0KHNwbGl0RXZlbnRbMF0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKGhhc0NvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNMUCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwcm9taXNlTWFpbkV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZU1haW5FdmVudCA9IG5ldyBTdXBlckxhenlQcm9taXNlKFNMUC5mbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZU1haW5FdmVudC51cGRhdGVQcm9taXNlKFNMUC5wcm9taXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9taXNlcy5zZXQoc3BsaXRFdmVudFswXSwgcHJvbWlzZU1haW5FdmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZU1haW5FdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNMUCA9IG5ldyBTdXBlckxhenlQcm9taXNlKHByb21pc2VNYWluRXZlbnQuZm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNMUC51cGRhdGVQcm9taXNlKHByb21pc2VNYWluRXZlbnQucHJvbWlzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvbWlzZXMuc2V0KGV2ZW50LCBTTFApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9taXNlcy5zZXQoc3BsaXRFdmVudFswXSwgbmV3IFN1cGVyTGF6eVByb21pc2UoRU1QVFlfRk4pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9taXNlcy5zZXQoZXZlbnQsIG5ldyBTdXBlckxhenlQcm9taXNlKEVNUFRZX0ZOKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIVNMUCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvbWlzZXMuc2V0KGV2ZW50LCBuZXcgU3VwZXJMYXp5UHJvbWlzZShFTVBUWV9GTikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcm9taXNlcy5nZXQoZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6ICdvZmYnLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9mZihldmVudCkge1xuICAgICAgICAgICAgICAgIGlmICghZXZlbnQuaW5jbHVkZXMoTlNfU0VQQVJBVE9SKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZXN0cm95UHJvbWlzZShldmVudCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSB0aGlzLl9wcm9taXNlc1tTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSAoX3N0ZXAgPSBfaXRlcmF0b3IubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIga2V5VmFsID0gX3N0ZXAudmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5VmFsWzBdLnNwbGl0KE5TX1NFUEFSQVRPUilbMF0gPT09IGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3lQcm9taXNlKGtleVZhbFswXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kaWRJdGVyYXRvckVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pdGVyYXRvckVycm9yID0gZXJyO1xuICAgICAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gJiYgX2l0ZXJhdG9yLnJldHVybikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6ICdfZGVzdHJveVByb21pc2UnLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9kZXN0cm95UHJvbWlzZShldmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb21pc2VzW2V2ZW50XS5raWxsKCk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3Byb21pc2VzW2V2ZW50XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnZW1pdCcsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZW1pdChldmVudCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBkYXRhID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgZXhlY3V0b3IgPSBmdW5jdGlvbiBleGVjdXRvcihvaywga28pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9rLmFwcGx5KHVuZGVmaW5lZCwgZGF0YSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZhciBTTFAgPSB0aGlzLl9wcm9taXNlcy5nZXQoZXZlbnQpLFxuICAgICAgICAgICAgICAgICAgICBoYXNDb250ZXh0ID0gZXZlbnQuaW5jbHVkZXMoTlNfU0VQQVJBVE9SKSxcbiAgICAgICAgICAgICAgICAgICAgc3BsaXRFdmVudCA9IGV2ZW50LnNwbGl0KE5TX1NFUEFSQVRPUiksXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VNYWluRXZlbnQgPSB0aGlzLl9wcm9taXNlcy5nZXQoc3BsaXRFdmVudFswXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaGFzQ29udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoU0xQKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBTTFAuYXdha2UoZXhlY3V0b3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2VNYWluRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlTWFpbkV2ZW50LmF3YWtlKGV4ZWN1dG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZU1haW5FdmVudCA9IG5ldyBTdXBlckxhenlQcm9taXNlKEVNUFRZX0ZOKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlTWFpbkV2ZW50LnVwZGF0ZVByb21pc2UoU0xQLnByb21pc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb21pc2VzLnNldChzcGxpdEV2ZW50WzBdLCBwcm9taXNlTWFpbkV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlTWFpbkV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZU1haW5FdmVudC5hd2FrZShleGVjdXRvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU0xQID0gbmV3IFN1cGVyTGF6eVByb21pc2UoRU1QVFlfRk4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNMUC51cGRhdGVQcm9taXNlKHByb21pc2VNYWluRXZlbnQucHJvbWlzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VNYWluRXZlbnQgPSBuZXcgU3VwZXJMYXp5UHJvbWlzZShleGVjdXRvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZU1haW5FdmVudC5hd2FrZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNMUCA9IG5ldyBTdXBlckxhenlQcm9taXNlKEVNUFRZX0ZOKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTTFAudXBkYXRlUHJvbWlzZShwcm9taXNlTWFpbkV2ZW50LnByb21pc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNMUCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgU0xQLmF3YWtlKGV4ZWN1dG9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFNMUCA9IG5ldyBTdXBlckxhenlQcm9taXNlKGV4ZWN1dG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFNMUC5hd2FrZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvbWlzZXMuc2V0KGV2ZW50LCBTTFApO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yMiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IyID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyID0gdGhpcy5fcHJvbWlzZXNbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDI7ICEoX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjIgPSAoX3N0ZXAyID0gX2l0ZXJhdG9yMi5uZXh0KCkpLmRvbmUpOyBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMiA9IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIga2V5VmFsID0gX3N0ZXAyLnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleVZhbFswXS5pbmNsdWRlcyhOU19TRVBBUkFUT1IpICYmIGtleVZhbFswXS5zcGxpdChOU19TRVBBUkFUT1IpWzBdID09PSBldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3ViRXZlbnQgPSBrZXlWYWxbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJQcm9taXNlID0gdGhpcy5fcHJvbWlzZXMuZ2V0KHN1YkV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViUHJvbWlzZS51cGRhdGVQcm9taXNlKFNMUC5wcm9taXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViUHJvbWlzZS5hd2FrZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvcjIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2l0ZXJhdG9yRXJyb3IyID0gZXJyO1xuICAgICAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yICYmIF9pdGVyYXRvcjIucmV0dXJuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pdGVyYXRvcjIucmV0dXJuKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1dKTtcblxuICAgICAgICByZXR1cm4gRXZlbnRFbWl0dGVyO1xuICAgIH0oKTtcblxuICAgIGV4cG9ydHMuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xufSkoX21vZHVsZSwgX2V4cG9ydHMpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
