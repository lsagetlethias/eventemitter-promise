'use strict';

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

((module, exports) => {
    const SuperLazyPromise = module.SuperLazyPromise;

    const EMPTY_FN = function EMPTY_FN() {},
          NS_SEPARATOR = '.';

    class EventEmitter {
        constructor() {
            this._promises = new Map();
        }

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

        _destroyPromise(event) {
            this._promises[event].kill();
            delete this._promises[event];
        }

        emit(event) {
            for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                data[_key - 1] = arguments[_key];
            }

            const executor = (ok, ko) => ok.apply(undefined, data);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJFdmVudEVtaXR0ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX21vZHVsZSA9IG51bGwsXG4gICAgX2V4cG9ydHMgPSBudWxsO1xuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgX2V4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cztcbiAgICBfbW9kdWxlID0ge1xuICAgICAgICBTdXBlckxhenlQcm9taXNlOiByZXF1aXJlKCdzdXBlcmxhenlwcm9taXNlJykuU3VwZXJMYXp5UHJvbWlzZVxuICAgIH07XG59IGVsc2Uge1xuICAgIF9leHBvcnRzID0gd2luZG93O1xuICAgIF9tb2R1bGUgPSBfZXhwb3J0cztcbn1cblxuKChtb2R1bGUsIGV4cG9ydHMpID0+IHtcbiAgICBjb25zdCBTdXBlckxhenlQcm9taXNlID0gbW9kdWxlLlN1cGVyTGF6eVByb21pc2U7XG5cbiAgICBjb25zdCBFTVBUWV9GTiA9IGZ1bmN0aW9uIEVNUFRZX0ZOKCkge30sXG4gICAgICAgICAgTlNfU0VQQVJBVE9SID0gJy4nO1xuXG4gICAgY2xhc3MgRXZlbnRFbWl0dGVyIHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9taXNlcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9uKGV2ZW50KSB7XG4gICAgICAgICAgICBsZXQgU0xQID0gdGhpcy5fcHJvbWlzZXMuZ2V0KGV2ZW50KSxcbiAgICAgICAgICAgICAgICBoYXNDb250ZXh0ID0gZXZlbnQuaW5jbHVkZXMoTlNfU0VQQVJBVE9SKSxcbiAgICAgICAgICAgICAgICBzcGxpdEV2ZW50ID0gZXZlbnQuc3BsaXQoTlNfU0VQQVJBVE9SKSxcbiAgICAgICAgICAgICAgICBwcm9taXNlTWFpbkV2ZW50ID0gdGhpcy5fcHJvbWlzZXMuZ2V0KHNwbGl0RXZlbnRbMF0pO1xuXG4gICAgICAgICAgICBpZiAoaGFzQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGlmIChTTFApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwcm9taXNlTWFpbkV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlTWFpbkV2ZW50ID0gbmV3IFN1cGVyTGF6eVByb21pc2UoU0xQLmZuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VNYWluRXZlbnQudXBkYXRlUHJvbWlzZShTTFAucHJvbWlzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9taXNlcy5zZXQoc3BsaXRFdmVudFswXSwgcHJvbWlzZU1haW5FdmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZU1haW5FdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgU0xQID0gbmV3IFN1cGVyTGF6eVByb21pc2UocHJvbWlzZU1haW5FdmVudC5mbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBTTFAudXBkYXRlUHJvbWlzZShwcm9taXNlTWFpbkV2ZW50LnByb21pc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvbWlzZXMuc2V0KGV2ZW50LCBTTFApO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvbWlzZXMuc2V0KHNwbGl0RXZlbnRbMF0sIG5ldyBTdXBlckxhenlQcm9taXNlKEVNUFRZX0ZOKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9taXNlcy5zZXQoZXZlbnQsIG5ldyBTdXBlckxhenlQcm9taXNlKEVNUFRZX0ZOKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghU0xQKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb21pc2VzLnNldChldmVudCwgbmV3IFN1cGVyTGF6eVByb21pc2UoRU1QVFlfRk4pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJvbWlzZXMuZ2V0KGV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9mZihldmVudCkge1xuICAgICAgICAgICAgaWYgKCFldmVudC5pbmNsdWRlcyhOU19TRVBBUkFUT1IpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVzdHJveVByb21pc2UoZXZlbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrZXlWYWwgb2YgdGhpcy5fcHJvbWlzZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleVZhbFswXS5zcGxpdChOU19TRVBBUkFUT1IpWzBdID09PSBldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVzdHJveVByb21pc2Uoa2V5VmFsWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9kZXN0cm95UHJvbWlzZShldmVudCkge1xuICAgICAgICAgICAgdGhpcy5fcHJvbWlzZXNbZXZlbnRdLmtpbGwoKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wcm9taXNlc1tldmVudF07XG4gICAgICAgIH1cblxuICAgICAgICBlbWl0KGV2ZW50KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgZGF0YSA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgICAgICAgICBkYXRhW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZXhlY3V0b3IgPSAob2ssIGtvKSA9PiBvay5hcHBseSh1bmRlZmluZWQsIGRhdGEpO1xuXG4gICAgICAgICAgICBsZXQgU0xQID0gdGhpcy5fcHJvbWlzZXMuZ2V0KGV2ZW50KSxcbiAgICAgICAgICAgICAgICBoYXNDb250ZXh0ID0gZXZlbnQuaW5jbHVkZXMoTlNfU0VQQVJBVE9SKSxcbiAgICAgICAgICAgICAgICBzcGxpdEV2ZW50ID0gZXZlbnQuc3BsaXQoTlNfU0VQQVJBVE9SKSxcbiAgICAgICAgICAgICAgICBwcm9taXNlTWFpbkV2ZW50ID0gdGhpcy5fcHJvbWlzZXMuZ2V0KHNwbGl0RXZlbnRbMF0pO1xuXG4gICAgICAgICAgICBpZiAoaGFzQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIGlmIChTTFApIHtcbiAgICAgICAgICAgICAgICAgICAgU0xQLmF3YWtlKGV4ZWN1dG9yKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2VNYWluRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VNYWluRXZlbnQuYXdha2UoZXhlY3V0b3IpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZU1haW5FdmVudCA9IG5ldyBTdXBlckxhenlQcm9taXNlKEVNUFRZX0ZOKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VNYWluRXZlbnQudXBkYXRlUHJvbWlzZShTTFAucHJvbWlzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9taXNlcy5zZXQoc3BsaXRFdmVudFswXSwgcHJvbWlzZU1haW5FdmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZU1haW5FdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZU1haW5FdmVudC5hd2FrZShleGVjdXRvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBTTFAgPSBuZXcgU3VwZXJMYXp5UHJvbWlzZShFTVBUWV9GTik7XG4gICAgICAgICAgICAgICAgICAgICAgICBTTFAudXBkYXRlUHJvbWlzZShwcm9taXNlTWFpbkV2ZW50LnByb21pc2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZU1haW5FdmVudCA9IG5ldyBTdXBlckxhenlQcm9taXNlKGV4ZWN1dG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VNYWluRXZlbnQuYXdha2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFNMUCA9IG5ldyBTdXBlckxhenlQcm9taXNlKEVNUFRZX0ZOKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFNMUC51cGRhdGVQcm9taXNlKHByb21pc2VNYWluRXZlbnQucHJvbWlzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChTTFApIHtcbiAgICAgICAgICAgICAgICAgICAgU0xQLmF3YWtlKGV4ZWN1dG9yKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBTTFAgPSBuZXcgU3VwZXJMYXp5UHJvbWlzZShleGVjdXRvcik7XG4gICAgICAgICAgICAgICAgICAgIFNMUC5hd2FrZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9taXNlcy5zZXQoZXZlbnQsIFNMUCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQga2V5VmFsIG9mIHRoaXMuX3Byb21pc2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXlWYWxbMF0uaW5jbHVkZXMoTlNfU0VQQVJBVE9SKSAmJiBrZXlWYWxbMF0uc3BsaXQoTlNfU0VQQVJBVE9SKVswXSA9PT0gZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdWJFdmVudCA9IGtleVZhbFswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJQcm9taXNlID0gdGhpcy5fcHJvbWlzZXMuZ2V0KHN1YkV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YlByb21pc2UudXBkYXRlUHJvbWlzZShTTFAucHJvbWlzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJQcm9taXNlLmF3YWtlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnRzLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcbn0pKF9tb2R1bGUsIF9leHBvcnRzKTsiXSwiZmlsZSI6IkV2ZW50RW1pdHRlci5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
