# eventemitter-promise

Event Emitter with lazy promise ! (see http://github.com/bios21/superlazypromise)

## Installation

Then install it via npm:

``` bash
$ npm install --save eventemitter-promise
```

Or via bower:

``` bash
$ bower install --save eventemitter-promise
```

## Example Usage

Each listener are stored to be fired later on a `SuperLazyPromise`
     
|     emit\on    | event | event.* | event.context | event.context! |
|:--------------:|:-----:|:-------:|:-------------:|:--------------:|
|      event     |   ✓   |    ✓    |       ✓       |        ✓       |
|  event.context |   ✓   |         |       ✓       |        ✓       |
| event.context! |       |         |       ✓       |        ✓       |
     
**!** : Firing an event on strict context (`event.context!`) is not yet implemented.

``` js
const EventEmitter = require('eventemitter-promise');

class Clazz extends EventEmitter {
    emit() {
    }
    on() {
    }
}
```


License
----

ISC License. See the `LICENSE` file.
