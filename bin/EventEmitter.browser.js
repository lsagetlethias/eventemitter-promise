'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _module = null,
    _exports = null;
if (module && module.exports) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50RW1pdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Ii4uL2Jpbi9FdmVudEVtaXR0ZXIuYnJvd3Nlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIF9tb2R1bGUgPSBudWxsLFxuICAgIF9leHBvcnRzID0gbnVsbDtcbmlmIChtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBfZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzO1xuICAgIF9tb2R1bGUgPSB7XG4gICAgICAgIFN1cGVyTGF6eVByb21pc2U6IHJlcXVpcmUoJ3N1cGVybGF6eXByb21pc2UnKS5TdXBlckxhenlQcm9taXNlXG4gICAgfTtcbn0gZWxzZSB7XG4gICAgX2V4cG9ydHMgPSB3aW5kb3c7XG4gICAgX21vZHVsZSA9IF9leHBvcnRzO1xufVxuXG4oZnVuY3Rpb24gKG1vZHVsZSwgZXhwb3J0cykge1xuICAgIHZhciBTdXBlckxhenlQcm9taXNlID0gbW9kdWxlLlN1cGVyTGF6eVByb21pc2U7XG5cbiAgICB2YXIgRU1QVFlfRk4gPSBmdW5jdGlvbiBFTVBUWV9GTigpIHt9LFxuICAgICAgICBOU19TRVBBUkFUT1IgPSAnLic7XG5cbiAgICB2YXIgRXZlbnRFbWl0dGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gICAgICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRXZlbnRFbWl0dGVyKTtcblxuICAgICAgICAgICAgdGhpcy5fcHJvbWlzZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIH1cblxuICAgICAgICBfY3JlYXRlQ2xhc3MoRXZlbnRFbWl0dGVyLCBbe1xuICAgICAgICAgICAga2V5OiAnb24nLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIFNMUCA9IHRoaXMuX3Byb21pc2VzLmdldChldmVudCksXG4gICAgICAgICAgICAgICAgICAgIGhhc0NvbnRleHQgPSBldmVudC5pbmNsdWRlcyhOU19TRVBBUkFUT1IpLFxuICAgICAgICAgICAgICAgICAgICBzcGxpdEV2ZW50ID0gZXZlbnQuc3BsaXQoTlNfU0VQQVJBVE9SKSxcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZU1haW5FdmVudCA9IHRoaXMuX3Byb21pc2VzLmdldChzcGxpdEV2ZW50WzBdKTtcblxuICAgICAgICAgICAgICAgIGlmIChoYXNDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChTTFApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcHJvbWlzZU1haW5FdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VNYWluRXZlbnQgPSBuZXcgU3VwZXJMYXp5UHJvbWlzZShTTFAuZm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VNYWluRXZlbnQudXBkYXRlUHJvbWlzZShTTFAucHJvbWlzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvbWlzZXMuc2V0KHNwbGl0RXZlbnRbMF0sIHByb21pc2VNYWluRXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2VNYWluRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTTFAgPSBuZXcgU3VwZXJMYXp5UHJvbWlzZShwcm9taXNlTWFpbkV2ZW50LmZuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTTFAudXBkYXRlUHJvbWlzZShwcm9taXNlTWFpbkV2ZW50LnByb21pc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb21pc2VzLnNldChldmVudCwgU0xQKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvbWlzZXMuc2V0KHNwbGl0RXZlbnRbMF0sIG5ldyBTdXBlckxhenlQcm9taXNlKEVNUFRZX0ZOKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvbWlzZXMuc2V0KGV2ZW50LCBuZXcgU3VwZXJMYXp5UHJvbWlzZShFTVBUWV9GTikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFTTFApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb21pc2VzLnNldChldmVudCwgbmV3IFN1cGVyTGF6eVByb21pc2UoRU1QVFlfRk4pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJvbWlzZXMuZ2V0KGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnb2ZmJyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvZmYoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWV2ZW50LmluY2x1ZGVzKE5TX1NFUEFSQVRPUikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVzdHJveVByb21pc2UoZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfaXRlcmF0b3JFcnJvciA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gdGhpcy5fcHJvbWlzZXNbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gKF9zdGVwID0gX2l0ZXJhdG9yLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtleVZhbCA9IF9zdGVwLnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleVZhbFswXS5zcGxpdChOU19TRVBBUkFUT1IpWzBdID09PSBldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZXN0cm95UHJvbWlzZShrZXlWYWxbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaXRlcmF0b3JFcnJvciA9IGVycjtcbiAgICAgICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uICYmIF9pdGVyYXRvci5yZXR1cm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2l0ZXJhdG9yLnJldHVybigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnX2Rlc3Ryb3lQcm9taXNlJyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZGVzdHJveVByb21pc2UoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9taXNlc1tldmVudF0ua2lsbCgpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wcm9taXNlc1tldmVudF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogJ2VtaXQnLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGVtaXQoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgZGF0YSA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGV4ZWN1dG9yID0gZnVuY3Rpb24gZXhlY3V0b3Iob2ssIGtvKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvay5hcHBseSh1bmRlZmluZWQsIGRhdGEpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgU0xQID0gdGhpcy5fcHJvbWlzZXMuZ2V0KGV2ZW50KSxcbiAgICAgICAgICAgICAgICAgICAgaGFzQ29udGV4dCA9IGV2ZW50LmluY2x1ZGVzKE5TX1NFUEFSQVRPUiksXG4gICAgICAgICAgICAgICAgICAgIHNwbGl0RXZlbnQgPSBldmVudC5zcGxpdChOU19TRVBBUkFUT1IpLFxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlTWFpbkV2ZW50ID0gdGhpcy5fcHJvbWlzZXMuZ2V0KHNwbGl0RXZlbnRbMF0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKGhhc0NvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNMUCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgU0xQLmF3YWtlKGV4ZWN1dG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlTWFpbkV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZU1haW5FdmVudC5hd2FrZShleGVjdXRvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VNYWluRXZlbnQgPSBuZXcgU3VwZXJMYXp5UHJvbWlzZShFTVBUWV9GTik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZU1haW5FdmVudC51cGRhdGVQcm9taXNlKFNMUC5wcm9taXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9taXNlcy5zZXQoc3BsaXRFdmVudFswXSwgcHJvbWlzZU1haW5FdmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZU1haW5FdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VNYWluRXZlbnQuYXdha2UoZXhlY3V0b3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNMUCA9IG5ldyBTdXBlckxhenlQcm9taXNlKEVNUFRZX0ZOKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTTFAudXBkYXRlUHJvbWlzZShwcm9taXNlTWFpbkV2ZW50LnByb21pc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlTWFpbkV2ZW50ID0gbmV3IFN1cGVyTGF6eVByb21pc2UoZXhlY3V0b3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VNYWluRXZlbnQuYXdha2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTTFAgPSBuZXcgU3VwZXJMYXp5UHJvbWlzZShFTVBUWV9GTik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU0xQLnVwZGF0ZVByb21pc2UocHJvbWlzZU1haW5FdmVudC5wcm9taXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChTTFApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFNMUC5hd2FrZShleGVjdXRvcik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBTTFAgPSBuZXcgU3VwZXJMYXp5UHJvbWlzZShleGVjdXRvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBTTFAuYXdha2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb21pc2VzLnNldChldmVudCwgU0xQKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvcjIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yMiA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMiA9IHRoaXMuX3Byb21pc2VzW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXAyOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yID0gKF9zdGVwMiA9IF9pdGVyYXRvcjIubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjIgPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtleVZhbCA9IF9zdGVwMi52YWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXlWYWxbMF0uaW5jbHVkZXMoTlNfU0VQQVJBVE9SKSAmJiBrZXlWYWxbMF0uc3BsaXQoTlNfU0VQQVJBVE9SKVswXSA9PT0gZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1YkV2ZW50ID0ga2V5VmFsWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViUHJvbWlzZSA9IHRoaXMuX3Byb21pc2VzLmdldChzdWJFdmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YlByb21pc2UudXBkYXRlUHJvbWlzZShTTFAucHJvbWlzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YlByb21pc2UuYXdha2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pdGVyYXRvckVycm9yMiA9IGVycjtcbiAgICAgICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMiAmJiBfaXRlcmF0b3IyLnJldHVybikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaXRlcmF0b3IyLnJldHVybigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XSk7XG5cbiAgICAgICAgcmV0dXJuIEV2ZW50RW1pdHRlcjtcbiAgICB9KCk7XG5cbiAgICBleHBvcnRzLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcbn0pKF9tb2R1bGUsIF9leHBvcnRzKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
