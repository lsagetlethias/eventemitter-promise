'use strict';

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJFdmVudEVtaXR0ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX21vZHVsZSA9IG51bGwsXG4gICAgX2V4cG9ydHMgPSBudWxsO1xuaWYgKG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIF9leHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XG4gICAgX21vZHVsZSA9IHtcbiAgICAgICAgU3VwZXJMYXp5UHJvbWlzZTogcmVxdWlyZSgnc3VwZXJsYXp5cHJvbWlzZScpLlN1cGVyTGF6eVByb21pc2VcbiAgICB9O1xufSBlbHNlIHtcbiAgICBfZXhwb3J0cyA9IHdpbmRvdztcbiAgICBfbW9kdWxlID0gX2V4cG9ydHM7XG59XG5cbigobW9kdWxlLCBleHBvcnRzKSA9PiB7XG4gICAgY29uc3QgU3VwZXJMYXp5UHJvbWlzZSA9IG1vZHVsZS5TdXBlckxhenlQcm9taXNlO1xuXG4gICAgY29uc3QgRU1QVFlfRk4gPSBmdW5jdGlvbiBFTVBUWV9GTigpIHt9LFxuICAgICAgICAgIE5TX1NFUEFSQVRPUiA9ICcuJztcblxuICAgIGNsYXNzIEV2ZW50RW1pdHRlciB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhpcy5fcHJvbWlzZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIH1cblxuICAgICAgICBvbihldmVudCkge1xuICAgICAgICAgICAgbGV0IFNMUCA9IHRoaXMuX3Byb21pc2VzLmdldChldmVudCksXG4gICAgICAgICAgICAgICAgaGFzQ29udGV4dCA9IGV2ZW50LmluY2x1ZGVzKE5TX1NFUEFSQVRPUiksXG4gICAgICAgICAgICAgICAgc3BsaXRFdmVudCA9IGV2ZW50LnNwbGl0KE5TX1NFUEFSQVRPUiksXG4gICAgICAgICAgICAgICAgcHJvbWlzZU1haW5FdmVudCA9IHRoaXMuX3Byb21pc2VzLmdldChzcGxpdEV2ZW50WzBdKTtcblxuICAgICAgICAgICAgaWYgKGhhc0NvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoU0xQKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcHJvbWlzZU1haW5FdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZU1haW5FdmVudCA9IG5ldyBTdXBlckxhenlQcm9taXNlKFNMUC5mbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlTWFpbkV2ZW50LnVwZGF0ZVByb21pc2UoU0xQLnByb21pc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvbWlzZXMuc2V0KHNwbGl0RXZlbnRbMF0sIHByb21pc2VNYWluRXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2VNYWluRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFNMUCA9IG5ldyBTdXBlckxhenlQcm9taXNlKHByb21pc2VNYWluRXZlbnQuZm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgU0xQLnVwZGF0ZVByb21pc2UocHJvbWlzZU1haW5FdmVudC5wcm9taXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb21pc2VzLnNldChldmVudCwgU0xQKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb21pc2VzLnNldChzcGxpdEV2ZW50WzBdLCBuZXcgU3VwZXJMYXp5UHJvbWlzZShFTVBUWV9GTikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvbWlzZXMuc2V0KGV2ZW50LCBuZXcgU3VwZXJMYXp5UHJvbWlzZShFTVBUWV9GTikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIVNMUCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9taXNlcy5zZXQoZXZlbnQsIG5ldyBTdXBlckxhenlQcm9taXNlKEVNUFRZX0ZOKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Byb21pc2VzLmdldChldmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBvZmYoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICghZXZlbnQuaW5jbHVkZXMoTlNfU0VQQVJBVE9SKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3lQcm9taXNlKGV2ZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQga2V5VmFsIG9mIHRoaXMuX3Byb21pc2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXlWYWxbMF0uc3BsaXQoTlNfU0VQQVJBVE9SKVswXSA9PT0gZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3lQcm9taXNlKGtleVZhbFswXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfZGVzdHJveVByb21pc2UoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb21pc2VzW2V2ZW50XS5raWxsKCk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fcHJvbWlzZXNbZXZlbnRdO1xuICAgICAgICB9XG5cbiAgICAgICAgZW1pdChldmVudCkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGRhdGEgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICAgICAgICAgICAgZGF0YVtfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGV4ZWN1dG9yID0gKG9rLCBrbykgPT4gb2suYXBwbHkodW5kZWZpbmVkLCBkYXRhKTtcblxuICAgICAgICAgICAgbGV0IFNMUCA9IHRoaXMuX3Byb21pc2VzLmdldChldmVudCksXG4gICAgICAgICAgICAgICAgaGFzQ29udGV4dCA9IGV2ZW50LmluY2x1ZGVzKE5TX1NFUEFSQVRPUiksXG4gICAgICAgICAgICAgICAgc3BsaXRFdmVudCA9IGV2ZW50LnNwbGl0KE5TX1NFUEFSQVRPUiksXG4gICAgICAgICAgICAgICAgcHJvbWlzZU1haW5FdmVudCA9IHRoaXMuX3Byb21pc2VzLmdldChzcGxpdEV2ZW50WzBdKTtcblxuICAgICAgICAgICAgaWYgKGhhc0NvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoU0xQKSB7XG4gICAgICAgICAgICAgICAgICAgIFNMUC5hd2FrZShleGVjdXRvcik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlTWFpbkV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlTWFpbkV2ZW50LmF3YWtlKGV4ZWN1dG9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VNYWluRXZlbnQgPSBuZXcgU3VwZXJMYXp5UHJvbWlzZShFTVBUWV9GTik7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlTWFpbkV2ZW50LnVwZGF0ZVByb21pc2UoU0xQLnByb21pc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvbWlzZXMuc2V0KHNwbGl0RXZlbnRbMF0sIHByb21pc2VNYWluRXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2VNYWluRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VNYWluRXZlbnQuYXdha2UoZXhlY3V0b3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgU0xQID0gbmV3IFN1cGVyTGF6eVByb21pc2UoRU1QVFlfRk4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgU0xQLnVwZGF0ZVByb21pc2UocHJvbWlzZU1haW5FdmVudC5wcm9taXNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VNYWluRXZlbnQgPSBuZXcgU3VwZXJMYXp5UHJvbWlzZShleGVjdXRvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlTWFpbkV2ZW50LmF3YWtlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBTTFAgPSBuZXcgU3VwZXJMYXp5UHJvbWlzZShFTVBUWV9GTik7XG4gICAgICAgICAgICAgICAgICAgICAgICBTTFAudXBkYXRlUHJvbWlzZShwcm9taXNlTWFpbkV2ZW50LnByb21pc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoU0xQKSB7XG4gICAgICAgICAgICAgICAgICAgIFNMUC5hd2FrZShleGVjdXRvcik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgU0xQID0gbmV3IFN1cGVyTGF6eVByb21pc2UoZXhlY3V0b3IpO1xuICAgICAgICAgICAgICAgICAgICBTTFAuYXdha2UoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvbWlzZXMuc2V0KGV2ZW50LCBTTFApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGtleVZhbCBvZiB0aGlzLl9wcm9taXNlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5VmFsWzBdLmluY2x1ZGVzKE5TX1NFUEFSQVRPUikgJiYga2V5VmFsWzBdLnNwbGl0KE5TX1NFUEFSQVRPUilbMF0gPT09IGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3ViRXZlbnQgPSBrZXlWYWxbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViUHJvbWlzZSA9IHRoaXMuX3Byb21pc2VzLmdldChzdWJFdmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJQcm9taXNlLnVwZGF0ZVByb21pc2UoU0xQLnByb21pc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3ViUHJvbWlzZS5hd2FrZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG59KShfbW9kdWxlLCBfZXhwb3J0cyk7Il0sImZpbGUiOiJFdmVudEVtaXR0ZXIuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
