// 先监听，后发射事件储存对象
var events = {};
// 先反射，后监听事件储存对象
var storageEvent = {};

function on(name, self, callback) {
    var tuple = [self, callback];
    var callbacks = events[name];
    if (Array.isArray(callbacks)) {
        callbacks.push(tuple);
    } else {
        callbacks = storageEvent[name];
        if (Array.isArray(callbacks)) {
            callbacks.map((tuple) => {
                var data = tuple[0];
                callback.call(self, data);
            })
        } else {
            events[name] = [tuple];
        }
    }
}

function remove(name, self) {
    var callbacks = events[name];
    if (Array.isArray(callbacks)) {
        events[name] = callbacks.filter((tuple) => {
            return tuple[0] != self;
        })
    } else {
        callbacks = storageEvent[name];
        if (Array.isArray(callbacks)) {
            delete storageEvent[name];
        }
    }
}

function emit(name, data) {
    var callbacks = events[name];
    if (Array.isArray(callbacks)) {
        callbacks.map((tuple) => {
            var self = tuple[0];
            var callback = tuple[1];
            callback.call(self, data);
        })
    } else {
        callbacks = storageEvent[name];
        var tuple = [data || 'data'];
        if (Array.isArray(callbacks)) {
            callbacks.push(tuple);
        } else {
            storageEvent[name] = tuple
        }
    }
}

exports.on = on;
exports.remove = remove;
exports.emit = emit;
