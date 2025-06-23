'use strict';

var obsidian = require('obsidian');

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var eventemitter2 = {exports: {}};

var hasRequiredEventemitter2;
function requireEventemitter2() {
  if (hasRequiredEventemitter2) return eventemitter2.exports;
  hasRequiredEventemitter2 = 1;
  (function(module, exports) {
    !function(undefined$1) {
      var hasOwnProperty = Object.hasOwnProperty;
      var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
      };
      var defaultMaxListeners = 10;
      var nextTickSupported = typeof process == "object" && typeof process.nextTick == "function";
      var symbolsSupported = typeof Symbol === "function";
      var reflectSupported = typeof Reflect === "object";
      var setImmediateSupported = typeof setImmediate === "function";
      var _setImmediate = setImmediateSupported ? setImmediate : setTimeout;
      var ownKeys = symbolsSupported ? reflectSupported && typeof Reflect.ownKeys === "function" ? Reflect.ownKeys : function(obj) {
        var arr = Object.getOwnPropertyNames(obj);
        arr.push.apply(arr, Object.getOwnPropertySymbols(obj));
        return arr;
      } : Object.keys;
      function init() {
        this._events = {};
        if (this._conf) {
          configure.call(this, this._conf);
        }
      }
      function configure(conf) {
        if (conf) {
          this._conf = conf;
          conf.delimiter && (this.delimiter = conf.delimiter);
          if (conf.maxListeners !== undefined$1) {
            this._maxListeners = conf.maxListeners;
          }
          conf.wildcard && (this.wildcard = conf.wildcard);
          conf.newListener && (this._newListener = conf.newListener);
          conf.removeListener && (this._removeListener = conf.removeListener);
          conf.verboseMemoryLeak && (this.verboseMemoryLeak = conf.verboseMemoryLeak);
          conf.ignoreErrors && (this.ignoreErrors = conf.ignoreErrors);
          if (this.wildcard) {
            this.listenerTree = {};
          }
        }
      }
      function logPossibleMemoryLeak(count, eventName) {
        var errorMsg = "(node) warning: possible EventEmitter memory leak detected. " + count + " listeners added. Use emitter.setMaxListeners() to increase limit.";
        if (this.verboseMemoryLeak) {
          errorMsg += " Event name: " + eventName + ".";
        }
        if (typeof process !== "undefined" && process.emitWarning) {
          var e = new Error(errorMsg);
          e.name = "MaxListenersExceededWarning";
          e.emitter = this;
          e.count = count;
          process.emitWarning(e);
        } else {
          console.error(errorMsg);
          if (console.trace) {
            console.trace();
          }
        }
      }
      var toArray = function(a, b, c) {
        var n = arguments.length;
        switch (n) {
          case 0:
            return [];
          case 1:
            return [a];
          case 2:
            return [a, b];
          case 3:
            return [a, b, c];
          default:
            var arr = new Array(n);
            while (n--) {
              arr[n] = arguments[n];
            }
            return arr;
        }
      };
      function toObject(keys, values) {
        var obj = {};
        var key;
        var len = keys.length;
        var valuesCount = 0;
        for (var i = 0; i < len; i++) {
          key = keys[i];
          obj[key] = i < valuesCount ? values[i] : undefined$1;
        }
        return obj;
      }
      function TargetObserver(emitter, target, options) {
        this._emitter = emitter;
        this._target = target;
        this._listeners = {};
        this._listenersCount = 0;
        var on, off;
        if (options.on || options.off) {
          on = options.on;
          off = options.off;
        }
        if (target.addEventListener) {
          on = target.addEventListener;
          off = target.removeEventListener;
        } else if (target.addListener) {
          on = target.addListener;
          off = target.removeListener;
        } else if (target.on) {
          on = target.on;
          off = target.off;
        }
        if (!on && !off) {
          throw Error("target does not implement any known event API");
        }
        if (typeof on !== "function") {
          throw TypeError("on method must be a function");
        }
        if (typeof off !== "function") {
          throw TypeError("off method must be a function");
        }
        this._on = on;
        this._off = off;
        var _observers = emitter._observers;
        if (_observers) {
          _observers.push(this);
        } else {
          emitter._observers = [this];
        }
      }
      Object.assign(TargetObserver.prototype, {
        subscribe: function(event, localEvent, reducer) {
          var observer = this;
          var target = this._target;
          var emitter = this._emitter;
          var listeners = this._listeners;
          var handler = function() {
            var args = toArray.apply(null, arguments);
            var eventObj = {
              data: args,
              name: localEvent,
              original: event
            };
            if (reducer) {
              var result = reducer.call(target, eventObj);
              if (result !== false) {
                emitter.emit.apply(emitter, [eventObj.name].concat(args));
              }
              return;
            }
            emitter.emit.apply(emitter, [localEvent].concat(args));
          };
          if (listeners[event]) {
            throw Error("Event '" + event + "' is already listening");
          }
          this._listenersCount++;
          if (emitter._newListener && emitter._removeListener && !observer._onNewListener) {
            this._onNewListener = function(_event) {
              if (_event === localEvent && listeners[event] === null) {
                listeners[event] = handler;
                observer._on.call(target, event, handler);
              }
            };
            emitter.on("newListener", this._onNewListener);
            this._onRemoveListener = function(_event) {
              if (_event === localEvent && !emitter.hasListeners(_event) && listeners[event]) {
                listeners[event] = null;
                observer._off.call(target, event, handler);
              }
            };
            listeners[event] = null;
            emitter.on("removeListener", this._onRemoveListener);
          } else {
            listeners[event] = handler;
            observer._on.call(target, event, handler);
          }
        },
        unsubscribe: function(event) {
          var observer = this;
          var listeners = this._listeners;
          var emitter = this._emitter;
          var handler;
          var events;
          var off = this._off;
          var target = this._target;
          var i;
          if (event && typeof event !== "string") {
            throw TypeError("event must be a string");
          }
          function clearRefs() {
            if (observer._onNewListener) {
              emitter.off("newListener", observer._onNewListener);
              emitter.off("removeListener", observer._onRemoveListener);
              observer._onNewListener = null;
              observer._onRemoveListener = null;
            }
            var index = findTargetIndex.call(emitter, observer);
            emitter._observers.splice(index, 1);
          }
          if (event) {
            handler = listeners[event];
            if (!handler) return;
            off.call(target, event, handler);
            delete listeners[event];
            if (!--this._listenersCount) {
              clearRefs();
            }
          } else {
            events = ownKeys(listeners);
            i = events.length;
            while (i-- > 0) {
              event = events[i];
              off.call(target, event, listeners[event]);
            }
            this._listeners = {};
            this._listenersCount = 0;
            clearRefs();
          }
        }
      });
      function resolveOptions(options, schema, reducers, allowUnknown) {
        var computedOptions = Object.assign({}, schema);
        if (!options) return computedOptions;
        if (typeof options !== "object") {
          throw TypeError("options must be an object");
        }
        var keys = Object.keys(options);
        var length = keys.length;
        var option, value;
        var reducer;
        function reject(reason) {
          throw Error('Invalid "' + option + '" option value' + (reason ? ". Reason: " + reason : ""));
        }
        for (var i = 0; i < length; i++) {
          option = keys[i];
          if (!hasOwnProperty.call(schema, option)) {
            throw Error('Unknown "' + option + '" option');
          }
          value = options[option];
          if (value !== undefined$1) {
            reducer = reducers[option];
            computedOptions[option] = reducer ? reducer(value, reject) : value;
          }
        }
        return computedOptions;
      }
      function constructorReducer(value, reject) {
        if (typeof value !== "function" || !value.hasOwnProperty("prototype")) {
          reject("value must be a constructor");
        }
        return value;
      }
      function makeTypeReducer(types) {
        var message = "value must be type of " + types.join("|");
        var len = types.length;
        var firstType = types[0];
        var secondType = types[1];
        if (len === 1) {
          return function(v, reject) {
            if (typeof v === firstType) {
              return v;
            }
            reject(message);
          };
        }
        if (len === 2) {
          return function(v, reject) {
            var kind = typeof v;
            if (kind === firstType || kind === secondType) return v;
            reject(message);
          };
        }
        return function(v, reject) {
          var kind = typeof v;
          var i = len;
          while (i-- > 0) {
            if (kind === types[i]) return v;
          }
          reject(message);
        };
      }
      var functionReducer = makeTypeReducer(["function"]);
      var objectFunctionReducer = makeTypeReducer(["object", "function"]);
      function makeCancelablePromise(Promise2, executor, options) {
        var isCancelable;
        var callbacks;
        var timer = 0;
        var subscriptionClosed;
        var promise = new Promise2(function(resolve, reject, onCancel) {
          options = resolveOptions(options, {
            timeout: 0,
            overload: false
          }, {
            timeout: function(value, reject2) {
              value *= 1;
              if (typeof value !== "number" || value < 0 || !Number.isFinite(value)) {
                reject2("timeout must be a positive number");
              }
              return value;
            }
          });
          isCancelable = !options.overload && typeof Promise2.prototype.cancel === "function" && typeof onCancel === "function";
          function cleanup() {
            if (callbacks) {
              callbacks = null;
            }
            if (timer) {
              clearTimeout(timer);
              timer = 0;
            }
          }
          var _resolve = function(value) {
            cleanup();
            resolve(value);
          };
          var _reject = function(err) {
            cleanup();
            reject(err);
          };
          if (isCancelable) {
            executor(_resolve, _reject, onCancel);
          } else {
            callbacks = [function(reason) {
              _reject(reason || Error("canceled"));
            }];
            executor(_resolve, _reject, function(cb) {
              if (subscriptionClosed) {
                throw Error("Unable to subscribe on cancel event asynchronously");
              }
              if (typeof cb !== "function") {
                throw TypeError("onCancel callback must be a function");
              }
              callbacks.push(cb);
            });
            subscriptionClosed = true;
          }
          if (options.timeout > 0) {
            timer = setTimeout(function() {
              var reason = Error("timeout");
              reason.code = "ETIMEDOUT";
              timer = 0;
              promise.cancel(reason);
              reject(reason);
            }, options.timeout);
          }
        });
        if (!isCancelable) {
          promise.cancel = function(reason) {
            if (!callbacks) {
              return;
            }
            var length = callbacks.length;
            for (var i = 1; i < length; i++) {
              callbacks[i](reason);
            }
            callbacks[0](reason);
            callbacks = null;
          };
        }
        return promise;
      }
      function findTargetIndex(observer) {
        var observers = this._observers;
        if (!observers) {
          return -1;
        }
        var len = observers.length;
        for (var i = 0; i < len; i++) {
          if (observers[i]._target === observer) return i;
        }
        return -1;
      }
      function searchListenerTree(handlers, type, tree, i, typeLength) {
        if (!tree) {
          return null;
        }
        if (i === 0) {
          var kind = typeof type;
          if (kind === "string") {
            var ns, n, l = 0, j = 0, delimiter = this.delimiter, dl = delimiter.length;
            if ((n = type.indexOf(delimiter)) !== -1) {
              ns = new Array(5);
              do {
                ns[l++] = type.slice(j, n);
                j = n + dl;
              } while ((n = type.indexOf(delimiter, j)) !== -1);
              ns[l++] = type.slice(j);
              type = ns;
              typeLength = l;
            } else {
              type = [type];
              typeLength = 1;
            }
          } else if (kind === "object") {
            typeLength = type.length;
          } else {
            type = [type];
            typeLength = 1;
          }
        }
        var listeners = null, branch, xTree, xxTree, isolatedBranch, endReached, currentType = type[i], nextType = type[i + 1], branches, _listeners;
        if (i === typeLength) {
          if (tree._listeners) {
            if (typeof tree._listeners === "function") {
              handlers && handlers.push(tree._listeners);
              listeners = [tree];
            } else {
              handlers && handlers.push.apply(handlers, tree._listeners);
              listeners = [tree];
            }
          }
        } else {
          if (currentType === "*") {
            branches = ownKeys(tree);
            n = branches.length;
            while (n-- > 0) {
              branch = branches[n];
              if (branch !== "_listeners") {
                _listeners = searchListenerTree(handlers, type, tree[branch], i + 1, typeLength);
                if (_listeners) {
                  if (listeners) {
                    listeners.push.apply(listeners, _listeners);
                  } else {
                    listeners = _listeners;
                  }
                }
              }
            }
            return listeners;
          } else if (currentType === "**") {
            endReached = i + 1 === typeLength || i + 2 === typeLength && nextType === "*";
            if (endReached && tree._listeners) {
              listeners = searchListenerTree(handlers, type, tree, typeLength, typeLength);
            }
            branches = ownKeys(tree);
            n = branches.length;
            while (n-- > 0) {
              branch = branches[n];
              if (branch !== "_listeners") {
                if (branch === "*" || branch === "**") {
                  if (tree[branch]._listeners && !endReached) {
                    _listeners = searchListenerTree(handlers, type, tree[branch], typeLength, typeLength);
                    if (_listeners) {
                      if (listeners) {
                        listeners.push.apply(listeners, _listeners);
                      } else {
                        listeners = _listeners;
                      }
                    }
                  }
                  _listeners = searchListenerTree(handlers, type, tree[branch], i, typeLength);
                } else if (branch === nextType) {
                  _listeners = searchListenerTree(handlers, type, tree[branch], i + 2, typeLength);
                } else {
                  _listeners = searchListenerTree(handlers, type, tree[branch], i, typeLength);
                }
                if (_listeners) {
                  if (listeners) {
                    listeners.push.apply(listeners, _listeners);
                  } else {
                    listeners = _listeners;
                  }
                }
              }
            }
            return listeners;
          } else if (tree[currentType]) {
            listeners = searchListenerTree(handlers, type, tree[currentType], i + 1, typeLength);
          }
        }
        xTree = tree["*"];
        if (xTree) {
          searchListenerTree(handlers, type, xTree, i + 1, typeLength);
        }
        xxTree = tree["**"];
        if (xxTree) {
          if (i < typeLength) {
            if (xxTree._listeners) {
              searchListenerTree(handlers, type, xxTree, typeLength, typeLength);
            }
            branches = ownKeys(xxTree);
            n = branches.length;
            while (n-- > 0) {
              branch = branches[n];
              if (branch !== "_listeners") {
                if (branch === nextType) {
                  searchListenerTree(handlers, type, xxTree[branch], i + 2, typeLength);
                } else if (branch === currentType) {
                  searchListenerTree(handlers, type, xxTree[branch], i + 1, typeLength);
                } else {
                  isolatedBranch = {};
                  isolatedBranch[branch] = xxTree[branch];
                  searchListenerTree(handlers, type, { "**": isolatedBranch }, i + 1, typeLength);
                }
              }
            }
          } else if (xxTree._listeners) {
            searchListenerTree(handlers, type, xxTree, typeLength, typeLength);
          } else if (xxTree["*"] && xxTree["*"]._listeners) {
            searchListenerTree(handlers, type, xxTree["*"], typeLength, typeLength);
          }
        }
        return listeners;
      }
      function growListenerTree(type, listener, prepend) {
        var len = 0, j = 0, i, delimiter = this.delimiter, dl = delimiter.length, ns;
        if (typeof type === "string") {
          if ((i = type.indexOf(delimiter)) !== -1) {
            ns = new Array(5);
            do {
              ns[len++] = type.slice(j, i);
              j = i + dl;
            } while ((i = type.indexOf(delimiter, j)) !== -1);
            ns[len++] = type.slice(j);
          } else {
            ns = [type];
            len = 1;
          }
        } else {
          ns = type;
          len = type.length;
        }
        if (len > 1) {
          for (i = 0; i + 1 < len; i++) {
            if (ns[i] === "**" && ns[i + 1] === "**") {
              return;
            }
          }
        }
        var tree = this.listenerTree, name;
        for (i = 0; i < len; i++) {
          name = ns[i];
          tree = tree[name] || (tree[name] = {});
          if (i === len - 1) {
            if (!tree._listeners) {
              tree._listeners = listener;
            } else {
              if (typeof tree._listeners === "function") {
                tree._listeners = [tree._listeners];
              }
              if (prepend) {
                tree._listeners.unshift(listener);
              } else {
                tree._listeners.push(listener);
              }
              if (!tree._listeners.warned && this._maxListeners > 0 && tree._listeners.length > this._maxListeners) {
                tree._listeners.warned = true;
                logPossibleMemoryLeak.call(this, tree._listeners.length, name);
              }
            }
            return true;
          }
        }
        return true;
      }
      function collectTreeEvents(tree, events, root, asArray) {
        var branches = ownKeys(tree);
        var i = branches.length;
        var branch, branchName, path;
        var hasListeners = tree["_listeners"];
        var isArrayPath;
        while (i-- > 0) {
          branchName = branches[i];
          branch = tree[branchName];
          if (branchName === "_listeners") {
            path = root;
          } else {
            path = root ? root.concat(branchName) : [branchName];
          }
          isArrayPath = asArray || typeof branchName === "symbol";
          hasListeners && events.push(isArrayPath ? path : path.join(this.delimiter));
          if (typeof branch === "object") {
            collectTreeEvents.call(this, branch, events, path, isArrayPath);
          }
        }
        return events;
      }
      function recursivelyGarbageCollect(root) {
        var keys = ownKeys(root);
        var i = keys.length;
        var obj, key, flag;
        while (i-- > 0) {
          key = keys[i];
          obj = root[key];
          if (obj) {
            flag = true;
            if (key !== "_listeners" && !recursivelyGarbageCollect(obj)) {
              delete root[key];
            }
          }
        }
        return flag;
      }
      function Listener(emitter, event, listener) {
        this.emitter = emitter;
        this.event = event;
        this.listener = listener;
      }
      Listener.prototype.off = function() {
        this.emitter.off(this.event, this.listener);
        return this;
      };
      function setupListener(event, listener, options) {
        if (options === true) {
          promisify = true;
        } else if (options === false) {
          async = true;
        } else {
          if (!options || typeof options !== "object") {
            throw TypeError("options should be an object or true");
          }
          var async = options.async;
          var promisify = options.promisify;
          var nextTick = options.nextTick;
          var objectify = options.objectify;
        }
        if (async || nextTick || promisify) {
          var _listener = listener;
          var _origin = listener._origin || listener;
          if (nextTick && !nextTickSupported) {
            throw Error("process.nextTick is not supported");
          }
          if (promisify === undefined$1) {
            promisify = listener.constructor.name === "AsyncFunction";
          }
          listener = function() {
            var args = arguments;
            var context = this;
            var event2 = this.event;
            return promisify ? nextTick ? Promise.resolve() : new Promise(function(resolve) {
              _setImmediate(resolve);
            }).then(function() {
              context.event = event2;
              return _listener.apply(context, args);
            }) : (nextTick ? process.nextTick : _setImmediate)(function() {
              context.event = event2;
              _listener.apply(context, args);
            });
          };
          listener._async = true;
          listener._origin = _origin;
        }
        return [listener, objectify ? new Listener(this, event, listener) : this];
      }
      function EventEmitter(conf) {
        this._events = {};
        this._newListener = false;
        this._removeListener = false;
        this.verboseMemoryLeak = false;
        configure.call(this, conf);
      }
      EventEmitter.EventEmitter2 = EventEmitter;
      EventEmitter.prototype.listenTo = function(target, events, options) {
        if (typeof target !== "object") {
          throw TypeError("target musts be an object");
        }
        var emitter = this;
        options = resolveOptions(options, {
          on: undefined$1,
          off: undefined$1,
          reducers: undefined$1
        }, {
          on: functionReducer,
          off: functionReducer,
          reducers: objectFunctionReducer
        });
        function listen(events2) {
          if (typeof events2 !== "object") {
            throw TypeError("events must be an object");
          }
          var reducers = options.reducers;
          var index = findTargetIndex.call(emitter, target);
          var observer;
          if (index === -1) {
            observer = new TargetObserver(emitter, target, options);
          } else {
            observer = emitter._observers[index];
          }
          var keys = ownKeys(events2);
          var len = keys.length;
          var event;
          var isSingleReducer = typeof reducers === "function";
          for (var i = 0; i < len; i++) {
            event = keys[i];
            observer.subscribe(
              event,
              events2[event] || event,
              isSingleReducer ? reducers : reducers && reducers[event]
            );
          }
        }
        isArray(events) ? listen(toObject(events)) : typeof events === "string" ? listen(toObject(events.split(/\s+/))) : listen(events);
        return this;
      };
      EventEmitter.prototype.stopListeningTo = function(target, event) {
        var observers = this._observers;
        if (!observers) {
          return false;
        }
        var i = observers.length;
        var observer;
        var matched = false;
        if (target && typeof target !== "object") {
          throw TypeError("target should be an object");
        }
        while (i-- > 0) {
          observer = observers[i];
          if (!target || observer._target === target) {
            observer.unsubscribe(event);
            matched = true;
          }
        }
        return matched;
      };
      EventEmitter.prototype.delimiter = ".";
      EventEmitter.prototype.setMaxListeners = function(n) {
        if (n !== undefined$1) {
          this._maxListeners = n;
          if (!this._conf) this._conf = {};
          this._conf.maxListeners = n;
        }
      };
      EventEmitter.prototype.getMaxListeners = function() {
        return this._maxListeners;
      };
      EventEmitter.prototype.event = "";
      EventEmitter.prototype.once = function(event, fn, options) {
        return this._once(event, fn, false, options);
      };
      EventEmitter.prototype.prependOnceListener = function(event, fn, options) {
        return this._once(event, fn, true, options);
      };
      EventEmitter.prototype._once = function(event, fn, prepend, options) {
        return this._many(event, 1, fn, prepend, options);
      };
      EventEmitter.prototype.many = function(event, ttl, fn, options) {
        return this._many(event, ttl, fn, false, options);
      };
      EventEmitter.prototype.prependMany = function(event, ttl, fn, options) {
        return this._many(event, ttl, fn, true, options);
      };
      EventEmitter.prototype._many = function(event, ttl, fn, prepend, options) {
        var self = this;
        if (typeof fn !== "function") {
          throw new Error("many only accepts instances of Function");
        }
        function listener() {
          if (--ttl === 0) {
            self.off(event, listener);
          }
          return fn.apply(this, arguments);
        }
        listener._origin = fn;
        return this._on(event, listener, prepend, options);
      };
      EventEmitter.prototype.emit = function() {
        if (!this._events && !this._all) {
          return false;
        }
        this._events || init.call(this);
        var type = arguments[0], ns, wildcard = this.wildcard;
        var args, l, i, j, containsSymbol;
        if (type === "newListener" && !this._newListener) {
          if (!this._events.newListener) {
            return false;
          }
        }
        if (wildcard) {
          ns = type;
          if (type !== "newListener" && type !== "removeListener") {
            if (typeof type === "object") {
              l = type.length;
              if (symbolsSupported) {
                for (i = 0; i < l; i++) {
                  if (typeof type[i] === "symbol") {
                    containsSymbol = true;
                    break;
                  }
                }
              }
              if (!containsSymbol) {
                type = type.join(this.delimiter);
              }
            }
          }
        }
        var al = arguments.length;
        var handler;
        if (this._all && this._all.length) {
          handler = this._all.slice();
          for (i = 0, l = handler.length; i < l; i++) {
            this.event = type;
            switch (al) {
              case 1:
                handler[i].call(this, type);
                break;
              case 2:
                handler[i].call(this, type, arguments[1]);
                break;
              case 3:
                handler[i].call(this, type, arguments[1], arguments[2]);
                break;
              default:
                handler[i].apply(this, arguments);
            }
          }
        }
        if (wildcard) {
          handler = [];
          searchListenerTree.call(this, handler, ns, this.listenerTree, 0, l);
        } else {
          handler = this._events[type];
          if (typeof handler === "function") {
            this.event = type;
            switch (al) {
              case 1:
                handler.call(this);
                break;
              case 2:
                handler.call(this, arguments[1]);
                break;
              case 3:
                handler.call(this, arguments[1], arguments[2]);
                break;
              default:
                args = new Array(al - 1);
                for (j = 1; j < al; j++) args[j - 1] = arguments[j];
                handler.apply(this, args);
            }
            return true;
          } else if (handler) {
            handler = handler.slice();
          }
        }
        if (handler && handler.length) {
          if (al > 3) {
            args = new Array(al - 1);
            for (j = 1; j < al; j++) args[j - 1] = arguments[j];
          }
          for (i = 0, l = handler.length; i < l; i++) {
            this.event = type;
            switch (al) {
              case 1:
                handler[i].call(this);
                break;
              case 2:
                handler[i].call(this, arguments[1]);
                break;
              case 3:
                handler[i].call(this, arguments[1], arguments[2]);
                break;
              default:
                handler[i].apply(this, args);
            }
          }
          return true;
        } else if (!this.ignoreErrors && !this._all && type === "error") {
          if (arguments[1] instanceof Error) {
            throw arguments[1];
          } else {
            throw new Error("Uncaught, unspecified 'error' event.");
          }
        }
        return !!this._all;
      };
      EventEmitter.prototype.emitAsync = function() {
        if (!this._events && !this._all) {
          return false;
        }
        this._events || init.call(this);
        var type = arguments[0], wildcard = this.wildcard, ns, containsSymbol;
        var args, l, i, j;
        if (type === "newListener" && !this._newListener) {
          if (!this._events.newListener) {
            return Promise.resolve([false]);
          }
        }
        if (wildcard) {
          ns = type;
          if (type !== "newListener" && type !== "removeListener") {
            if (typeof type === "object") {
              l = type.length;
              if (symbolsSupported) {
                for (i = 0; i < l; i++) {
                  if (typeof type[i] === "symbol") {
                    containsSymbol = true;
                    break;
                  }
                }
              }
              if (!containsSymbol) {
                type = type.join(this.delimiter);
              }
            }
          }
        }
        var promises = [];
        var al = arguments.length;
        var handler;
        if (this._all) {
          for (i = 0, l = this._all.length; i < l; i++) {
            this.event = type;
            switch (al) {
              case 1:
                promises.push(this._all[i].call(this, type));
                break;
              case 2:
                promises.push(this._all[i].call(this, type, arguments[1]));
                break;
              case 3:
                promises.push(this._all[i].call(this, type, arguments[1], arguments[2]));
                break;
              default:
                promises.push(this._all[i].apply(this, arguments));
            }
          }
        }
        if (wildcard) {
          handler = [];
          searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
        } else {
          handler = this._events[type];
        }
        if (typeof handler === "function") {
          this.event = type;
          switch (al) {
            case 1:
              promises.push(handler.call(this));
              break;
            case 2:
              promises.push(handler.call(this, arguments[1]));
              break;
            case 3:
              promises.push(handler.call(this, arguments[1], arguments[2]));
              break;
            default:
              args = new Array(al - 1);
              for (j = 1; j < al; j++) args[j - 1] = arguments[j];
              promises.push(handler.apply(this, args));
          }
        } else if (handler && handler.length) {
          handler = handler.slice();
          if (al > 3) {
            args = new Array(al - 1);
            for (j = 1; j < al; j++) args[j - 1] = arguments[j];
          }
          for (i = 0, l = handler.length; i < l; i++) {
            this.event = type;
            switch (al) {
              case 1:
                promises.push(handler[i].call(this));
                break;
              case 2:
                promises.push(handler[i].call(this, arguments[1]));
                break;
              case 3:
                promises.push(handler[i].call(this, arguments[1], arguments[2]));
                break;
              default:
                promises.push(handler[i].apply(this, args));
            }
          }
        } else if (!this.ignoreErrors && !this._all && type === "error") {
          if (arguments[1] instanceof Error) {
            return Promise.reject(arguments[1]);
          } else {
            return Promise.reject("Uncaught, unspecified 'error' event.");
          }
        }
        return Promise.all(promises);
      };
      EventEmitter.prototype.on = function(type, listener, options) {
        return this._on(type, listener, false, options);
      };
      EventEmitter.prototype.prependListener = function(type, listener, options) {
        return this._on(type, listener, true, options);
      };
      EventEmitter.prototype.onAny = function(fn) {
        return this._onAny(fn, false);
      };
      EventEmitter.prototype.prependAny = function(fn) {
        return this._onAny(fn, true);
      };
      EventEmitter.prototype.addListener = EventEmitter.prototype.on;
      EventEmitter.prototype._onAny = function(fn, prepend) {
        if (typeof fn !== "function") {
          throw new Error("onAny only accepts instances of Function");
        }
        if (!this._all) {
          this._all = [];
        }
        if (prepend) {
          this._all.unshift(fn);
        } else {
          this._all.push(fn);
        }
        return this;
      };
      EventEmitter.prototype._on = function(type, listener, prepend, options) {
        if (typeof type === "function") {
          this._onAny(type, listener);
          return this;
        }
        if (typeof listener !== "function") {
          throw new Error("on only accepts instances of Function");
        }
        this._events || init.call(this);
        var returnValue = this, temp;
        if (options !== undefined$1) {
          temp = setupListener.call(this, type, listener, options);
          listener = temp[0];
          returnValue = temp[1];
        }
        if (this._newListener) {
          this.emit("newListener", type, listener);
        }
        if (this.wildcard) {
          growListenerTree.call(this, type, listener, prepend);
          return returnValue;
        }
        if (!this._events[type]) {
          this._events[type] = listener;
        } else {
          if (typeof this._events[type] === "function") {
            this._events[type] = [this._events[type]];
          }
          if (prepend) {
            this._events[type].unshift(listener);
          } else {
            this._events[type].push(listener);
          }
          if (!this._events[type].warned && this._maxListeners > 0 && this._events[type].length > this._maxListeners) {
            this._events[type].warned = true;
            logPossibleMemoryLeak.call(this, this._events[type].length, type);
          }
        }
        return returnValue;
      };
      EventEmitter.prototype.off = function(type, listener) {
        if (typeof listener !== "function") {
          throw new Error("removeListener only takes instances of Function");
        }
        var handlers, leafs = [];
        if (this.wildcard) {
          var ns = typeof type === "string" ? type.split(this.delimiter) : type.slice();
          leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
          if (!leafs) return this;
        } else {
          if (!this._events[type]) return this;
          handlers = this._events[type];
          leafs.push({ _listeners: handlers });
        }
        for (var iLeaf = 0; iLeaf < leafs.length; iLeaf++) {
          var leaf = leafs[iLeaf];
          handlers = leaf._listeners;
          if (isArray(handlers)) {
            var position = -1;
            for (var i = 0, length = handlers.length; i < length; i++) {
              if (handlers[i] === listener || handlers[i].listener && handlers[i].listener === listener || handlers[i]._origin && handlers[i]._origin === listener) {
                position = i;
                break;
              }
            }
            if (position < 0) {
              continue;
            }
            if (this.wildcard) {
              leaf._listeners.splice(position, 1);
            } else {
              this._events[type].splice(position, 1);
            }
            if (handlers.length === 0) {
              if (this.wildcard) {
                delete leaf._listeners;
              } else {
                delete this._events[type];
              }
            }
            if (this._removeListener)
              this.emit("removeListener", type, listener);
            return this;
          } else if (handlers === listener || handlers.listener && handlers.listener === listener || handlers._origin && handlers._origin === listener) {
            if (this.wildcard) {
              delete leaf._listeners;
            } else {
              delete this._events[type];
            }
            if (this._removeListener)
              this.emit("removeListener", type, listener);
          }
        }
        this.listenerTree && recursivelyGarbageCollect(this.listenerTree);
        return this;
      };
      EventEmitter.prototype.offAny = function(fn) {
        var i = 0, l = 0, fns;
        if (fn && this._all && this._all.length > 0) {
          fns = this._all;
          for (i = 0, l = fns.length; i < l; i++) {
            if (fn === fns[i]) {
              fns.splice(i, 1);
              if (this._removeListener)
                this.emit("removeListenerAny", fn);
              return this;
            }
          }
        } else {
          fns = this._all;
          if (this._removeListener) {
            for (i = 0, l = fns.length; i < l; i++)
              this.emit("removeListenerAny", fns[i]);
          }
          this._all = [];
        }
        return this;
      };
      EventEmitter.prototype.removeListener = EventEmitter.prototype.off;
      EventEmitter.prototype.removeAllListeners = function(type) {
        if (type === undefined$1) {
          !this._events || init.call(this);
          return this;
        }
        if (this.wildcard) {
          var leafs = searchListenerTree.call(this, null, type, this.listenerTree, 0), leaf, i;
          if (!leafs) return this;
          for (i = 0; i < leafs.length; i++) {
            leaf = leafs[i];
            leaf._listeners = null;
          }
          this.listenerTree && recursivelyGarbageCollect(this.listenerTree);
        } else if (this._events) {
          this._events[type] = null;
        }
        return this;
      };
      EventEmitter.prototype.listeners = function(type) {
        var _events = this._events;
        var keys, listeners, allListeners;
        var i;
        var listenerTree;
        if (type === undefined$1) {
          if (this.wildcard) {
            throw Error("event name required for wildcard emitter");
          }
          if (!_events) {
            return [];
          }
          keys = ownKeys(_events);
          i = keys.length;
          allListeners = [];
          while (i-- > 0) {
            listeners = _events[keys[i]];
            if (typeof listeners === "function") {
              allListeners.push(listeners);
            } else {
              allListeners.push.apply(allListeners, listeners);
            }
          }
          return allListeners;
        } else {
          if (this.wildcard) {
            listenerTree = this.listenerTree;
            if (!listenerTree) return [];
            var handlers = [];
            var ns = typeof type === "string" ? type.split(this.delimiter) : type.slice();
            searchListenerTree.call(this, handlers, ns, listenerTree, 0);
            return handlers;
          }
          if (!_events) {
            return [];
          }
          listeners = _events[type];
          if (!listeners) {
            return [];
          }
          return typeof listeners === "function" ? [listeners] : listeners;
        }
      };
      EventEmitter.prototype.eventNames = function(nsAsArray) {
        var _events = this._events;
        return this.wildcard ? collectTreeEvents.call(this, this.listenerTree, [], null, nsAsArray) : _events ? ownKeys(_events) : [];
      };
      EventEmitter.prototype.listenerCount = function(type) {
        return this.listeners(type).length;
      };
      EventEmitter.prototype.hasListeners = function(type) {
        if (this.wildcard) {
          var handlers = [];
          var ns = typeof type === "string" ? type.split(this.delimiter) : type.slice();
          searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
          return handlers.length > 0;
        }
        var _events = this._events;
        var _all = this._all;
        return !!(_all && _all.length || _events && (type === undefined$1 ? ownKeys(_events).length : _events[type]));
      };
      EventEmitter.prototype.listenersAny = function() {
        if (this._all) {
          return this._all;
        } else {
          return [];
        }
      };
      EventEmitter.prototype.waitFor = function(event, options) {
        var self = this;
        var type = typeof options;
        if (type === "number") {
          options = { timeout: options };
        } else if (type === "function") {
          options = { filter: options };
        }
        options = resolveOptions(options, {
          timeout: 0,
          filter: undefined$1,
          handleError: false,
          Promise,
          overload: false
        }, {
          filter: functionReducer,
          Promise: constructorReducer
        });
        return makeCancelablePromise(options.Promise, function(resolve, reject, onCancel) {
          function listener() {
            var filter = options.filter;
            if (filter && !filter.apply(self, arguments)) {
              return;
            }
            self.off(event, listener);
            if (options.handleError) {
              var err = arguments[0];
              err ? reject(err) : resolve(toArray.apply(null, arguments).slice(1));
            } else {
              resolve(toArray.apply(null, arguments));
            }
          }
          onCancel(function() {
            self.off(event, listener);
          });
          self._on(event, listener, false);
        }, {
          timeout: options.timeout,
          overload: options.overload
        });
      };
      function once(emitter, name, options) {
        options = resolveOptions(options, {
          Promise,
          timeout: 0,
          overload: false
        }, {
          Promise: constructorReducer
        });
        var _Promise = options.Promise;
        return makeCancelablePromise(_Promise, function(resolve, reject, onCancel) {
          var handler;
          if (typeof emitter.addEventListener === "function") {
            handler = function() {
              resolve(toArray.apply(null, arguments));
            };
            onCancel(function() {
              emitter.removeEventListener(name, handler);
            });
            emitter.addEventListener(
              name,
              handler,
              { once: true }
            );
            return;
          }
          var eventListener = function() {
            errorListener && emitter.removeListener("error", errorListener);
            resolve(toArray.apply(null, arguments));
          };
          var errorListener;
          if (name !== "error") {
            errorListener = function(err) {
              emitter.removeListener(name, eventListener);
              reject(err);
            };
            emitter.once("error", errorListener);
          }
          onCancel(function() {
            errorListener && emitter.removeListener("error", errorListener);
            emitter.removeListener(name, eventListener);
          });
          emitter.once(name, eventListener);
        }, {
          timeout: options.timeout,
          overload: options.overload
        });
      }
      var prototype = EventEmitter.prototype;
      Object.defineProperties(EventEmitter, {
        defaultMaxListeners: {
          get: function() {
            return prototype._maxListeners;
          },
          set: function(n) {
            if (typeof n !== "number" || n < 0 || Number.isNaN(n)) {
              throw TypeError("n must be a non-negative number");
            }
            prototype._maxListeners = n;
          },
          enumerable: true
        },
        once: {
          value: once,
          writable: true,
          configurable: true
        }
      });
      Object.defineProperties(prototype, {
        _maxListeners: {
          value: defaultMaxListeners,
          writable: true,
          configurable: true
        },
        _observers: { value: null, writable: true, configurable: true }
      });
      {
        module.exports = EventEmitter;
      }
    }();
  })(eventemitter2);
  return eventemitter2.exports;
}

var eventemitter2Exports = requireEventemitter2();
var EventEmitter2 = /*@__PURE__*/getDefaultExportFromCjs(eventemitter2Exports);

var InteractifyAdapters = /* @__PURE__ */ ((InteractifyAdapters2) => {
  InteractifyAdapters2["LivePreview"] = "live-preview";
  InteractifyAdapters2["Preview"] = "preview";
  InteractifyAdapters2["PickerMode"] = "picker-mode";
  return InteractifyAdapters2;
})(InteractifyAdapters || {});

class UnitActions {
  constructor(unit) {
    this.unit = unit;
  }
  moveElement(dx, dy, options) {
    const content = this.unit.context.content;
    this.unit.dx += dx;
    this.unit.dy += dy;
    content.setCssStyles({
      transition: options?.animated ? "transform 0.3s ease-out" : "none",
      transform: `translate(${this.unit.dx}px, ${this.unit.dy}px) scale(${this.unit.scale})`
    });
    if (options?.animated) {
      this.unit.registerDomEvent(
        content,
        "transitionend",
        () => {
          content.setCssStyles({
            transition: "none"
          });
        },
        { once: true }
      );
    }
  }
  zoomElement(factor, options) {
    const { content, container } = this.unit.context;
    const containerRect = container.getBoundingClientRect();
    const viewportCenterX = containerRect.left + containerRect.width / 2;
    const viewportCenterY = containerRect.top + containerRect.height / 2;
    const contentRect = content.getBoundingClientRect();
    const contentCenterX = contentRect.left + contentRect.width / 2;
    const contentCenterY = contentRect.top + contentRect.height / 2;
    const offsetX = (viewportCenterX - contentCenterX) / this.unit.scale;
    const offsetY = (viewportCenterY - contentCenterY) / this.unit.scale;
    this.unit.scale *= factor;
    this.unit.scale = Math.max(0.125, this.unit.scale);
    this.unit.dx = this.unit.dx - offsetX * (factor - 1) * this.unit.scale / factor;
    this.unit.dy = this.unit.dy - offsetY * (factor - 1) * this.unit.scale / factor;
    content.setCssStyles({
      transition: options?.animated ? "transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)" : "none",
      transform: `translate(${this.unit.dx}px, ${this.unit.dy}px) scale(${this.unit.scale})`
    });
    if (options?.animated) {
      this.unit.registerDomEvent(
        content,
        "transitionend",
        () => {
          content.setCssStyles({
            transition: "none"
          });
        },
        { once: true }
      );
    }
  }
  resetZoomAndMove(options) {
    this.fitToContainer(options);
  }
  fitToContainer(options) {
    const { content, container } = this.unit.context;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const contentWidth = content.clientWidth;
    const contentHeight = content.clientHeight;
    this.unit.scale = Math.min(
      containerWidth / contentWidth,
      containerHeight / contentHeight,
      1
    );
    this.unit.dx = (containerWidth - contentWidth * this.unit.scale) / 2;
    this.unit.dy = (containerHeight - contentHeight * this.unit.scale) / 2;
    content.setCssStyles({
      transition: options?.animated ? "transform 0.3s cubic-bezier(0.42, 0, 0.58, 1)" : "none",
      transform: `translate(${this.unit.dx}px, ${this.unit.dy}px) scale(${this.unit.scale})`,
      transformOrigin: "top left"
    });
    if (options?.animated) {
      this.unit.plugin.context.view.registerDomEvent(
        content,
        "transitionend",
        () => {
          content.setCssStyles({
            transition: "none"
          });
        },
        { once: true }
      );
    }
  }
}

var UnitConfigs = /* @__PURE__ */ ((UnitConfigs2) => {
  UnitConfigs2["Default"] = ".interactify";
  UnitConfigs2["IMG_SVG"] = "img,svg";
  UnitConfigs2["Mermaid"] = ".mermaid";
  UnitConfigs2["Mehrmaid"] = ".block-language-mehrmaid";
  UnitConfigs2["PlantUML"] = ".block-language-plantuml";
  UnitConfigs2["Graphviz"] = ".block-language-dot";
  return UnitConfigs2;
})(UnitConfigs || {});
var TriggerType = /* @__PURE__ */ ((TriggerType2) => {
  TriggerType2[TriggerType2["NONE"] = 1] = "NONE";
  TriggerType2[TriggerType2["MOUSE"] = 2] = "MOUSE";
  TriggerType2[TriggerType2["FOCUS"] = 4] = "FOCUS";
  TriggerType2[TriggerType2["KEYPRESS"] = 8] = "KEYPRESS";
  TriggerType2[TriggerType2["FOLD"] = 16] = "FOLD";
  TriggerType2[TriggerType2["FORCE"] = 32] = "FORCE";
  TriggerType2[TriggerType2["SERVICE_HIDING"] = 64] = "SERVICE_HIDING";
  return TriggerType2;
})(TriggerType || {});
var InteractiveMode = /* @__PURE__ */ ((InteractiveMode2) => {
  InteractiveMode2["Interactive"] = "interactive";
  InteractiveMode2["NonInteractive"] = "non-interactive";
  return InteractiveMode2;
})(InteractiveMode || {});
var InteractiveInitialization = /* @__PURE__ */ ((InteractiveInitialization2) => {
  InteractiveInitialization2["Initialized"] = "initialized";
  InteractiveInitialization2["NotInitialized"] = "not-initialized";
  return InteractiveInitialization2;
})(InteractiveInitialization || {});

function updateUnitSize(context, originalSize, settingsSizeData, inLivePreviewMode) {
  const isFolded = context.container.dataset.folded === "true";
  const setting = isFolded ? settingsSizeData.folded : settingsSizeData.expanded;
  const heightValue = setting.height.value;
  const widthValue = setting.width.value;
  const heightInPx = setting.height.unit === "%" ? heightValue / 100 * originalSize.height : heightValue;
  const widthInPx = setting.width.unit === "%" ? widthValue / 100 * originalSize.width : widthValue;
  context.container.style.height = `${heightInPx}px`;
  context.container.style.width = `${widthInPx}px`;
  if (inLivePreviewMode) {
    const parent = context.livePreviewWidget;
    parent.style.setProperty("height", `${heightInPx}px`, "important");
    parent.style.setProperty("width", `${widthInPx}px`, "important");
  }
}

function updateButton(button, icon, tooltip) {
  if (icon) {
    obsidian.setIcon(button, icon);
  }
  if (tooltip) {
    obsidian.setTooltip(button, tooltip);
  }
}

class BasePanel extends obsidian.Component {
  constructor(controlPanel) {
    super();
    this.controlPanel = controlPanel;
  }
  panel;
  buttons;
  setupPanelContents() {
    const buttonsConfigs = this.getButtonsConfig();
    buttonsConfigs.forEach((config) => {
      const button = this.createButton(
        config.icon,
        config.action,
        config.title,
        config.id,
        config.gridArea
      );
      this.buttons.set(config.id, {
        element: button,
        listener: config.action
      });
      if (config.dataAttributes) {
        Object.entries(config.dataAttributes).forEach(
          ([key, value]) => {
            button.setAttribute(key, value);
          }
        );
      }
      this.panel.appendChild(button);
    });
  }
  get unit() {
    return this.controlPanel.unit;
  }
  initialize() {
    if (!this.enabled) {
      return;
    }
    this.panel = this.createPanelElement();
    this.setupPanelContents();
    this.visibilityInitialization();
  }
  createPanelElement() {
    const controlPanel = this.controlPanel.controlPanel;
    const panel = controlPanel.createEl("div");
    panel.addClass(this.cssClass);
    panel.addClass("interactify-panel");
    panel.addClass("visible");
    panel.setCssStyles(this.cssStyles);
    return panel;
  }
  createButton(icon, action, title, id, gridArea) {
    const button = document.createElement("button");
    button.id = id;
    button.setCssStyles({
      background: "transparent",
      border: "none",
      color: "var(--text-muted)",
      cursor: "pointer",
      padding: "4px",
      borderRadius: "3px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      transition: "background-color 0.2s ease",
      gridArea: gridArea ?? "unset"
    });
    updateButton(button, icon, title);
    this.registerDomEvent(button, "click", action);
    this.registerDomEvent(button, "mouseenter", () => {
      button.setCssStyles({
        color: "var(--interactive-accent)"
      });
    });
    this.registerDomEvent(button, "mouseleave", () => {
      button.setCssStyles({
        color: "var(--text-muted)"
      });
    });
    return button;
  }
  visibilityInitialization() {
    const triggeringMode = this.controlPanel.unit.plugin.settings.data.panels.global.triggering.mode;
    const isFolded = this.controlPanel.unit.context.container.dataset.folded === "true";
    let trigger = TriggerType.NONE;
    if (isFolded) {
      trigger |= TriggerType.FOLD;
    }
    if (triggeringMode === "focus") {
      trigger |= TriggerType.FOCUS;
    }
    if (triggeringMode === "hover") {
      trigger |= TriggerType.MOUSE;
    }
    this.hide(trigger);
  }
  show(triggerType) {
    if (!this.shouldRespondToTrigger(triggerType)) {
      return;
    }
    if (!this.panel) {
      return;
    }
    this.panel.removeClass("hidden");
    this.panel.addClass("visible");
  }
  hide(triggerType) {
    if (!this.shouldRespondToTrigger(triggerType)) {
      return;
    }
    if (!this.panel) {
      return;
    }
    this.panel.removeClass("visible");
    this.panel.addClass("hidden");
  }
  isVisible() {
    return this.panel?.classList?.contains("visible") && !this.panel.classList.contains("hidden");
  }
  shouldRespondToTrigger(triggerType) {
    if (triggerType === TriggerType.FORCE) {
      return true;
    }
    return !!(this.supportedTriggers & triggerType);
  }
  get supportedTriggers() {
    const triggeringOptions = this.unit.plugin.settings.data.panels.global.triggering;
    let base = TriggerType.FORCE | TriggerType.FOLD | TriggerType.SERVICE_HIDING;
    if (triggeringOptions.mode === "hover") {
      base = base | TriggerType.MOUSE;
    }
    if (triggeringOptions.mode === "focus") {
      base = base | TriggerType.FOCUS;
    }
    return base;
  }
  onunload() {
    super.onunload();
  }
}

var FoldButtons = /* @__PURE__ */ ((FoldButtons2) => {
  FoldButtons2["Fold"] = "fold";
  return FoldButtons2;
})(FoldButtons || {});
var MoveButtons = /* @__PURE__ */ ((MoveButtons2) => {
  MoveButtons2["Up"] = "up";
  MoveButtons2["Down"] = "down";
  MoveButtons2["Left"] = "left";
  MoveButtons2["Right"] = "right";
  MoveButtons2["UpRight"] = "upRight";
  MoveButtons2["UpLeft"] = "upLeft";
  MoveButtons2["DownLeft"] = "downLeft";
  MoveButtons2["DownRight"] = "downRight";
  return MoveButtons2;
})(MoveButtons || {});
var ServiceButtons = /* @__PURE__ */ ((ServiceButtons2) => {
  ServiceButtons2["Hide"] = "hide";
  ServiceButtons2["Fullscreen"] = "fullscreen";
  ServiceButtons2["Touch"] = "touch";
  return ServiceButtons2;
})(ServiceButtons || {});
var ZoomButtons = /* @__PURE__ */ ((ZoomButtons2) => {
  ZoomButtons2["In"] = "in";
  ZoomButtons2["Out"] = "out";
  ZoomButtons2["Reset"] = "reset";
  return ZoomButtons2;
})(ZoomButtons || {});

let FoldPanel$1 = class FoldPanel extends BasePanel {
  constructor(controlPanel) {
    super(controlPanel);
    this.controlPanel = controlPanel;
  }
  buttons = /* @__PURE__ */ new Map();
  get enabled() {
    return true;
  }
  get cssStyles() {
    return {
      position: "absolute",
      left: "50%",
      bottom: "0",
      transform: "translateX(-50%)",
      gridTemplateColumns: "1fr"
    };
  }
  get cssClass() {
    return "interactify-fold-panel";
  }
  getButtonsConfig() {
    const isFolded = this.unit.context.container.dataset.folded === "true";
    return [
      {
        icon: isFolded ? "unfold-vertical" : "fold-vertical",
        action: () => {
          const isFolded2 = this.controlPanel.unit.context.container.dataset.folded === "true";
          isFolded2 ? this.unfold() : this.fold();
          const button = this.buttons.get(FoldButtons.Fold);
          if (button) {
            updateButton(
              button.element,
              isFolded2 ? "fold-vertical" : "unfold-vertical",
              isFolded2 ? "Fold" : "Expand"
            );
          }
        },
        title: isFolded ? "Expand" : "Fold",
        id: FoldButtons.Fold
      }
    ];
  }
  fold() {
    this.unit.context.container.setAttribute("data-folded", "true");
    updateUnitSize(
      this.unit.context,
      this.unit.context.size,
      this.unit.plugin.settings.data.units.size,
      this.unit.plugin.context.inLivePreviewMode
    );
    this.controlPanel.hide(TriggerType.FOLD);
  }
  unfold() {
    this.unit.context.container.setAttribute("data-folded", "false");
    updateUnitSize(
      this.unit.context,
      this.unit.context.size,
      this.unit.plugin.settings.data.units.size,
      this.unit.plugin.context.inLivePreviewMode
    );
    this.controlPanel.show(TriggerType.FOLD);
  }
  get supportedTriggers() {
    return super.supportedTriggers & ~TriggerType.FOLD & ~TriggerType.SERVICE_HIDING & ~TriggerType.FOCUS & ~TriggerType.MOUSE;
  }
};

var PanelsTriggering = /* @__PURE__ */ ((PanelsTriggering2) => {
  PanelsTriggering2["ALWAYS"] = "always";
  PanelsTriggering2["HOVER"] = "hover";
  PanelsTriggering2["FOCUS"] = "focus";
  return PanelsTriggering2;
})(PanelsTriggering || {});
var ActivationMode = /* @__PURE__ */ ((ActivationMode2) => {
  ActivationMode2["Immediate"] = "immediate";
  ActivationMode2["Lazy"] = "lazy";
  return ActivationMode2;
})(ActivationMode || {});
var DebugLevel = /* @__PURE__ */ ((DebugLevel2) => {
  DebugLevel2["None"] = "none";
  DebugLevel2["Debug"] = "debug";
  DebugLevel2["Info"] = "info";
  DebugLevel2["Warn"] = "warn";
  DebugLevel2["Error"] = "error";
  return DebugLevel2;
})(DebugLevel || {});

class MovePanel extends BasePanel {
  buttons = /* @__PURE__ */ new Map();
  constructor(controlPanel) {
    super(controlPanel);
  }
  get enabled() {
    return this.unit.plugin.settings.data.panels.local.panels.move.on && this.unit.context.options.panels.move?.on;
  }
  get cssClass() {
    return "interactify-move-panel";
  }
  get cssStyles() {
    return {
      ...this.unit.plugin.settings.data.panels.local.panels.move.position,
      gridTemplateColumns: "repeat(3, 1fr)",
      gridTemplateRows: "repeat(3, 1fr)"
    };
  }
  getButtonsConfig() {
    const moveButtons = this.unit.plugin.settings.data.panels.local.panels.move.buttons;
    const buttons = [
      {
        id: MoveButtons.UpLeft,
        icon: "arrow-up-left",
        title: "Move up left",
        gridArea: "1 / 1",
        x: 50,
        y: 50
      },
      {
        id: MoveButtons.Up,
        icon: "arrow-up",
        title: "Move up",
        gridArea: "1 / 2",
        x: 0,
        y: 50
      },
      {
        id: MoveButtons.UpRight,
        icon: "arrow-up-right",
        title: "Move up right",
        gridArea: "1 / 3",
        x: -50,
        y: 50
      },
      {
        id: MoveButtons.Left,
        icon: "arrow-left",
        title: "Move left",
        gridArea: "2 / 1",
        x: 50,
        y: 0
      },
      {
        id: MoveButtons.Right,
        icon: "arrow-right",
        title: "Move right",
        gridArea: "2 / 3",
        x: -50,
        y: 0
      },
      {
        id: MoveButtons.DownLeft,
        icon: "arrow-down-left",
        title: "Move down left",
        gridArea: "3 / 1",
        x: 50,
        y: -50
      },
      {
        id: MoveButtons.Down,
        icon: "arrow-down",
        title: "Move down",
        gridArea: "3 / 2",
        x: 0,
        y: -50
      },
      {
        id: MoveButtons.DownRight,
        icon: "arrow-down-right",
        title: "Move down right",
        gridArea: "3 / 3",
        x: -50,
        y: -50
      }
    ];
    return buttons.filter((config) => moveButtons[config.id]).map((config) => ({
      id: config.id,
      icon: config.icon,
      action: () => this.unit.actions.moveElement(config.x, config.y, {
        animated: true
      }),
      title: config.title,
      gridArea: config.gridArea
    }));
  }
  setupPanelContents() {
    super.setupPanelContents();
    this.panel.toggleClass(
      "hidden",
      this.unit.plugin.settings.data.panels.global.triggering.mode !== PanelsTriggering.ALWAYS
    );
  }
}

class ServicePanel extends BasePanel {
  buttons = /* @__PURE__ */ new Map();
  constructor(controlPanel) {
    super(controlPanel);
  }
  initialize() {
    super.initialize();
    this.setupEventListeners();
  }
  get enabled() {
    return this.unit.plugin.settings.data.panels.local.panels.service.on && this.unit.context.options.panels.service.on;
  }
  get cssClass() {
    return "interactify-service-panel";
  }
  get cssStyles() {
    return {
      ...this.unit.plugin.settings.data.panels.local.panels.service.position,
      gridTemplateColumns: "repeat(auto-fit, minmax(24px, 1fr))",
      gridAutoFlow: "column"
    };
  }
  getButtonsConfig() {
    const buttons = [];
    const container = this.unit.context.container;
    const serviceButtons = this.unit.plugin.settings.data.panels.local.panels.service.buttons;
    if (serviceButtons.hide) {
      buttons.push({
        id: ServiceButtons.Hide,
        icon: "eye",
        action: () => {
          const button = this.buttons.get(
            ServiceButtons.Hide
          )?.element;
          if (!button) {
            return;
          }
          const isCurrentlyHiding = button.dataset.hiding === "true";
          const willBeHiding = !isCurrentlyHiding;
          button.dataset.hiding = willBeHiding.toString();
          isCurrentlyHiding ? this.controlPanel.show(TriggerType.SERVICE_HIDING) : this.controlPanel.hide(TriggerType.SERVICE_HIDING);
          updateButton(
            button,
            isCurrentlyHiding ? "eye" : "eye-off",
            `Panels are ${willBeHiding ? "hidden" : "visible"} (click to toggle)`
          );
        },
        title: `Panels are visible (click to toggle)`,
        dataAttributes: {
          hiding: "false"
        }
      });
    }
    if (serviceButtons.fullscreen) {
      buttons.push({
        id: ServiceButtons.Fullscreen,
        icon: "maximize",
        action: async () => {
          const button = this.buttons.get(
            ServiceButtons.Fullscreen
          )?.element;
          if (!button) {
            return;
          }
          if (!document.fullscreenElement) {
            container.addClass("is-fullscreen");
            await container.requestFullscreen({
              navigationUI: "auto"
            });
            updateButton(
              button,
              "minimize",
              "Open in fullscreen mode"
            );
          } else {
            container.removeClass("is-fullscreen");
            await document.exitFullscreen();
            updateButton(
              button,
              "maximize",
              "Exit fullscreen mode"
            );
          }
        },
        title: "Open in fullscreen mode"
      });
    }
    if (obsidian.Platform.isMobileApp) {
      buttons.push({
        id: ServiceButtons.Touch,
        icon: this.unit.nativeTouchEventsEnabled ? "circle-slash-2" : "hand",
        action: () => {
          const btn = this.buttons.get(ServiceButtons.Touch)?.element;
          if (!btn) {
            return;
          }
          this.unit.nativeTouchEventsEnabled = !this.unit.nativeTouchEventsEnabled;
          const actualNativeTouchEventsEnabled = this.unit.nativeTouchEventsEnabled;
          updateButton(
            btn,
            this.unit.nativeTouchEventsEnabled ? "circle-slash-2" : "hand",
            `${actualNativeTouchEventsEnabled ? "Enable" : "Disable"} move and pinch zoom`
          );
          this.unit.plugin.showNotice(
            `Native touches are ${actualNativeTouchEventsEnabled ? "enabled" : "disabled"} now. 
            You ${actualNativeTouchEventsEnabled ? "cannot" : "can"} move and pinch zoom image unit.`
          );
        },
        title: `${this.unit.nativeTouchEventsEnabled ? "Enable" : "Disable"} move and pinch zoom`
      });
    }
    return buttons;
  }
  setupPanelContents() {
    const settings = this.unit.plugin.settings;
    this.panel.toggleClass(
      "hidden",
      settings.data.panels.global.triggering.mode !== PanelsTriggering.ALWAYS && !settings.data.panels.global.triggering.ignoreService
    );
    super.setupPanelContents();
  }
  setupEventListeners() {
    const fullscreenButton = this.buttons.get(
      ServiceButtons.Fullscreen
    )?.element;
    if (!fullscreenButton) {
      return;
    }
    this.registerDomEvent(
      this.unit.context.container,
      "fullscreenchange",
      this.onFullScreenChange
    );
  }
  onFullScreenChange = () => {
    const button = this.buttons.get(ServiceButtons.Fullscreen)?.element;
    if (!button) {
      return;
    }
    if (document.fullscreenElement) {
      requestAnimationFrame(() => {
        this.unit.actions.resetZoomAndMove();
      });
      updateButton(button, "minimize", "Exit fullscreen mode");
    } else {
      requestAnimationFrame(() => {
        this.unit.actions.resetZoomAndMove();
      });
      updateButton(button, "maximize", "Open in fullscreen mode");
    }
  };
  get supportedTriggers() {
    const base = super.supportedTriggers & ~TriggerType.SERVICE_HIDING;
    const shouldIgnoreExternalTriggers = this.unit.plugin.settings.data.panels.global.triggering.ignoreService;
    if (!shouldIgnoreExternalTriggers) {
      return base;
    }
    const unSupportedFlags = TriggerType.MOUSE | TriggerType.FOCUS;
    return base & ~unSupportedFlags;
  }
}

class ZoomPanel extends BasePanel {
  buttons = /* @__PURE__ */ new Map();
  constructor(controlPanel) {
    super(controlPanel);
  }
  get enabled() {
    return this.controlPanel.unit.plugin.settings.data.panels.local.panels.zoom.on && this.controlPanel.unit.context.options.panels.zoom.on;
  }
  get cssClass() {
    return "interactify-zoom-panel";
  }
  get cssStyles() {
    return {
      ...this.controlPanel.unit.plugin.settings.data.panels.local.panels.zoom.position,
      transform: "translateY(-50%)",
      gridTemplateColumns: "1fr"
    };
  }
  getButtonsConfig() {
    const zoomButtons = this.controlPanel.unit.plugin.settings.data.panels.local.panels.zoom.buttons;
    const buttons = [];
    if (zoomButtons.in) {
      buttons.push({
        id: ZoomButtons.In,
        icon: "zoom-in",
        action: () => this.controlPanel.unit.actions.zoomElement(1.1, {
          animated: true
        }),
        title: "Zoom In"
      });
    }
    if (zoomButtons.reset) {
      buttons.push({
        id: ZoomButtons.Reset,
        icon: "refresh-cw",
        action: () => this.controlPanel.unit.actions.resetZoomAndMove({
          animated: true
        }),
        title: "Reset Zoom and Position"
      });
    }
    if (zoomButtons.out) {
      buttons.push({
        id: ZoomButtons.Out,
        icon: "zoom-out",
        action: () => this.controlPanel.unit.actions.zoomElement(0.9, {
          animated: true
        }),
        title: "Zoom Out"
      });
    }
    return buttons;
  }
  setupPanelContents() {
    this.panel.toggleClass(
      "hidden",
      this.controlPanel.unit.plugin.settings.data.panels.global.triggering.mode !== PanelsTriggering.ALWAYS
    );
    super.setupPanelContents();
  }
}

class ControlPanel extends obsidian.Component {
  constructor(unit) {
    super();
    this.unit = unit;
  }
  fold;
  move;
  zoom;
  service;
  controlPanel;
  initialize() {
    this.load();
    this.controlPanel = this.unit.context.container.createDiv();
    this.controlPanel.addClass("interactify-control-panel");
    this.move = new MovePanel(this);
    this.zoom = new ZoomPanel(this);
    this.fold = new FoldPanel$1(this);
    this.service = new ServicePanel(this);
    [this.move, this.zoom, this.fold, this.service].forEach((panel) => {
      this.addChild(panel);
      panel.initialize();
    });
    this.unit.context.container.appendChild(this.controlPanel);
  }
  get panels() {
    return [this.move, this.zoom, this.fold, this.service];
  }
  show(triggerType = TriggerType.FORCE) {
    this.panels.forEach((panel) => panel.show(triggerType));
  }
  hide(triggerType = TriggerType.FORCE) {
    this.panels.forEach((panel) => panel.hide(triggerType));
  }
  get hasVisiblePanels() {
    return this.panels.some((panel) => panel.isVisible());
  }
  onunload() {
    super.onunload();
    this.controlPanel?.remove();
  }
}

class CopyUnit extends obsidian.Component {
  constructor(contextMenu) {
    super();
    this.contextMenu = contextMenu;
  }
  async copy() {
    const { plugin } = this.contextMenu.events.unit;
    const element = this.contextMenu.events.unit.context.element;
    try {
      if (element instanceof SVGElement) {
        await this.copySvg(element);
      } else {
        await this.copyImg(element);
      }
      plugin.showNotice("Copied");
    } catch (error) {
      plugin.showNotice("Copy failed");
      console.error("Copy operation failed:", error);
    }
  }
  async copyImg(img) {
    const fetchImg = async () => {
      const response = await obsidian.requestUrl(img.src);
      return new Blob([response.arrayBuffer], { type: "image/png" });
    };
    const drawLocalImage = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/png");
      });
    };
    try {
      let blob;
      try {
        blob = await fetchImg();
      } catch {
        blob = await drawLocalImage();
      }
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ]);
    } catch (error) {
      this.contextMenu.events.unit.plugin.showNotice(
        "Failed to copy image"
      );
      this.contextMenu.events.unit.plugin.logger.debug(
        `Error copy image: ${error.message}`
      );
    }
  }
  async copySvg(svg) {
    try {
      svg.focus();
      const svgString = new XMLSerializer().serializeToString(svg);
      await navigator.clipboard.writeText(svgString);
    } catch (error) {
      console.error("Failed to copy SVG:", error);
    }
  }
}

class CopyUnitSource extends obsidian.Component {
  constructor(contextMenu) {
    super();
    this.contextMenu = contextMenu;
  }
  async copy() {
    const source = this.contextMenu.events.unit.context.sourceData.source;
    await navigator.clipboard.writeText(source);
    this.contextMenu.events.unit.plugin.showNotice("Copied");
  }
}

class Export extends obsidian.Component {
  constructor(contextMenu) {
    super();
    this.contextMenu = contextMenu;
  }
  async export() {
    const element = this.contextMenu.events.unit.context.element;
    if (element instanceof SVGElement) {
      this.exportSVG(element);
    } else {
      await this.exportIMG(element);
    }
  }
  exportSVG(svg) {
    const svgData = new XMLSerializer().serializeToString(svg);
    const preface = '<?xml version="1.0" standalone="no"?>\r\n';
    const svgBlob = new Blob([preface, svgData], {
      type: "image/svg+xml;charset=utf-8"
    });
    this.downloadFile(svgBlob, "svg");
  }
  async exportIMG(img) {
    const fetchImg = async () => {
      const response = await obsidian.requestUrl(img.src);
      return new Blob([response.arrayBuffer], { type: "image/png" });
    };
    const drawLocalImage = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/png");
      });
    };
    try {
      let blob;
      try {
        blob = await fetchImg();
      } catch {
        blob = await drawLocalImage();
      }
      this.downloadFile(blob, ".png");
    } catch (error) {
      this.contextMenu.events.unit.plugin.showNotice(
        "Error exporting image"
      );
      this.contextMenu.events.unit.plugin.logger.error(
        `Error exporting image: ${error.message}`
      );
    }
  }
  downloadFile(blob, extension) {
    const { unit } = this.contextMenu.events;
    const filename = `export_${unit.plugin.context.view?.file?.basename ?? "unit"}}_${obsidian.moment().format("YYYYMMDDHHmmss")}.${extension}`;
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }
}

var n, l$1, u$2, i$1, r$1, o$1, e$1, f$3, c$1, s$1, a$1, h$1, p$1 = {}, v$2 = [], y$2 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, w$3 = Array.isArray;
function d$1(n2, l2) {
  for (var u2 in l2) n2[u2] = l2[u2];
  return n2;
}
function g$3(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function _$2(l2, u2, t2) {
  var i2, r2, o2, e2 = {};
  for (o2 in u2) "key" == o2 ? i2 = u2[o2] : "ref" == o2 ? r2 = u2[o2] : e2[o2] = u2[o2];
  if (arguments.length > 2 && (e2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), "function" == typeof l2 && null != l2.defaultProps) for (o2 in l2.defaultProps) void 0 === e2[o2] && (e2[o2] = l2.defaultProps[o2]);
  return m$2(l2, e2, i2, r2, null);
}
function m$2(n2, t2, i2, r2, o2) {
  var e2 = { type: n2, props: t2, key: i2, ref: r2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o2 ? ++u$2 : o2, __i: -1, __u: 0 };
  return null == o2 && null != l$1.vnode && l$1.vnode(e2), e2;
}
function b() {
  return { current: null };
}
function k$3(n2) {
  return n2.children;
}
function x$3(n2, l2) {
  this.props = n2, this.context = l2;
}
function S$1(n2, l2) {
  if (null == l2) return n2.__ ? S$1(n2.__, n2.__i + 1) : null;
  for (var u2; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) return u2.__e;
  return "function" == typeof n2.type ? S$1(n2) : null;
}
function C$3(n2) {
  var l2, u2;
  if (null != (n2 = n2.__) && null != n2.__c) {
    for (n2.__e = n2.__c.base = null, l2 = 0; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) {
      n2.__e = n2.__c.base = u2.__e;
      break;
    }
    return C$3(n2);
  }
}
function M$2(n2) {
  (!n2.__d && (n2.__d = true) && i$1.push(n2) && !$$2.__r++ || r$1 != l$1.debounceRendering) && ((r$1 = l$1.debounceRendering) || o$1)($$2);
}
function $$2() {
  for (var n2, u2, t2, r2, o2, f2, c2, s2 = 1; i$1.length; ) i$1.length > s2 && i$1.sort(e$1), n2 = i$1.shift(), s2 = i$1.length, n2.__d && (t2 = void 0, o2 = (r2 = (u2 = n2).__v).__e, f2 = [], c2 = [], u2.__P && ((t2 = d$1({}, r2)).__v = r2.__v + 1, l$1.vnode && l$1.vnode(t2), O$2(u2.__P, t2, r2, u2.__n, u2.__P.namespaceURI, 32 & r2.__u ? [o2] : null, f2, null == o2 ? S$1(r2) : o2, !!(32 & r2.__u), c2), t2.__v = r2.__v, t2.__.__k[t2.__i] = t2, z$3(f2, t2, c2), t2.__e != o2 && C$3(t2)));
  $$2.__r = 0;
}
function I$2(n2, l2, u2, t2, i2, r2, o2, e2, f2, c2, s2) {
  var a2, h2, y2, w2, d2, g2, _2 = t2 && t2.__k || v$2, m2 = l2.length;
  for (f2 = P$3(u2, l2, _2, f2, m2), a2 = 0; a2 < m2; a2++) null != (y2 = u2.__k[a2]) && (h2 = -1 == y2.__i ? p$1 : _2[y2.__i] || p$1, y2.__i = a2, g2 = O$2(n2, y2, h2, i2, r2, o2, e2, f2, c2, s2), w2 = y2.__e, y2.ref && h2.ref != y2.ref && (h2.ref && q$3(h2.ref, null, y2), s2.push(y2.ref, y2.__c || w2, y2)), null == d2 && null != w2 && (d2 = w2), 4 & y2.__u || h2.__k === y2.__k ? f2 = A$3(y2, f2, n2) : "function" == typeof y2.type && void 0 !== g2 ? f2 = g2 : w2 && (f2 = w2.nextSibling), y2.__u &= -7);
  return u2.__e = d2, f2;
}
function P$3(n2, l2, u2, t2, i2) {
  var r2, o2, e2, f2, c2, s2 = u2.length, a2 = s2, h2 = 0;
  for (n2.__k = new Array(i2), r2 = 0; r2 < i2; r2++) null != (o2 = l2[r2]) && "boolean" != typeof o2 && "function" != typeof o2 ? (f2 = r2 + h2, (o2 = n2.__k[r2] = "string" == typeof o2 || "number" == typeof o2 || "bigint" == typeof o2 || o2.constructor == String ? m$2(null, o2, null, null, null) : w$3(o2) ? m$2(k$3, { children: o2 }, null, null, null) : null == o2.constructor && o2.__b > 0 ? m$2(o2.type, o2.props, o2.key, o2.ref ? o2.ref : null, o2.__v) : o2).__ = n2, o2.__b = n2.__b + 1, e2 = null, -1 != (c2 = o2.__i = L$2(o2, u2, f2, a2)) && (a2--, (e2 = u2[c2]) && (e2.__u |= 2)), null == e2 || null == e2.__v ? (-1 == c2 && (i2 > s2 ? h2-- : i2 < s2 && h2++), "function" != typeof o2.type && (o2.__u |= 4)) : c2 != f2 && (c2 == f2 - 1 ? h2-- : c2 == f2 + 1 ? h2++ : (c2 > f2 ? h2-- : h2++, o2.__u |= 4))) : n2.__k[r2] = null;
  if (a2) for (r2 = 0; r2 < s2; r2++) null != (e2 = u2[r2]) && 0 == (2 & e2.__u) && (e2.__e == t2 && (t2 = S$1(e2)), B$3(e2, e2));
  return t2;
}
function A$3(n2, l2, u2) {
  var t2, i2;
  if ("function" == typeof n2.type) {
    for (t2 = n2.__k, i2 = 0; t2 && i2 < t2.length; i2++) t2[i2] && (t2[i2].__ = n2, l2 = A$3(t2[i2], l2, u2));
    return l2;
  }
  n2.__e != l2 && (l2 && n2.type && !u2.contains(l2) && (l2 = S$1(n2)), u2.insertBefore(n2.__e, l2 || null), l2 = n2.__e);
  do {
    l2 = l2 && l2.nextSibling;
  } while (null != l2 && 8 == l2.nodeType);
  return l2;
}
function H$2(n2, l2) {
  return l2 = l2 || [], null == n2 || "boolean" == typeof n2 || (w$3(n2) ? n2.some(function(n3) {
    H$2(n3, l2);
  }) : l2.push(n2)), l2;
}
function L$2(n2, l2, u2, t2) {
  var i2, r2, o2 = n2.key, e2 = n2.type, f2 = l2[u2];
  if (null === f2 && null == n2.key || f2 && o2 == f2.key && e2 == f2.type && 0 == (2 & f2.__u)) return u2;
  if (t2 > (null != f2 && 0 == (2 & f2.__u) ? 1 : 0)) for (i2 = u2 - 1, r2 = u2 + 1; i2 >= 0 || r2 < l2.length; ) {
    if (i2 >= 0) {
      if ((f2 = l2[i2]) && 0 == (2 & f2.__u) && o2 == f2.key && e2 == f2.type) return i2;
      i2--;
    }
    if (r2 < l2.length) {
      if ((f2 = l2[r2]) && 0 == (2 & f2.__u) && o2 == f2.key && e2 == f2.type) return r2;
      r2++;
    }
  }
  return -1;
}
function T$3(n2, l2, u2) {
  "-" == l2[0] ? n2.setProperty(l2, null == u2 ? "" : u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || y$2.test(l2) ? u2 : u2 + "px";
}
function j$3(n2, l2, u2, t2, i2) {
  var r2, o2;
  n: if ("style" == l2) if ("string" == typeof u2) n2.style.cssText = u2;
  else {
    if ("string" == typeof t2 && (n2.style.cssText = t2 = ""), t2) for (l2 in t2) u2 && l2 in u2 || T$3(n2.style, l2, "");
    if (u2) for (l2 in u2) t2 && u2[l2] == t2[l2] || T$3(n2.style, l2, u2[l2]);
  }
  else if ("o" == l2[0] && "n" == l2[1]) r2 = l2 != (l2 = l2.replace(f$3, "$1")), o2 = l2.toLowerCase(), l2 = o2 in n2 || "onFocusOut" == l2 || "onFocusIn" == l2 ? o2.slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + r2] = u2, u2 ? t2 ? u2.u = t2.u : (u2.u = c$1, n2.addEventListener(l2, r2 ? a$1 : s$1, r2)) : n2.removeEventListener(l2, r2 ? a$1 : s$1, r2);
  else {
    if ("http://www.w3.org/2000/svg" == i2) l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l2 && "height" != l2 && "href" != l2 && "list" != l2 && "form" != l2 && "tabIndex" != l2 && "download" != l2 && "rowSpan" != l2 && "colSpan" != l2 && "role" != l2 && "popover" != l2 && l2 in n2) try {
      n2[l2] = null == u2 ? "" : u2;
      break n;
    } catch (n3) {
    }
    "function" == typeof u2 || (null == u2 || false === u2 && "-" != l2[4] ? n2.removeAttribute(l2) : n2.setAttribute(l2, "popover" == l2 && 1 == u2 ? "" : u2));
  }
}
function F$3(n2) {
  return function(u2) {
    if (this.l) {
      var t2 = this.l[u2.type + n2];
      if (null == u2.t) u2.t = c$1++;
      else if (u2.t < t2.u) return;
      return t2(l$1.event ? l$1.event(u2) : u2);
    }
  };
}
function O$2(n2, u2, t2, i2, r2, o2, e2, f2, c2, s2) {
  var a2, h2, p2, v2, y2, _2, m2, b2, S2, C2, M2, $2, P2, A2, H2, L2, T2, j2 = u2.type;
  if (null != u2.constructor) return null;
  128 & t2.__u && (c2 = !!(32 & t2.__u), o2 = [f2 = u2.__e = t2.__e]), (a2 = l$1.__b) && a2(u2);
  n: if ("function" == typeof j2) try {
    if (b2 = u2.props, S2 = "prototype" in j2 && j2.prototype.render, C2 = (a2 = j2.contextType) && i2[a2.__c], M2 = a2 ? C2 ? C2.props.value : a2.__ : i2, t2.__c ? m2 = (h2 = u2.__c = t2.__c).__ = h2.__E : (S2 ? u2.__c = h2 = new j2(b2, M2) : (u2.__c = h2 = new x$3(b2, M2), h2.constructor = j2, h2.render = D$3), C2 && C2.sub(h2), h2.props = b2, h2.state || (h2.state = {}), h2.context = M2, h2.__n = i2, p2 = h2.__d = true, h2.__h = [], h2._sb = []), S2 && null == h2.__s && (h2.__s = h2.state), S2 && null != j2.getDerivedStateFromProps && (h2.__s == h2.state && (h2.__s = d$1({}, h2.__s)), d$1(h2.__s, j2.getDerivedStateFromProps(b2, h2.__s))), v2 = h2.props, y2 = h2.state, h2.__v = u2, p2) S2 && null == j2.getDerivedStateFromProps && null != h2.componentWillMount && h2.componentWillMount(), S2 && null != h2.componentDidMount && h2.__h.push(h2.componentDidMount);
    else {
      if (S2 && null == j2.getDerivedStateFromProps && b2 !== v2 && null != h2.componentWillReceiveProps && h2.componentWillReceiveProps(b2, M2), !h2.__e && null != h2.shouldComponentUpdate && false === h2.shouldComponentUpdate(b2, h2.__s, M2) || u2.__v == t2.__v) {
        for (u2.__v != t2.__v && (h2.props = b2, h2.state = h2.__s, h2.__d = false), u2.__e = t2.__e, u2.__k = t2.__k, u2.__k.some(function(n3) {
          n3 && (n3.__ = u2);
        }), $2 = 0; $2 < h2._sb.length; $2++) h2.__h.push(h2._sb[$2]);
        h2._sb = [], h2.__h.length && e2.push(h2);
        break n;
      }
      null != h2.componentWillUpdate && h2.componentWillUpdate(b2, h2.__s, M2), S2 && null != h2.componentDidUpdate && h2.__h.push(function() {
        h2.componentDidUpdate(v2, y2, _2);
      });
    }
    if (h2.context = M2, h2.props = b2, h2.__P = n2, h2.__e = false, P2 = l$1.__r, A2 = 0, S2) {
      for (h2.state = h2.__s, h2.__d = false, P2 && P2(u2), a2 = h2.render(h2.props, h2.state, h2.context), H2 = 0; H2 < h2._sb.length; H2++) h2.__h.push(h2._sb[H2]);
      h2._sb = [];
    } else do {
      h2.__d = false, P2 && P2(u2), a2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s;
    } while (h2.__d && ++A2 < 25);
    h2.state = h2.__s, null != h2.getChildContext && (i2 = d$1(d$1({}, i2), h2.getChildContext())), S2 && !p2 && null != h2.getSnapshotBeforeUpdate && (_2 = h2.getSnapshotBeforeUpdate(v2, y2)), L2 = a2, null != a2 && a2.type === k$3 && null == a2.key && (L2 = N$2(a2.props.children)), f2 = I$2(n2, w$3(L2) ? L2 : [L2], u2, t2, i2, r2, o2, e2, f2, c2, s2), h2.base = u2.__e, u2.__u &= -161, h2.__h.length && e2.push(h2), m2 && (h2.__E = h2.__ = null);
  } catch (n3) {
    if (u2.__v = null, c2 || null != o2) if (n3.then) {
      for (u2.__u |= c2 ? 160 : 128; f2 && 8 == f2.nodeType && f2.nextSibling; ) f2 = f2.nextSibling;
      o2[o2.indexOf(f2)] = null, u2.__e = f2;
    } else for (T2 = o2.length; T2--; ) g$3(o2[T2]);
    else u2.__e = t2.__e, u2.__k = t2.__k;
    l$1.__e(n3, u2, t2);
  }
  else null == o2 && u2.__v == t2.__v ? (u2.__k = t2.__k, u2.__e = t2.__e) : f2 = u2.__e = V$2(t2.__e, u2, t2, i2, r2, o2, e2, c2, s2);
  return (a2 = l$1.diffed) && a2(u2), 128 & u2.__u ? void 0 : f2;
}
function z$3(n2, u2, t2) {
  for (var i2 = 0; i2 < t2.length; i2++) q$3(t2[i2], t2[++i2], t2[++i2]);
  l$1.__c && l$1.__c(u2, n2), n2.some(function(u3) {
    try {
      n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
        n3.call(u3);
      });
    } catch (n3) {
      l$1.__e(n3, u3.__v);
    }
  });
}
function N$2(n2) {
  return "object" != typeof n2 || null == n2 || n2.__b && n2.__b > 0 ? n2 : w$3(n2) ? n2.map(N$2) : d$1({}, n2);
}
function V$2(u2, t2, i2, r2, o2, e2, f2, c2, s2) {
  var a2, h2, v2, y2, d2, _2, m2, b2 = i2.props, k2 = t2.props, x2 = t2.type;
  if ("svg" == x2 ? o2 = "http://www.w3.org/2000/svg" : "math" == x2 ? o2 = "http://www.w3.org/1998/Math/MathML" : o2 || (o2 = "http://www.w3.org/1999/xhtml"), null != e2) {
    for (a2 = 0; a2 < e2.length; a2++) if ((d2 = e2[a2]) && "setAttribute" in d2 == !!x2 && (x2 ? d2.localName == x2 : 3 == d2.nodeType)) {
      u2 = d2, e2[a2] = null;
      break;
    }
  }
  if (null == u2) {
    if (null == x2) return document.createTextNode(k2);
    u2 = document.createElementNS(o2, x2, k2.is && k2), c2 && (l$1.__m && l$1.__m(t2, e2), c2 = false), e2 = null;
  }
  if (null == x2) b2 === k2 || c2 && u2.data == k2 || (u2.data = k2);
  else {
    if (e2 = e2 && n.call(u2.childNodes), b2 = i2.props || p$1, !c2 && null != e2) for (b2 = {}, a2 = 0; a2 < u2.attributes.length; a2++) b2[(d2 = u2.attributes[a2]).name] = d2.value;
    for (a2 in b2) if (d2 = b2[a2], "children" == a2) ;
    else if ("dangerouslySetInnerHTML" == a2) v2 = d2;
    else if (!(a2 in k2)) {
      if ("value" == a2 && "defaultValue" in k2 || "checked" == a2 && "defaultChecked" in k2) continue;
      j$3(u2, a2, null, d2, o2);
    }
    for (a2 in k2) d2 = k2[a2], "children" == a2 ? y2 = d2 : "dangerouslySetInnerHTML" == a2 ? h2 = d2 : "value" == a2 ? _2 = d2 : "checked" == a2 ? m2 = d2 : c2 && "function" != typeof d2 || b2[a2] === d2 || j$3(u2, a2, d2, b2[a2], o2);
    if (h2) c2 || v2 && (h2.__html == v2.__html || h2.__html == u2.innerHTML) || (u2.innerHTML = h2.__html), t2.__k = [];
    else if (v2 && (u2.innerHTML = ""), I$2("template" == t2.type ? u2.content : u2, w$3(y2) ? y2 : [y2], t2, i2, r2, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o2, e2, f2, e2 ? e2[0] : i2.__k && S$1(i2, 0), c2, s2), null != e2) for (a2 = e2.length; a2--; ) g$3(e2[a2]);
    c2 || (a2 = "value", "progress" == x2 && null == _2 ? u2.removeAttribute("value") : null != _2 && (_2 !== u2[a2] || "progress" == x2 && !_2 || "option" == x2 && _2 != b2[a2]) && j$3(u2, a2, _2, b2[a2], o2), a2 = "checked", null != m2 && m2 != u2[a2] && j$3(u2, a2, m2, b2[a2], o2));
  }
  return u2;
}
function q$3(n2, u2, t2) {
  try {
    if ("function" == typeof n2) {
      var i2 = "function" == typeof n2.__u;
      i2 && n2.__u(), i2 && null == u2 || (n2.__u = n2(u2));
    } else n2.current = u2;
  } catch (n3) {
    l$1.__e(n3, t2);
  }
}
function B$3(n2, u2, t2) {
  var i2, r2;
  if (l$1.unmount && l$1.unmount(n2), (i2 = n2.ref) && (i2.current && i2.current != n2.__e || q$3(i2, null, u2)), null != (i2 = n2.__c)) {
    if (i2.componentWillUnmount) try {
      i2.componentWillUnmount();
    } catch (n3) {
      l$1.__e(n3, u2);
    }
    i2.base = i2.__P = null;
  }
  if (i2 = n2.__k) for (r2 = 0; r2 < i2.length; r2++) i2[r2] && B$3(i2[r2], u2, t2 || "function" != typeof n2.type);
  t2 || g$3(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
}
function D$3(n2, l2, u2) {
  return this.constructor(n2, u2);
}
function E$2(u2, t2, i2) {
  var r2, o2, e2, f2;
  t2 == document && (t2 = document.documentElement), l$1.__ && l$1.__(u2, t2), o2 = (r2 = "function" == typeof i2) ? null : i2 && i2.__k || t2.__k, e2 = [], f2 = [], O$2(t2, u2 = (!r2 && i2 || t2).__k = _$2(k$3, null, [u2]), o2 || p$1, p$1, t2.namespaceURI, !r2 && i2 ? [i2] : o2 ? null : t2.firstChild ? n.call(t2.childNodes) : null, e2, !r2 && i2 ? i2 : o2 ? o2.__e : t2.firstChild, r2, f2), z$3(e2, u2, f2);
}
function G$2(n2, l2) {
  E$2(n2, l2, G$2);
}
function J$2(l2, u2, t2) {
  var i2, r2, o2, e2, f2 = d$1({}, l2.props);
  for (o2 in l2.type && l2.type.defaultProps && (e2 = l2.type.defaultProps), u2) "key" == o2 ? i2 = u2[o2] : "ref" == o2 ? r2 = u2[o2] : f2[o2] = void 0 === u2[o2] && null != e2 ? e2[o2] : u2[o2];
  return arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), m$2(l2.type, f2, i2 || l2.key, r2 || l2.ref, null);
}
function K$2(n2) {
  function l2(n3) {
    var u2, t2;
    return this.getChildContext || (u2 = /* @__PURE__ */ new Set(), (t2 = {})[l2.__c] = this, this.getChildContext = function() {
      return t2;
    }, this.componentWillUnmount = function() {
      u2 = null;
    }, this.shouldComponentUpdate = function(n4) {
      this.props.value != n4.value && u2.forEach(function(n5) {
        n5.__e = true, M$2(n5);
      });
    }, this.sub = function(n4) {
      u2.add(n4);
      var l3 = n4.componentWillUnmount;
      n4.componentWillUnmount = function() {
        u2 && u2.delete(n4), l3 && l3.call(n4);
      };
    }), n3.children;
  }
  return l2.__c = "__cC" + h$1++, l2.__ = n2, l2.Provider = l2.__l = (l2.Consumer = function(n3, l3) {
    return n3.children(l3);
  }).contextType = l2, l2;
}
n = v$2.slice, l$1 = { __e: function(n2, l2, u2, t2) {
  for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, u$2 = 0, x$3.prototype.setState = function(n2, l2) {
  var u2;
  u2 = null != this.__s && this.__s != this.state ? this.__s : this.__s = d$1({}, this.state), "function" == typeof n2 && (n2 = n2(d$1({}, u2), this.props)), n2 && d$1(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), M$2(this));
}, x$3.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), M$2(this));
}, x$3.prototype.render = k$3, i$1 = [], o$1 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e$1 = function(n2, l2) {
  return n2.__v.__b - l2.__v.__b;
}, $$2.__r = 0, f$3 = /(PointerCapture)$|Capture$/i, c$1 = 0, s$1 = F$3(false), a$1 = F$3(true), h$1 = 0;

var f$2 = 0;
function u$1(e2, t2, n2, o2, i2, u2) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f$2, __i: -1, __u: 0, __source: i2, __self: u2 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l$1.vnode && l$1.vnode(l2), l2;
}

var t, r, u, i, o = 0, f$1 = [], c = l$1, e = c.__b, a = c.__r, v$1 = c.diffed, l = c.__c, m$1 = c.unmount, s = c.__;
function p(n2, t2) {
  c.__h && c.__h(r, n2, o || t2), o = 0;
  var u2 = r.__H || (r.__H = { __: [], __h: [] });
  return n2 >= u2.__.length && u2.__.push({}), u2.__[n2];
}
function d(n2) {
  return o = 1, h(D$2, n2);
}
function h(n2, u2, i2) {
  var o2 = p(t++, 2);
  if (o2.t = n2, !o2.__c && (o2.__ = [i2 ? i2(u2) : D$2(void 0, u2), function(n3) {
    var t2 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t2, n3);
    t2 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
  }], o2.__c = r, !r.__f)) {
    var f2 = function(n3, t2, r2) {
      if (!o2.__c.__H) return true;
      var u3 = o2.__c.__H.__.filter(function(n4) {
        return !!n4.__c;
      });
      if (u3.every(function(n4) {
        return !n4.__N;
      })) return !c2 || c2.call(this, n3, t2, r2);
      var i3 = o2.__c.props !== n3;
      return u3.forEach(function(n4) {
        if (n4.__N) {
          var t3 = n4.__[0];
          n4.__ = n4.__N, n4.__N = void 0, t3 !== n4.__[0] && (i3 = true);
        }
      }), c2 && c2.call(this, n3, t2, r2) || i3;
    };
    r.__f = true;
    var c2 = r.shouldComponentUpdate, e2 = r.componentWillUpdate;
    r.componentWillUpdate = function(n3, t2, r2) {
      if (this.__e) {
        var u3 = c2;
        c2 = void 0, f2(n3, t2, r2), c2 = u3;
      }
      e2 && e2.call(this, n3, t2, r2);
    }, r.shouldComponentUpdate = f2;
  }
  return o2.__N || o2.__;
}
function y$1(n2, u2) {
  var i2 = p(t++, 3);
  !c.__s && C$2(i2.__H, u2) && (i2.__ = n2, i2.u = u2, r.__H.__h.push(i2));
}
function _$1(n2, u2) {
  var i2 = p(t++, 4);
  !c.__s && C$2(i2.__H, u2) && (i2.__ = n2, i2.u = u2, r.__h.push(i2));
}
function A$2(n2) {
  return o = 5, T$2(function() {
    return { current: n2 };
  }, []);
}
function F$2(n2, t2, r2) {
  o = 6, _$1(function() {
    if ("function" == typeof n2) {
      var r3 = n2(t2());
      return function() {
        n2(null), r3 && "function" == typeof r3 && r3();
      };
    }
    if (n2) return n2.current = t2(), function() {
      return n2.current = null;
    };
  }, null == r2 ? r2 : r2.concat(n2));
}
function T$2(n2, r2) {
  var u2 = p(t++, 7);
  return C$2(u2.__H, r2) && (u2.__ = n2(), u2.__H = r2, u2.__h = n2), u2.__;
}
function q$2(n2, t2) {
  return o = 8, T$2(function() {
    return n2;
  }, t2);
}
function x$2(n2) {
  var u2 = r.context[n2.__c], i2 = p(t++, 9);
  return i2.c = n2, u2 ? (null == i2.__ && (i2.__ = true, u2.sub(r)), u2.props.value) : n2.__;
}
function P$2(n2, t2) {
  c.useDebugValue && c.useDebugValue(t2 ? t2(n2) : n2);
}
function g$2() {
  var n2 = p(t++, 11);
  if (!n2.__) {
    for (var u2 = r.__v; null !== u2 && !u2.__m && null !== u2.__; ) u2 = u2.__;
    var i2 = u2.__m || (u2.__m = [0, 0]);
    n2.__ = "P" + i2[0] + "-" + i2[1]++;
  }
  return n2.__;
}
function j$2() {
  for (var n2; n2 = f$1.shift(); ) if (n2.__P && n2.__H) try {
    n2.__H.__h.forEach(z$2), n2.__H.__h.forEach(B$2), n2.__H.__h = [];
  } catch (t2) {
    n2.__H.__h = [], c.__e(t2, n2.__v);
  }
}
c.__b = function(n2) {
  r = null, e && e(n2);
}, c.__ = function(n2, t2) {
  n2 && t2.__k && t2.__k.__m && (n2.__m = t2.__k.__m), s && s(n2, t2);
}, c.__r = function(n2) {
  a && a(n2), t = 0;
  var i2 = (r = n2.__c).__H;
  i2 && (u === r ? (i2.__h = [], r.__h = [], i2.__.forEach(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
  })) : (i2.__h.forEach(z$2), i2.__h.forEach(B$2), i2.__h = [], t = 0)), u = r;
}, c.diffed = function(n2) {
  v$1 && v$1(n2);
  var t2 = n2.__c;
  t2 && t2.__H && (t2.__H.__h.length && (1 !== f$1.push(t2) && i === c.requestAnimationFrame || ((i = c.requestAnimationFrame) || w$2)(j$2)), t2.__H.__.forEach(function(n3) {
    n3.u && (n3.__H = n3.u), n3.u = void 0;
  })), u = r = null;
}, c.__c = function(n2, t2) {
  t2.some(function(n3) {
    try {
      n3.__h.forEach(z$2), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B$2(n4);
      });
    } catch (r2) {
      t2.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t2 = [], c.__e(r2, n3.__v);
    }
  }), l && l(n2, t2);
}, c.unmount = function(n2) {
  m$1 && m$1(n2);
  var t2, r2 = n2.__c;
  r2 && r2.__H && (r2.__H.__.forEach(function(n3) {
    try {
      z$2(n3);
    } catch (n4) {
      t2 = n4;
    }
  }), r2.__H = void 0, t2 && c.__e(t2, r2.__v));
};
var k$2 = "function" == typeof requestAnimationFrame;
function w$2(n2) {
  var t2, r2 = function() {
    clearTimeout(u2), k$2 && cancelAnimationFrame(t2), setTimeout(n2);
  }, u2 = setTimeout(r2, 35);
  k$2 && (t2 = requestAnimationFrame(r2));
}
function z$2(n2) {
  var t2 = r, u2 = n2.__c;
  "function" == typeof u2 && (n2.__c = void 0, u2()), r = t2;
}
function B$2(n2) {
  var t2 = r;
  n2.__c = n2.__(), r = t2;
}
function C$2(n2, t2) {
  return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
    return t3 !== n2[r2];
  });
}
function D$2(n2, t2) {
  return "function" == typeof t2 ? t2(n2) : t2;
}

function g$1(n2, t2) {
  for (var e2 in t2) n2[e2] = t2[e2];
  return n2;
}
function E$1(n2, t2) {
  for (var e2 in n2) if ("__source" !== e2 && !(e2 in t2)) return true;
  for (var r2 in t2) if ("__source" !== r2 && n2[r2] !== t2[r2]) return true;
  return false;
}
function C$1(n2, t2) {
  var e2 = t2(), r2 = d({ t: { __: e2, u: t2 } }), u2 = r2[0].t, o2 = r2[1];
  return _$1(function() {
    u2.__ = e2, u2.u = t2, x$1(u2) && o2({ t: u2 });
  }, [n2, e2, t2]), y$1(function() {
    return x$1(u2) && o2({ t: u2 }), n2(function() {
      x$1(u2) && o2({ t: u2 });
    });
  }, [n2]), e2;
}
function x$1(n2) {
  var t2, e2, r2 = n2.u, u2 = n2.__;
  try {
    var o2 = r2();
    return !((t2 = u2) === (e2 = o2) && (0 !== t2 || 1 / t2 == 1 / e2) || t2 != t2 && e2 != e2);
  } catch (n3) {
    return true;
  }
}
function R$1(n2) {
  n2();
}
function w$1(n2) {
  return n2;
}
function k$1() {
  return [false, R$1];
}
var I$1 = _$1;
function N$1(n2, t2) {
  this.props = n2, this.context = t2;
}
function M$1(n2, e2) {
  function r2(n3) {
    var t2 = this.props.ref, r3 = t2 == n3.ref;
    return !r3 && t2 && (t2.call ? t2(null) : t2.current = null), e2 ? !e2(this.props, n3) || !r3 : E$1(this.props, n3);
  }
  function u2(e3) {
    return this.shouldComponentUpdate = r2, _$2(n2, e3);
  }
  return u2.displayName = "Memo(" + (n2.displayName || n2.name) + ")", u2.prototype.isReactComponent = true, u2.__f = true, u2;
}
(N$1.prototype = new x$3()).isPureReactComponent = true, N$1.prototype.shouldComponentUpdate = function(n2, t2) {
  return E$1(this.props, n2) || E$1(this.state, t2);
};
var T$1 = l$1.__b;
l$1.__b = function(n2) {
  n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), T$1 && T$1(n2);
};
var A$1 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
function D$1(n2) {
  function t2(t3) {
    var e2 = g$1({}, t3);
    return delete e2.ref, n2(e2, t3.ref || null);
  }
  return t2.$$typeof = A$1, t2.render = t2, t2.prototype.isReactComponent = t2.__f = true, t2.displayName = "ForwardRef(" + (n2.displayName || n2.name) + ")", t2;
}
var L$1 = function(n2, t2) {
  return null == n2 ? null : H$2(H$2(n2).map(t2));
}, O$1 = { map: L$1, forEach: L$1, count: function(n2) {
  return n2 ? H$2(n2).length : 0;
}, only: function(n2) {
  var t2 = H$2(n2);
  if (1 !== t2.length) throw "Children.only";
  return t2[0];
}, toArray: H$2 }, F$1 = l$1.__e;
l$1.__e = function(n2, t2, e2, r2) {
  if (n2.then) {
    for (var u2, o2 = t2; o2 = o2.__; ) if ((u2 = o2.__c) && u2.__c) return null == t2.__e && (t2.__e = e2.__e, t2.__k = e2.__k), u2.__c(n2, t2);
  }
  F$1(n2, t2, e2, r2);
};
var U$1 = l$1.unmount;
function V$1(n2, t2, e2) {
  return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
    "function" == typeof n3.__c && n3.__c();
  }), n2.__c.__H = null), null != (n2 = g$1({}, n2)).__c && (n2.__c.__P === e2 && (n2.__c.__P = t2), n2.__c.__e = true, n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
    return V$1(n3, t2, e2);
  })), n2;
}
function W$1(n2, t2, e2) {
  return n2 && e2 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
    return W$1(n3, t2, e2);
  }), n2.__c && n2.__c.__P === t2 && (n2.__e && e2.appendChild(n2.__e), n2.__c.__e = true, n2.__c.__P = e2)), n2;
}
function P$1() {
  this.__u = 0, this.o = null, this.__b = null;
}
function j$1(n2) {
  var t2 = n2.__.__c;
  return t2 && t2.__a && t2.__a(n2);
}
function z$1(n2) {
  var e2, r2, u2;
  function o2(o3) {
    if (e2 || (e2 = n2()).then(function(n3) {
      r2 = n3.default || n3;
    }, function(n3) {
      u2 = n3;
    }), u2) throw u2;
    if (!r2) throw e2;
    return _$2(r2, o3);
  }
  return o2.displayName = "Lazy", o2.__f = true, o2;
}
function B$1() {
  this.i = null, this.l = null;
}
l$1.unmount = function(n2) {
  var t2 = n2.__c;
  t2 && t2.__R && t2.__R(), t2 && 32 & n2.__u && (n2.type = null), U$1 && U$1(n2);
}, (P$1.prototype = new x$3()).__c = function(n2, t2) {
  var e2 = t2.__c, r2 = this;
  null == r2.o && (r2.o = []), r2.o.push(e2);
  var u2 = j$1(r2.__v), o2 = false, i2 = function() {
    o2 || (o2 = true, e2.__R = null, u2 ? u2(l2) : l2());
  };
  e2.__R = i2;
  var l2 = function() {
    if (!--r2.__u) {
      if (r2.state.__a) {
        var n3 = r2.state.__a;
        r2.__v.__k[0] = W$1(n3, n3.__c.__P, n3.__c.__O);
      }
      var t3;
      for (r2.setState({ __a: r2.__b = null }); t3 = r2.o.pop(); ) t3.forceUpdate();
    }
  };
  r2.__u++ || 32 & t2.__u || r2.setState({ __a: r2.__b = r2.__v.__k[0] }), n2.then(i2, i2);
}, P$1.prototype.componentWillUnmount = function() {
  this.o = [];
}, P$1.prototype.render = function(n2, e2) {
  if (this.__b) {
    if (this.__v.__k) {
      var r2 = document.createElement("div"), o2 = this.__v.__k[0].__c;
      this.__v.__k[0] = V$1(this.__b, r2, o2.__O = o2.__P);
    }
    this.__b = null;
  }
  var i2 = e2.__a && _$2(k$3, null, n2.fallback);
  return i2 && (i2.__u &= -33), [_$2(k$3, null, e2.__a ? null : n2.children), i2];
};
var H$1 = function(n2, t2, e2) {
  if (++e2[1] === e2[0] && n2.l.delete(t2), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.l.size)) for (e2 = n2.i; e2; ) {
    for (; e2.length > 3; ) e2.pop()();
    if (e2[1] < e2[0]) break;
    n2.i = e2 = e2[2];
  }
};
function Z$1(n2) {
  return this.getChildContext = function() {
    return n2.context;
  }, n2.children;
}
function Y$1(n2) {
  var e2 = this, r2 = n2.h;
  if (e2.componentWillUnmount = function() {
    E$2(null, e2.v), e2.v = null, e2.h = null;
  }, e2.h && e2.h !== r2 && e2.componentWillUnmount(), !e2.v) {
    for (var u2 = e2.__v; null !== u2 && !u2.__m && null !== u2.__; ) u2 = u2.__;
    e2.h = r2, e2.v = { nodeType: 1, parentNode: r2, childNodes: [], __k: { __m: u2.__m }, contains: function() {
      return true;
    }, insertBefore: function(n3, t2) {
      this.childNodes.push(n3), e2.h.insertBefore(n3, t2);
    }, removeChild: function(n3) {
      this.childNodes.splice(this.childNodes.indexOf(n3) >>> 1, 1), e2.h.removeChild(n3);
    } };
  }
  E$2(_$2(Z$1, { context: e2.context }, n2.__v), e2.v);
}
function $$1(n2, e2) {
  var r2 = _$2(Y$1, { __v: n2, h: e2 });
  return r2.containerInfo = e2, r2;
}
(B$1.prototype = new x$3()).__a = function(n2) {
  var t2 = this, e2 = j$1(t2.__v), r2 = t2.l.get(n2);
  return r2[0]++, function(u2) {
    var o2 = function() {
      t2.props.revealOrder ? (r2.push(u2), H$1(t2, n2, r2)) : u2();
    };
    e2 ? e2(o2) : o2();
  };
}, B$1.prototype.render = function(n2) {
  this.i = null, this.l = /* @__PURE__ */ new Map();
  var t2 = H$2(n2.children);
  n2.revealOrder && "b" === n2.revealOrder[0] && t2.reverse();
  for (var e2 = t2.length; e2--; ) this.l.set(t2[e2], this.i = [1, 0, this.i]);
  return n2.children;
}, B$1.prototype.componentDidUpdate = B$1.prototype.componentDidMount = function() {
  var n2 = this;
  this.l.forEach(function(t2, e2) {
    H$1(n2, e2, t2);
  });
};
var q$1 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103, G$1 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, J$1 = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, K$1 = /[A-Z0-9]/g, Q$1 = "undefined" != typeof document, X$1 = function(n2) {
  return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n2);
};
function nn(n2, t2, e2) {
  return null == t2.__k && (t2.textContent = ""), E$2(n2, t2), "function" == typeof e2 && e2(), n2 ? n2.__c : null;
}
function tn(n2, t2, e2) {
  return G$2(n2, t2), "function" == typeof e2 && e2(), n2 ? n2.__c : null;
}
x$3.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t2) {
  Object.defineProperty(x$3.prototype, t2, { configurable: true, get: function() {
    return this["UNSAFE_" + t2];
  }, set: function(n2) {
    Object.defineProperty(this, t2, { configurable: true, writable: true, value: n2 });
  } });
});
var en = l$1.event;
function rn() {
}
function un() {
  return this.cancelBubble;
}
function on() {
  return this.defaultPrevented;
}
l$1.event = function(n2) {
  return en && (n2 = en(n2)), n2.persist = rn, n2.isPropagationStopped = un, n2.isDefaultPrevented = on, n2.nativeEvent = n2;
};
var ln, cn = { enumerable: false, configurable: true, get: function() {
  return this.class;
} }, fn = l$1.vnode;
l$1.vnode = function(n2) {
  "string" == typeof n2.type && function(n3) {
    var t2 = n3.props, e2 = n3.type, u2 = {}, o2 = -1 === e2.indexOf("-");
    for (var i2 in t2) {
      var l2 = t2[i2];
      if (!("value" === i2 && "defaultValue" in t2 && null == l2 || Q$1 && "children" === i2 && "noscript" === e2 || "class" === i2 || "className" === i2)) {
        var c2 = i2.toLowerCase();
        "defaultValue" === i2 && "value" in t2 && null == t2.value ? i2 = "value" : "download" === i2 && true === l2 ? l2 = "" : "translate" === c2 && "no" === l2 ? l2 = false : "o" === c2[0] && "n" === c2[1] ? "ondoubleclick" === c2 ? i2 = "ondblclick" : "onchange" !== c2 || "input" !== e2 && "textarea" !== e2 || X$1(t2.type) ? "onfocus" === c2 ? i2 = "onfocusin" : "onblur" === c2 ? i2 = "onfocusout" : J$1.test(i2) && (i2 = c2) : c2 = i2 = "oninput" : o2 && G$1.test(i2) ? i2 = i2.replace(K$1, "-$&").toLowerCase() : null === l2 && (l2 = void 0), "oninput" === c2 && u2[i2 = c2] && (i2 = "oninputCapture"), u2[i2] = l2;
      }
    }
    "select" == e2 && u2.multiple && Array.isArray(u2.value) && (u2.value = H$2(t2.children).forEach(function(n4) {
      n4.props.selected = -1 != u2.value.indexOf(n4.props.value);
    })), "select" == e2 && null != u2.defaultValue && (u2.value = H$2(t2.children).forEach(function(n4) {
      n4.props.selected = u2.multiple ? -1 != u2.defaultValue.indexOf(n4.props.value) : u2.defaultValue == n4.props.value;
    })), t2.class && !t2.className ? (u2.class = t2.class, Object.defineProperty(u2, "className", cn)) : (t2.className && !t2.class || t2.class && t2.className) && (u2.class = u2.className = t2.className), n3.props = u2;
  }(n2), n2.$$typeof = q$1, fn && fn(n2);
};
var an = l$1.__r;
l$1.__r = function(n2) {
  an && an(n2), ln = n2.__c;
};
var sn = l$1.diffed;
l$1.diffed = function(n2) {
  sn && sn(n2);
  var t2 = n2.props, e2 = n2.__e;
  null != e2 && "textarea" === n2.type && "value" in t2 && t2.value !== e2.value && (e2.value = null == t2.value ? "" : t2.value), ln = null;
};
var hn = { ReactCurrentDispatcher: { current: { readContext: function(n2) {
  return ln.__n[n2.__c].props.value;
}, useCallback: q$2, useContext: x$2, useDebugValue: P$2, useDeferredValue: w$1, useEffect: y$1, useId: g$2, useImperativeHandle: F$2, useInsertionEffect: I$1, useLayoutEffect: _$1, useMemo: T$2, useReducer: h, useRef: A$2, useState: d, useSyncExternalStore: C$1, useTransition: k$1 } } };
function dn(n2) {
  return _$2.bind(null, n2);
}
function mn(n2) {
  return !!n2 && n2.$$typeof === q$1;
}
function pn(n2) {
  return mn(n2) && n2.type === k$3;
}
function yn(n2) {
  return !!n2 && !!n2.displayName && ("string" == typeof n2.displayName || n2.displayName instanceof String) && n2.displayName.startsWith("Memo(");
}
function _n(n2) {
  return mn(n2) ? J$2.apply(null, arguments) : n2;
}
function bn(n2) {
  return !!n2.__k && (E$2(null, n2), true);
}
function Sn(n2) {
  return n2 && (n2.base || 1 === n2.nodeType && n2) || null;
}
var gn = function(n2, t2) {
  return n2(t2);
}, En = function(n2, t2) {
  return n2(t2);
}, Cn = k$3, xn = mn, Rn = { useState: d, useId: g$2, useReducer: h, useEffect: y$1, useLayoutEffect: _$1, useInsertionEffect: I$1, useTransition: k$1, useDeferredValue: w$1, useSyncExternalStore: C$1, startTransition: R$1, useRef: A$2, useImperativeHandle: F$2, useMemo: T$2, useCallback: q$2, useContext: x$2, useDebugValue: P$2, version: "18.3.1", Children: O$1, render: nn, hydrate: tn, unmountComponentAtNode: bn, createPortal: $$1, createElement: _$2, createContext: K$2, createFactory: dn, cloneElement: _n, createRef: b, Fragment: k$3, isValidElement: mn, isElement: xn, isFragment: pn, isMemo: yn, findDOMNode: Sn, Component: x$3, PureComponent: N$1, memo: M$1, forwardRef: D$1, flushSync: En, unstable_batchedUpdates: gn, StrictMode: Cn, Suspense: P$1, SuspenseList: B$1, lazy: z$1, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: hn };

function createRoot(container) {
	return {
		// eslint-disable-next-line
		render: function (children) {
			nn(children, container);
		},
		// eslint-disable-next-line
		unmount: function () {
			bn(container);
		}
	};
}

class MultiDescComponent {
  element = null;
  constructor(props) {
    if (props.containerEl) {
      this.element = props.containerEl;
    }
  }
  addDesc(desc) {
    if (this.element) {
      const div = document.createElement("div");
      div.textContent = desc;
      this.element.appendChild(div);
    }
  }
  addDescriptions(desc) {
    if (this.element) {
      desc.forEach((desc2) => this.addDesc(desc2));
    }
    return this;
  }
  render() {
    return null;
  }
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  };
  return __assign.apply(this, arguments);
};

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function memoize(fn) {
  var cache = /* @__PURE__ */ Object.create(null);
  return function(arg) {
    if (cache[arg] === void 0) cache[arg] = fn(arg);
    return cache[arg];
  };
}

var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/;
var isPropValid = /* @__PURE__ */ memoize(
  function(prop) {
    return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110 && prop.charCodeAt(2) < 91;
  }
  /* Z+1 */
);

var MS = "-ms-";
var MOZ = "-moz-";
var WEBKIT = "-webkit-";
var COMMENT = "comm";
var RULESET = "rule";
var DECLARATION = "decl";
var IMPORT = "@import";
var KEYFRAMES = "@keyframes";
var LAYER = "@layer";

var abs = Math.abs;
var from = String.fromCharCode;
var assign = Object.assign;
function hash(value, length) {
  return charat(value, 0) ^ 45 ? (((length << 2 ^ charat(value, 0)) << 2 ^ charat(value, 1)) << 2 ^ charat(value, 2)) << 2 ^ charat(value, 3) : 0;
}
function trim(value) {
  return value.trim();
}
function match(value, pattern) {
  return (value = pattern.exec(value)) ? value[0] : value;
}
function replace(value, pattern, replacement) {
  return value.replace(pattern, replacement);
}
function indexof(value, search, position) {
  return value.indexOf(search, position);
}
function charat(value, index) {
  return value.charCodeAt(index) | 0;
}
function substr(value, begin, end) {
  return value.slice(begin, end);
}
function strlen(value) {
  return value.length;
}
function sizeof(value) {
  return value.length;
}
function append(value, array) {
  return array.push(value), value;
}
function combine(array, callback) {
  return array.map(callback).join("");
}
function filter(array, pattern) {
  return array.filter(function(value) {
    return !match(value, pattern);
  });
}

var line = 1;
var column = 1;
var length = 0;
var position = 0;
var character = 0;
var characters = "";
function node(value, root, parent, type, props, children, length2, siblings) {
  return { value, root, parent, type, props, children, line, column, length: length2, return: "", siblings };
}
function copy(root, props) {
  return assign(node("", null, null, "", null, null, 0, root.siblings), root, { length: -root.length }, props);
}
function lift(root) {
  while (root.root)
    root = copy(root.root, { children: [root] });
  append(root, root.siblings);
}
function char() {
  return character;
}
function prev() {
  character = position > 0 ? charat(characters, --position) : 0;
  if (column--, character === 10)
    column = 1, line--;
  return character;
}
function next() {
  character = position < length ? charat(characters, position++) : 0;
  if (column++, character === 10)
    column = 1, line++;
  return character;
}
function peek() {
  return charat(characters, position);
}
function caret() {
  return position;
}
function slice(begin, end) {
  return substr(characters, begin, end);
}
function token(type) {
  switch (type) {
    // \0 \t \n \r \s whitespace token
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    // ! + , / > @ ~ isolate token
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    // ; { } breakpoint token
    case 59:
    case 123:
    case 125:
      return 4;
    // : accompanied token
    case 58:
      return 3;
    // " ' ( [ opening delimit token
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    // ) ] closing delimit token
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function alloc(value) {
  return line = column = 1, length = strlen(characters = value), position = 0, [];
}
function dealloc(value) {
  return characters = "", value;
}
function delimit(type) {
  return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
}
function whitespace(type) {
  while (character = peek())
    if (character < 33)
      next();
    else
      break;
  return token(type) > 2 || token(character) > 3 ? "" : " ";
}
function escaping(index, count) {
  while (--count && next())
    if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97)
      break;
  return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
}
function delimiter(type) {
  while (next())
    switch (character) {
      // ] ) " '
      case type:
        return position;
      // " '
      case 34:
      case 39:
        if (type !== 34 && type !== 39)
          delimiter(character);
        break;
      // (
      case 40:
        if (type === 41)
          delimiter(type);
        break;
      // \
      case 92:
        next();
        break;
    }
  return position;
}
function commenter(type, index) {
  while (next())
    if (type + character === 47 + 10)
      break;
    else if (type + character === 42 + 42 && peek() === 47)
      break;
  return "/*" + slice(index, position - 1) + "*" + from(type === 47 ? type : next());
}
function identifier(index) {
  while (!token(peek()))
    next();
  return slice(index, position);
}

function compile(value) {
  return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
}
function parse(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
  var index = 0;
  var offset = 0;
  var length = pseudo;
  var atrule = 0;
  var property = 0;
  var previous = 0;
  var variable = 1;
  var scanning = 1;
  var ampersand = 1;
  var character = 0;
  var type = "";
  var props = rules;
  var children = rulesets;
  var reference = rule;
  var characters = type;
  while (scanning)
    switch (previous = character, character = next()) {
      // (
      case 40:
        if (previous != 108 && charat(characters, length - 1) == 58) {
          if (indexof(characters += replace(delimit(character), "&", "&\f"), "&\f", abs(index ? points[index - 1] : 0)) != -1)
            ampersand = -1;
          break;
        }
      // " ' [
      case 34:
      case 39:
      case 91:
        characters += delimit(character);
        break;
      // \t \n \r \s
      case 9:
      case 10:
      case 13:
      case 32:
        characters += whitespace(previous);
        break;
      // \
      case 92:
        characters += escaping(caret() - 1, 7);
        continue;
      // /
      case 47:
        switch (peek()) {
          case 42:
          case 47:
            append(comment(commenter(next(), caret()), root, parent, declarations), declarations);
            break;
          default:
            characters += "/";
        }
        break;
      // {
      case 123 * variable:
        points[index++] = strlen(characters) * ampersand;
      // } ; \0
      case 125 * variable:
      case 59:
      case 0:
        switch (character) {
          // \0 }
          case 0:
          case 125:
            scanning = 0;
          // ;
          case 59 + offset:
            if (ampersand == -1) characters = replace(characters, /\f/g, "");
            if (property > 0 && strlen(characters) - length)
              append(property > 32 ? declaration(characters + ";", rule, parent, length - 1, declarations) : declaration(replace(characters, " ", "") + ";", rule, parent, length - 2, declarations), declarations);
            break;
          // @ ;
          case 59:
            characters += ";";
          // { rule/at-rule
          default:
            append(reference = ruleset(characters, root, parent, index, offset, rules, points, type, props = [], children = [], length, rulesets), rulesets);
            if (character === 123)
              if (offset === 0)
                parse(characters, root, reference, reference, props, rulesets, length, points, children);
              else
                switch (atrule === 99 && charat(characters, 3) === 110 ? 100 : atrule) {
                  // d l m s
                  case 100:
                  case 108:
                  case 109:
                  case 115:
                    parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length, children), children), rules, children, length, points, rule ? props : children);
                    break;
                  default:
                    parse(characters, reference, reference, reference, [""], children, 0, points, children);
                }
        }
        index = offset = property = 0, variable = ampersand = 1, type = characters = "", length = pseudo;
        break;
      // :
      case 58:
        length = 1 + strlen(characters), property = previous;
      default:
        if (variable < 1) {
          if (character == 123)
            --variable;
          else if (character == 125 && variable++ == 0 && prev() == 125)
            continue;
        }
        switch (characters += from(character), character * variable) {
          // &
          case 38:
            ampersand = offset > 0 ? 1 : (characters += "\f", -1);
            break;
          // ,
          case 44:
            points[index++] = (strlen(characters) - 1) * ampersand, ampersand = 1;
            break;
          // @
          case 64:
            if (peek() === 45)
              characters += delimit(next());
            atrule = peek(), offset = length = strlen(type = characters += identifier(caret())), character++;
            break;
          // -
          case 45:
            if (previous === 45 && strlen(characters) == 2)
              variable = 0;
        }
    }
  return rulesets;
}
function ruleset(value, root, parent, index, offset, rules, points, type, props, children, length, siblings) {
  var post = offset - 1;
  var rule = offset === 0 ? rules : [""];
  var size = sizeof(rule);
  for (var i = 0, j = 0, k = 0; i < index; ++i)
    for (var x = 0, y = substr(value, post + 1, post = abs(j = points[i])), z = value; x < size; ++x)
      if (z = trim(j > 0 ? rule[x] + " " + y : replace(y, /&\f/g, rule[x])))
        props[k++] = z;
  return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length, siblings);
}
function comment(value, root, parent, siblings) {
  return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0, siblings);
}
function declaration(value, root, parent, length, siblings) {
  return node(value, root, parent, DECLARATION, substr(value, 0, length), substr(value, length + 1, -1), length, siblings);
}

function prefix(value, length, children) {
  switch (hash(value, length)) {
    // color-adjust
    case 5103:
      return WEBKIT + "print-" + value + value;
    // animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)
    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921:
    // text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break
    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005:
    // mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,
    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855:
    // background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)
    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return WEBKIT + value + value;
    // tab-size
    case 4789:
      return MOZ + value + value;
    // appearance, user-select, transform, hyphens, text-size-adjust
    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return WEBKIT + value + MOZ + value + MS + value + value;
    // writing-mode
    case 5936:
      switch (charat(value, length + 11)) {
        // vertical-l(r)
        case 114:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb") + value;
        // vertical-r(l)
        case 108:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb-rl") + value;
        // horizontal(-)tb
        case 45:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "lr") + value;
      }
    // flex, flex-direction, scroll-snap-type, writing-mode
    case 6828:
    case 4268:
    case 2903:
      return WEBKIT + value + MS + value + value;
    // order
    case 6165:
      return WEBKIT + value + MS + "flex-" + value + value;
    // align-items
    case 5187:
      return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + "box-$1$2" + MS + "flex-$1$2") + value;
    // align-self
    case 5443:
      return WEBKIT + value + MS + "flex-item-" + replace(value, /flex-|-self/g, "") + (!match(value, /flex-|baseline/) ? MS + "grid-row-" + replace(value, /flex-|-self/g, "") : "") + value;
    // align-content
    case 4675:
      return WEBKIT + value + MS + "flex-line-pack" + replace(value, /align-content|flex-|-self/g, "") + value;
    // flex-shrink
    case 5548:
      return WEBKIT + value + MS + replace(value, "shrink", "negative") + value;
    // flex-basis
    case 5292:
      return WEBKIT + value + MS + replace(value, "basis", "preferred-size") + value;
    // flex-grow
    case 6060:
      return WEBKIT + "box-" + replace(value, "-grow", "") + WEBKIT + value + MS + replace(value, "grow", "positive") + value;
    // transition
    case 4554:
      return WEBKIT + replace(value, /([^-])(transform)/g, "$1" + WEBKIT + "$2") + value;
    // cursor
    case 6187:
      return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + "$1"), /(image-set)/, WEBKIT + "$1"), value, "") + value;
    // background, background-image
    case 5495:
    case 3959:
      return replace(value, /(image-set\([^]*)/, WEBKIT + "$1$`$1");
    // justify-content
    case 4968:
      return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + "box-pack:$3" + MS + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + WEBKIT + value + value;
    // justify-self
    case 4200:
      if (!match(value, /flex-|baseline/)) return MS + "grid-column-align" + substr(value, length) + value;
      break;
    // grid-template-(columns|rows)
    case 2592:
    case 3360:
      return MS + replace(value, "template-", "") + value;
    // grid-(row|column)-start
    case 4384:
    case 3616:
      if (children && children.some(function(element, index) {
        return length = index, match(element.props, /grid-\w+-end/);
      })) {
        return ~indexof(value + (children = children[length].value), "span", 0) ? value : MS + replace(value, "-start", "") + value + MS + "grid-row-span:" + (~indexof(children, "span", 0) ? match(children, /\d+/) : +match(children, /\d+/) - +match(value, /\d+/)) + ";";
      }
      return MS + replace(value, "-start", "") + value;
    // grid-(row|column)-end
    case 4896:
    case 4128:
      return children && children.some(function(element) {
        return match(element.props, /grid-\w+-start/);
      }) ? value : MS + replace(replace(value, "-end", "-span"), "span ", "") + value;
    // (margin|padding)-inline-(start|end)
    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return replace(value, /(.+)-inline(.+)/, WEBKIT + "$1$2") + value;
    // (min|max)?(width|height|inline-size|block-size)
    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      if (strlen(value) - 1 - length > 6)
        switch (charat(value, length + 1)) {
          // (m)ax-content, (m)in-content
          case 109:
            if (charat(value, length + 4) !== 45)
              break;
          // (f)ill-available, (f)it-content
          case 102:
            return replace(value, /(.+:)(.+)-([^]+)/, "$1" + WEBKIT + "$2-$3$1" + MOZ + (charat(value, length + 3) == 108 ? "$3" : "$2-$3")) + value;
          // (s)tretch
          case 115:
            return ~indexof(value, "stretch", 0) ? prefix(replace(value, "stretch", "fill-available"), length, children) + value : value;
        }
      break;
    // grid-(column|row)
    case 5152:
    case 5920:
      return replace(value, /(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/, function(_, a, b, c, d, e, f) {
        return MS + a + ":" + b + f + (c ? MS + a + "-span:" + (d ? e : +e - +b) + f : "") + value;
      });
    // position: sticky
    case 4949:
      if (charat(value, length + 6) === 121)
        return replace(value, ":", ":" + WEBKIT) + value;
      break;
    // display: (flex|inline-flex|grid|inline-grid)
    case 6444:
      switch (charat(value, charat(value, 14) === 45 ? 18 : 11)) {
        // (inline-)?fle(x)
        case 120:
          return replace(value, /(.+:)([^;\s!]+)(;|(\s+)?!.+)?/, "$1" + WEBKIT + (charat(value, 14) === 45 ? "inline-" : "") + "box$3$1" + WEBKIT + "$2$3$1" + MS + "$2box$3") + value;
        // (inline-)?gri(d)
        case 100:
          return replace(value, ":", ":" + MS) + value;
      }
      break;
    // scroll-margin, scroll-margin-(top|right|bottom|left)
    case 5719:
    case 2647:
    case 2135:
    case 3927:
    case 2391:
      return replace(value, "scroll-", "scroll-snap-") + value;
  }
  return value;
}

function serialize(children, callback) {
  var output = "";
  for (var i = 0; i < children.length; i++)
    output += callback(children[i], i, children, callback) || "";
  return output;
}
function stringify(element, index, children, callback) {
  switch (element.type) {
    case LAYER:
      if (element.children.length) break;
    case IMPORT:
    case DECLARATION:
      return element.return = element.return || element.value;
    case COMMENT:
      return "";
    case KEYFRAMES:
      return element.return = element.value + "{" + serialize(element.children, callback) + "}";
    case RULESET:
      if (!strlen(element.value = element.props.join(","))) return "";
  }
  return strlen(children = serialize(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
}

function middleware(collection) {
  var length = sizeof(collection);
  return function(element, index, children, callback) {
    var output = "";
    for (var i = 0; i < length; i++)
      output += collection[i](element, index, children, callback) || "";
    return output;
  };
}
function rulesheet(callback) {
  return function(element) {
    if (!element.root) {
      if (element = element.return)
        callback(element);
    }
  };
}
function prefixer(element, index, children, callback) {
  if (element.length > -1) {
    if (!element.return)
      switch (element.type) {
        case DECLARATION:
          element.return = prefix(element.value, element.length, children);
          return;
        case KEYFRAMES:
          return serialize([copy(element, { value: replace(element.value, "@", "@" + WEBKIT) })], callback);
        case RULESET:
          if (element.length)
            return combine(children = element.props, function(value) {
              switch (match(value, callback = /(::plac\w+|:read-\w+)/)) {
                // :read-(only|write)
                case ":read-only":
                case ":read-write":
                  lift(copy(element, { props: [replace(value, /:(read-\w+)/, ":" + MOZ + "$1")] }));
                  lift(copy(element, { props: [value] }));
                  assign(element, { props: filter(children, callback) });
                  break;
                // :placeholder
                case "::placeholder":
                  lift(copy(element, { props: [replace(value, /:(plac\w+)/, ":" + WEBKIT + "input-$1")] }));
                  lift(copy(element, { props: [replace(value, /:(plac\w+)/, ":" + MOZ + "$1")] }));
                  lift(copy(element, { props: [replace(value, /:(plac\w+)/, MS + "input-$1")] }));
                  lift(copy(element, { props: [value] }));
                  assign(element, { props: filter(children, callback) });
                  break;
              }
              return "";
            });
      }
  }
}

var unitlessKeys = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};

var f = "undefined" != typeof process && void 0 !== process.env && (process.env.REACT_APP_SC_ATTR || process.env.SC_ATTR) || "data-styled", m = "active", y = "data-styled-version", v = "6.1.19", g = "/*!sc*/\n", S = "undefined" != typeof window && "undefined" != typeof document, w = Boolean("boolean" == typeof SC_DISABLE_SPEEDY ? SC_DISABLE_SPEEDY : "undefined" != typeof process && void 0 !== process.env && void 0 !== process.env.REACT_APP_SC_DISABLE_SPEEDY && "" !== process.env.REACT_APP_SC_DISABLE_SPEEDY ? "false" !== process.env.REACT_APP_SC_DISABLE_SPEEDY && process.env.REACT_APP_SC_DISABLE_SPEEDY : "undefined" != typeof process && void 0 !== process.env && void 0 !== process.env.SC_DISABLE_SPEEDY && "" !== process.env.SC_DISABLE_SPEEDY ? "false" !== process.env.SC_DISABLE_SPEEDY && process.env.SC_DISABLE_SPEEDY : true), E = /invalid hook call/i, N = /* @__PURE__ */ new Set(), P = function(t2, n2) {
  {
    var o2 = n2 ? ' with the id of "'.concat(n2, '"') : "", s2 = "The component ".concat(t2).concat(o2, " has been created dynamically.\n") + "You may see this warning because you've called styled inside another component.\nTo resolve this only create new StyledComponents outside of any render method and function component.\nSee https://styled-components.com/docs/basics#define-styled-components-outside-of-the-render-method for more info.\n", i2 = console.error;
    try {
      var a2 = true;
      console.error = function(t3) {
        for (var n3 = [], o3 = 1; o3 < arguments.length; o3++) n3[o3 - 1] = arguments[o3];
        E.test(t3) ? (a2 = false, N.delete(s2)) : i2.apply(void 0, __spreadArray([t3], n3, false));
      }, A$2(), a2 && !N.has(s2) && (console.warn(s2), N.add(s2));
    } catch (e2) {
      E.test(e2.message) && N.delete(s2);
    } finally {
      console.error = i2;
    }
  }
}, _ = Object.freeze([]), C = Object.freeze({});
function I(e2, t2, n2) {
  return void 0 === n2 && (n2 = C), e2.theme !== n2.theme && e2.theme || t2 || n2.theme;
}
var A = /* @__PURE__ */ new Set(["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "u", "ul", "use", "var", "video", "wbr", "circle", "clipPath", "defs", "ellipse", "foreignObject", "g", "image", "line", "linearGradient", "marker", "mask", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "text", "tspan"]), O = /[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g, D = /(^-|-$)/g;
function R(e2) {
  return e2.replace(O, "-").replace(D, "");
}
var T = /(a)(d)/gi, k = 52, j = function(e2) {
  return String.fromCharCode(e2 + (e2 > 25 ? 39 : 97));
};
function x(e2) {
  var t2, n2 = "";
  for (t2 = Math.abs(e2); t2 > k; t2 = t2 / k | 0) n2 = j(t2 % k) + n2;
  return (j(t2 % k) + n2).replace(T, "$1-$2");
}
var V, F = 5381, M = function(e2, t2) {
  for (var n2 = t2.length; n2; ) e2 = 33 * e2 ^ t2.charCodeAt(--n2);
  return e2;
}, z = function(e2) {
  return M(F, e2);
};
function $(e2) {
  return x(z(e2) >>> 0);
}
function B(e2) {
  return "string" == typeof e2 && e2 || e2.displayName || e2.name || "Component";
}
function L(e2) {
  return "string" == typeof e2 && e2.charAt(0) === e2.charAt(0).toLowerCase();
}
var G = "function" == typeof Symbol && Symbol.for, Y = G ? Symbol.for("react.memo") : 60115, W = G ? Symbol.for("react.forward_ref") : 60112, q = { childContextTypes: true, contextType: true, contextTypes: true, defaultProps: true, displayName: true, getDefaultProps: true, getDerivedStateFromError: true, getDerivedStateFromProps: true, mixins: true, propTypes: true, type: true }, H = { name: true, length: true, prototype: true, caller: true, callee: true, arguments: true, arity: true }, U = { $$typeof: true, compare: true, defaultProps: true, displayName: true, propTypes: true, type: true }, J = ((V = {})[W] = { $$typeof: true, render: true, defaultProps: true, displayName: true, propTypes: true }, V[Y] = U, V);
function X(e2) {
  return ("type" in (t2 = e2) && t2.type.$$typeof) === Y ? U : "$$typeof" in e2 ? J[e2.$$typeof] : q;
  var t2;
}
var Z = Object.defineProperty, K = Object.getOwnPropertyNames, Q = Object.getOwnPropertySymbols, ee = Object.getOwnPropertyDescriptor, te = Object.getPrototypeOf, ne = Object.prototype;
function oe(e2, t2, n2) {
  if ("string" != typeof t2) {
    if (ne) {
      var o2 = te(t2);
      o2 && o2 !== ne && oe(e2, o2, n2);
    }
    var r2 = K(t2);
    Q && (r2 = r2.concat(Q(t2)));
    for (var s2 = X(e2), i2 = X(t2), a2 = 0; a2 < r2.length; ++a2) {
      var c2 = r2[a2];
      if (!(c2 in H || n2 && n2[c2] || i2 && c2 in i2 || s2 && c2 in s2)) {
        var l2 = ee(t2, c2);
        try {
          Z(e2, c2, l2);
        } catch (e3) {
        }
      }
    }
  }
  return e2;
}
function re(e2) {
  return "function" == typeof e2;
}
function se(e2) {
  return "object" == typeof e2 && "styledComponentId" in e2;
}
function ie(e2, t2) {
  return e2 && t2 ? "".concat(e2, " ").concat(t2) : e2 || t2 || "";
}
function ae(e2, t2) {
  if (0 === e2.length) return "";
  for (var n2 = e2[0], o2 = 1; o2 < e2.length; o2++) n2 += e2[o2];
  return n2;
}
function ce(e2) {
  return null !== e2 && "object" == typeof e2 && e2.constructor.name === Object.name && !("props" in e2 && e2.$$typeof);
}
function le(e2, t2, n2) {
  if (void 0 === n2 && (n2 = false), !n2 && !ce(e2) && !Array.isArray(e2)) return t2;
  if (Array.isArray(t2)) for (var o2 = 0; o2 < t2.length; o2++) e2[o2] = le(e2[o2], t2[o2]);
  else if (ce(t2)) for (var o2 in t2) e2[o2] = le(e2[o2], t2[o2]);
  return e2;
}
function ue(e2, t2) {
  Object.defineProperty(e2, "toString", { value: t2 });
}
var pe = { 1: "Cannot create styled-component for component: %s.\n\n", 2: "Can't collect styles once you've consumed a `ServerStyleSheet`'s styles! `ServerStyleSheet` is a one off instance for each server-side render cycle.\n\n- Are you trying to reuse it across renders?\n- Are you accidentally calling collectStyles twice?\n\n", 3: "Streaming SSR is only supported in a Node.js environment; Please do not try to call this method in the browser.\n\n", 4: "The `StyleSheetManager` expects a valid target or sheet prop!\n\n- Does this error occur on the client and is your target falsy?\n- Does this error occur on the server and is the sheet falsy?\n\n", 5: "The clone method cannot be used on the client!\n\n- Are you running in a client-like environment on the server?\n- Are you trying to run SSR on the client?\n\n", 6: "Trying to insert a new style tag, but the given Node is unmounted!\n\n- Are you using a custom target that isn't mounted?\n- Does your document not have a valid head element?\n- Have you accidentally removed a style tag manually?\n\n", 7: 'ThemeProvider: Please return an object from your "theme" prop function, e.g.\n\n```js\ntheme={() => ({})}\n```\n\n', 8: 'ThemeProvider: Please make your "theme" prop an object.\n\n', 9: "Missing document `<head>`\n\n", 10: "Cannot find a StyleSheet instance. Usually this happens if there are multiple copies of styled-components loaded at once. Check out this issue for how to troubleshoot and fix the common cases where this situation can happen: https://github.com/styled-components/styled-components/issues/1941#issuecomment-417862021\n\n", 11: "_This error was replaced with a dev-time warning, it will be deleted for v4 final._ [createGlobalStyle] received children which will not be rendered. Please use the component without passing children elements.\n\n", 12: "It seems you are interpolating a keyframe declaration (%s) into an untagged string. This was supported in styled-components v3, but is not longer supported in v4 as keyframes are now injected on-demand. Please wrap your string in the css\\`\\` helper which ensures the styles are injected correctly. See https://www.styled-components.com/docs/api#css\n\n", 13: "%s is not a styled component and cannot be referred to via component selector. See https://www.styled-components.com/docs/advanced#referring-to-other-components for more details.\n\n", 14: 'ThemeProvider: "theme" prop is required.\n\n', 15: "A stylis plugin has been supplied that is not named. We need a name for each plugin to be able to prevent styling collisions between different stylis configurations within the same app. Before you pass your plugin to `<StyleSheetManager stylisPlugins={[]}>`, please make sure each plugin is uniquely-named, e.g.\n\n```js\nObject.defineProperty(importedPlugin, 'name', { value: 'some-unique-name' });\n```\n\n", 16: "Reached the limit of how many styled components may be created at group %s.\nYou may only create up to 1,073,741,824 components. If you're creating components dynamically,\nas for instance in your render method then you may be running into this limitation.\n\n", 17: "CSSStyleSheet could not be found on HTMLStyleElement.\nHas styled-components' style tag been unmounted or altered by another script?\n", 18: "ThemeProvider: Please make sure your useTheme hook is within a `<ThemeProvider>`" } ;
function de() {
  for (var e2 = [], t2 = 0; t2 < arguments.length; t2++) e2[t2] = arguments[t2];
  for (var n2 = e2[0], o2 = [], r2 = 1, s2 = e2.length; r2 < s2; r2 += 1) o2.push(e2[r2]);
  return o2.forEach(function(e3) {
    n2 = n2.replace(/%[a-z]/, e3);
  }), n2;
}
function he(t2) {
  for (var n2 = [], o2 = 1; o2 < arguments.length; o2++) n2[o2 - 1] = arguments[o2];
  return new Error(de.apply(void 0, __spreadArray([pe[t2]], n2, false)).trim());
}
var fe = function() {
  function e2(e3) {
    this.groupSizes = new Uint32Array(512), this.length = 512, this.tag = e3;
  }
  return e2.prototype.indexOfGroup = function(e3) {
    for (var t2 = 0, n2 = 0; n2 < e3; n2++) t2 += this.groupSizes[n2];
    return t2;
  }, e2.prototype.insertRules = function(e3, t2) {
    if (e3 >= this.groupSizes.length) {
      for (var n2 = this.groupSizes, o2 = n2.length, r2 = o2; e3 >= r2; ) if ((r2 <<= 1) < 0) throw he(16, "".concat(e3));
      this.groupSizes = new Uint32Array(r2), this.groupSizes.set(n2), this.length = r2;
      for (var s2 = o2; s2 < r2; s2++) this.groupSizes[s2] = 0;
    }
    for (var i2 = this.indexOfGroup(e3 + 1), a2 = (s2 = 0, t2.length); s2 < a2; s2++) this.tag.insertRule(i2, t2[s2]) && (this.groupSizes[e3]++, i2++);
  }, e2.prototype.clearGroup = function(e3) {
    if (e3 < this.length) {
      var t2 = this.groupSizes[e3], n2 = this.indexOfGroup(e3), o2 = n2 + t2;
      this.groupSizes[e3] = 0;
      for (var r2 = n2; r2 < o2; r2++) this.tag.deleteRule(n2);
    }
  }, e2.prototype.getGroup = function(e3) {
    var t2 = "";
    if (e3 >= this.length || 0 === this.groupSizes[e3]) return t2;
    for (var n2 = this.groupSizes[e3], o2 = this.indexOfGroup(e3), r2 = o2 + n2, s2 = o2; s2 < r2; s2++) t2 += "".concat(this.tag.getRule(s2)).concat(g);
    return t2;
  }, e2;
}(), me = 1 << 30, ye = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Map(), ge = 1, Se = function(e2) {
  if (ye.has(e2)) return ye.get(e2);
  for (; ve.has(ge); ) ge++;
  var t2 = ge++;
  if ((0 | t2) < 0 || t2 > me) throw he(16, "".concat(t2));
  return ye.set(e2, t2), ve.set(t2, e2), t2;
}, we = function(e2, t2) {
  ge = t2 + 1, ye.set(e2, t2), ve.set(t2, e2);
}, be = "style[".concat(f, "][").concat(y, '="').concat(v, '"]'), Ee = new RegExp("^".concat(f, '\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)')), Ne = function(e2, t2, n2) {
  for (var o2, r2 = n2.split(","), s2 = 0, i2 = r2.length; s2 < i2; s2++) (o2 = r2[s2]) && e2.registerName(t2, o2);
}, Pe = function(e2, t2) {
  for (var n2, o2 = (null !== (n2 = t2.textContent) && void 0 !== n2 ? n2 : "").split(g), r2 = [], s2 = 0, i2 = o2.length; s2 < i2; s2++) {
    var a2 = o2[s2].trim();
    if (a2) {
      var c2 = a2.match(Ee);
      if (c2) {
        var l2 = 0 | parseInt(c2[1], 10), u2 = c2[2];
        0 !== l2 && (we(u2, l2), Ne(e2, u2, c2[3]), e2.getTag().insertRules(l2, r2)), r2.length = 0;
      } else r2.push(a2);
    }
  }
}, _e = function(e2) {
  for (var t2 = document.querySelectorAll(be), n2 = 0, o2 = t2.length; n2 < o2; n2++) {
    var r2 = t2[n2];
    r2 && r2.getAttribute(f) !== m && (Pe(e2, r2), r2.parentNode && r2.parentNode.removeChild(r2));
  }
};
function Ce() {
  return "undefined" != typeof __webpack_nonce__ ? __webpack_nonce__ : null;
}
var Ie = function(e2) {
  var t2 = document.head, n2 = e2 || t2, o2 = document.createElement("style"), r2 = function(e3) {
    var t3 = Array.from(e3.querySelectorAll("style[".concat(f, "]")));
    return t3[t3.length - 1];
  }(n2), s2 = void 0 !== r2 ? r2.nextSibling : null;
  o2.setAttribute(f, m), o2.setAttribute(y, v);
  var i2 = Ce();
  return i2 && o2.setAttribute("nonce", i2), n2.insertBefore(o2, s2), o2;
}, Ae = function() {
  function e2(e3) {
    this.element = Ie(e3), this.element.appendChild(document.createTextNode("")), this.sheet = function(e4) {
      if (e4.sheet) return e4.sheet;
      for (var t2 = document.styleSheets, n2 = 0, o2 = t2.length; n2 < o2; n2++) {
        var r2 = t2[n2];
        if (r2.ownerNode === e4) return r2;
      }
      throw he(17);
    }(this.element), this.length = 0;
  }
  return e2.prototype.insertRule = function(e3, t2) {
    try {
      return this.sheet.insertRule(t2, e3), this.length++, true;
    } catch (e4) {
      return false;
    }
  }, e2.prototype.deleteRule = function(e3) {
    this.sheet.deleteRule(e3), this.length--;
  }, e2.prototype.getRule = function(e3) {
    var t2 = this.sheet.cssRules[e3];
    return t2 && t2.cssText ? t2.cssText : "";
  }, e2;
}(), Oe = function() {
  function e2(e3) {
    this.element = Ie(e3), this.nodes = this.element.childNodes, this.length = 0;
  }
  return e2.prototype.insertRule = function(e3, t2) {
    if (e3 <= this.length && e3 >= 0) {
      var n2 = document.createTextNode(t2);
      return this.element.insertBefore(n2, this.nodes[e3] || null), this.length++, true;
    }
    return false;
  }, e2.prototype.deleteRule = function(e3) {
    this.element.removeChild(this.nodes[e3]), this.length--;
  }, e2.prototype.getRule = function(e3) {
    return e3 < this.length ? this.nodes[e3].textContent : "";
  }, e2;
}(), De = function() {
  function e2(e3) {
    this.rules = [], this.length = 0;
  }
  return e2.prototype.insertRule = function(e3, t2) {
    return e3 <= this.length && (this.rules.splice(e3, 0, t2), this.length++, true);
  }, e2.prototype.deleteRule = function(e3) {
    this.rules.splice(e3, 1), this.length--;
  }, e2.prototype.getRule = function(e3) {
    return e3 < this.length ? this.rules[e3] : "";
  }, e2;
}(), Re = S, Te = { isServer: !S, useCSSOMInjection: !w }, ke = function() {
  function e2(e3, n2, o2) {
    void 0 === e3 && (e3 = C), void 0 === n2 && (n2 = {});
    var r2 = this;
    this.options = __assign(__assign({}, Te), e3), this.gs = n2, this.names = new Map(o2), this.server = !!e3.isServer, !this.server && S && Re && (Re = false, _e(this)), ue(this, function() {
      return function(e4) {
        for (var t2 = e4.getTag(), n3 = t2.length, o3 = "", r3 = function(n4) {
          var r4 = function(e5) {
            return ve.get(e5);
          }(n4);
          if (void 0 === r4) return "continue";
          var s3 = e4.names.get(r4), i2 = t2.getGroup(n4);
          if (void 0 === s3 || !s3.size || 0 === i2.length) return "continue";
          var a2 = "".concat(f, ".g").concat(n4, '[id="').concat(r4, '"]'), c2 = "";
          void 0 !== s3 && s3.forEach(function(e5) {
            e5.length > 0 && (c2 += "".concat(e5, ","));
          }), o3 += "".concat(i2).concat(a2, '{content:"').concat(c2, '"}').concat(g);
        }, s2 = 0; s2 < n3; s2++) r3(s2);
        return o3;
      }(r2);
    });
  }
  return e2.registerId = function(e3) {
    return Se(e3);
  }, e2.prototype.rehydrate = function() {
    !this.server && S && _e(this);
  }, e2.prototype.reconstructWithOptions = function(n2, o2) {
    return void 0 === o2 && (o2 = true), new e2(__assign(__assign({}, this.options), n2), this.gs, o2 && this.names || void 0);
  }, e2.prototype.allocateGSInstance = function(e3) {
    return this.gs[e3] = (this.gs[e3] || 0) + 1;
  }, e2.prototype.getTag = function() {
    return this.tag || (this.tag = (e3 = function(e4) {
      var t2 = e4.useCSSOMInjection, n2 = e4.target;
      return e4.isServer ? new De(n2) : t2 ? new Ae(n2) : new Oe(n2);
    }(this.options), new fe(e3)));
    var e3;
  }, e2.prototype.hasNameForId = function(e3, t2) {
    return this.names.has(e3) && this.names.get(e3).has(t2);
  }, e2.prototype.registerName = function(e3, t2) {
    if (Se(e3), this.names.has(e3)) this.names.get(e3).add(t2);
    else {
      var n2 = /* @__PURE__ */ new Set();
      n2.add(t2), this.names.set(e3, n2);
    }
  }, e2.prototype.insertRules = function(e3, t2, n2) {
    this.registerName(e3, t2), this.getTag().insertRules(Se(e3), n2);
  }, e2.prototype.clearNames = function(e3) {
    this.names.has(e3) && this.names.get(e3).clear();
  }, e2.prototype.clearRules = function(e3) {
    this.getTag().clearGroup(Se(e3)), this.clearNames(e3);
  }, e2.prototype.clearTag = function() {
    this.tag = void 0;
  }, e2;
}(), je = /&/g, xe = /^\s*\/\/.*$/gm;
function Ve(e2, t2) {
  return e2.map(function(e3) {
    return "rule" === e3.type && (e3.value = "".concat(t2, " ").concat(e3.value), e3.value = e3.value.replaceAll(",", ",".concat(t2, " ")), e3.props = e3.props.map(function(e4) {
      return "".concat(t2, " ").concat(e4);
    })), Array.isArray(e3.children) && "@keyframes" !== e3.type && (e3.children = Ve(e3.children, t2)), e3;
  });
}
function Fe(e2) {
  var t2, n2, o2, r2 = C , s2 = r2.options, i2 = void 0 === s2 ? C : s2, a2 = r2.plugins, c2 = void 0 === a2 ? _ : a2, l2 = function(e3, o3, r3) {
    return r3.startsWith(n2) && r3.endsWith(n2) && r3.replaceAll(n2, "").length > 0 ? ".".concat(t2) : e3;
  }, u2 = c2.slice();
  u2.push(function(e3) {
    e3.type === RULESET && e3.value.includes("&") && (e3.props[0] = e3.props[0].replace(je, n2).replace(o2, l2));
  }), i2.prefix && u2.push(prefixer), u2.push(stringify);
  var p2 = function(e3, r3, s3, a3) {
    void 0 === r3 && (r3 = ""), void 0 === s3 && (s3 = ""), void 0 === a3 && (a3 = "&"), t2 = a3, n2 = r3, o2 = new RegExp("\\".concat(n2, "\\b"), "g");
    var c3 = e3.replace(xe, ""), l3 = compile(s3 || r3 ? "".concat(s3, " ").concat(r3, " { ").concat(c3, " }") : c3);
    i2.namespace && (l3 = Ve(l3, i2.namespace));
    var p3 = [];
    return serialize(l3, middleware(u2.concat(rulesheet(function(e4) {
      return p3.push(e4);
    })))), p3;
  };
  return p2.hash = c2.length ? c2.reduce(function(e3, t3) {
    return t3.name || he(15), M(e3, t3.name);
  }, F).toString() : "", p2;
}
var Me = new ke(), ze = Fe(), $e = Rn.createContext({ shouldForwardProp: void 0, styleSheet: Me, stylis: ze }); $e.Consumer; Rn.createContext(void 0);
function Ge() {
  return x$2($e);
}
var We = function() {
  function e2(e3, t2) {
    var n2 = this;
    this.inject = function(e4, t3) {
      void 0 === t3 && (t3 = ze);
      var o2 = n2.name + t3.hash;
      e4.hasNameForId(n2.id, o2) || e4.insertRules(n2.id, o2, t3(n2.rules, o2, "@keyframes"));
    }, this.name = e3, this.id = "sc-keyframes-".concat(e3), this.rules = t2, ue(this, function() {
      throw he(12, String(n2.name));
    });
  }
  return e2.prototype.getName = function(e3) {
    return void 0 === e3 && (e3 = ze), this.name + e3.hash;
  }, e2;
}(), qe = function(e2) {
  return e2 >= "A" && e2 <= "Z";
};
function He(e2) {
  for (var t2 = "", n2 = 0; n2 < e2.length; n2++) {
    var o2 = e2[n2];
    if (1 === n2 && "-" === o2 && "-" === e2[0]) return e2;
    qe(o2) ? t2 += "-" + o2.toLowerCase() : t2 += o2;
  }
  return t2.startsWith("ms-") ? "-" + t2 : t2;
}
var Ue = function(e2) {
  return null == e2 || false === e2 || "" === e2;
}, Je = function(t2) {
  var n2, o2, r2 = [];
  for (var s2 in t2) {
    var i2 = t2[s2];
    t2.hasOwnProperty(s2) && !Ue(i2) && (Array.isArray(i2) && i2.isCss || re(i2) ? r2.push("".concat(He(s2), ":"), i2, ";") : ce(i2) ? r2.push.apply(r2, __spreadArray(__spreadArray(["".concat(s2, " {")], Je(i2), false), ["}"], false)) : r2.push("".concat(He(s2), ": ").concat((n2 = s2, null == (o2 = i2) || "boolean" == typeof o2 || "" === o2 ? "" : "number" != typeof o2 || 0 === o2 || n2 in unitlessKeys || n2.startsWith("--") ? String(o2).trim() : "".concat(o2, "px")), ";")));
  }
  return r2;
};
function Xe(e2, t2, n2, o2) {
  if (Ue(e2)) return [];
  if (se(e2)) return [".".concat(e2.styledComponentId)];
  if (re(e2)) {
    if (!re(s2 = e2) || s2.prototype && s2.prototype.isReactComponent || !t2) return [e2];
    var r2 = e2(t2);
    return "object" != typeof r2 || Array.isArray(r2) || r2 instanceof We || ce(r2) || null === r2 || console.error("".concat(B(e2), " is not a styled component and cannot be referred to via component selector. See https://www.styled-components.com/docs/advanced#referring-to-other-components for more details.")), Xe(r2, t2, n2, o2);
  }
  var s2;
  return e2 instanceof We ? n2 ? (e2.inject(n2, o2), [e2.getName(o2)]) : [e2] : ce(e2) ? Je(e2) : Array.isArray(e2) ? Array.prototype.concat.apply(_, e2.map(function(e3) {
    return Xe(e3, t2, n2, o2);
  })) : [e2.toString()];
}
var Ke = z(v), Qe = function() {
  function e2(e3, t2, n2) {
    this.rules = e3, this.staticRulesId = "", this.isStatic = false, this.componentId = t2, this.baseHash = M(Ke, t2), this.baseStyle = n2, ke.registerId(t2);
  }
  return e2.prototype.generateAndInjectStyles = function(e3, t2, n2) {
    var o2 = this.baseStyle ? this.baseStyle.generateAndInjectStyles(e3, t2, n2) : "";
    if (this.isStatic && !n2.hash) if (this.staticRulesId && t2.hasNameForId(this.componentId, this.staticRulesId)) o2 = ie(o2, this.staticRulesId);
    else {
      var r2 = ae(Xe(this.rules, e3, t2, n2)), s2 = x(M(this.baseHash, r2) >>> 0);
      if (!t2.hasNameForId(this.componentId, s2)) {
        var i2 = n2(r2, ".".concat(s2), void 0, this.componentId);
        t2.insertRules(this.componentId, s2, i2);
      }
      o2 = ie(o2, s2), this.staticRulesId = s2;
    }
    else {
      for (var a2 = M(this.baseHash, n2.hash), c2 = "", l2 = 0; l2 < this.rules.length; l2++) {
        var u2 = this.rules[l2];
        if ("string" == typeof u2) c2 += u2, a2 = M(a2, u2);
        else if (u2) {
          var p2 = ae(Xe(u2, e3, t2, n2));
          a2 = M(a2, p2 + l2), c2 += p2;
        }
      }
      if (c2) {
        var d2 = x(a2 >>> 0);
        t2.hasNameForId(this.componentId, d2) || t2.insertRules(this.componentId, d2, n2(c2, ".".concat(d2), void 0, this.componentId)), o2 = ie(o2, d2);
      }
    }
    return o2;
  }, e2;
}(), et = Rn.createContext(void 0); et.Consumer;
var rt = {}, st = /* @__PURE__ */ new Set();
function it(e2, r2, s2) {
  var i2 = se(e2), a2 = e2, c2 = !L(e2), p2 = r2.attrs, d2 = void 0 === p2 ? _ : p2, h2 = r2.componentId, f2 = void 0 === h2 ? function(e3, t2) {
    var n2 = "string" != typeof e3 ? "sc" : R(e3);
    rt[n2] = (rt[n2] || 0) + 1;
    var o2 = "".concat(n2, "-").concat($(v + n2 + rt[n2]));
    return t2 ? "".concat(t2, "-").concat(o2) : o2;
  }(r2.displayName, r2.parentComponentId) : h2, m2 = r2.displayName, y2 = void 0 === m2 ? function(e3) {
    return L(e3) ? "styled.".concat(e3) : "Styled(".concat(B(e3), ")");
  }(e2) : m2, g2 = r2.displayName && r2.componentId ? "".concat(R(r2.displayName), "-").concat(r2.componentId) : r2.componentId || f2, S2 = i2 && a2.attrs ? a2.attrs.concat(d2).filter(Boolean) : d2, w2 = r2.shouldForwardProp;
  if (i2 && a2.shouldForwardProp) {
    var b2 = a2.shouldForwardProp;
    if (r2.shouldForwardProp) {
      var E2 = r2.shouldForwardProp;
      w2 = function(e3, t2) {
        return b2(e3, t2) && E2(e3, t2);
      };
    } else w2 = b2;
  }
  var N2 = new Qe(s2, g2, i2 ? a2.componentStyle : void 0);
  function O2(e3, r3) {
    return function(e4, r4, s3) {
      var i3 = e4.attrs, a3 = e4.componentStyle, c3 = e4.defaultProps, p3 = e4.foldedComponentIds, d3 = e4.styledComponentId, h3 = e4.target, f3 = Rn.useContext(et), m3 = Ge(), y3 = e4.shouldForwardProp || m3.shouldForwardProp;
      P$2(d3);
      var v2 = I(r4, f3, c3) || C, g3 = function(e5, n2, o2) {
        for (var r5, s4 = __assign(__assign({}, n2), { className: void 0, theme: o2 }), i4 = 0; i4 < e5.length; i4 += 1) {
          var a4 = re(r5 = e5[i4]) ? r5(s4) : r5;
          for (var c4 in a4) s4[c4] = "className" === c4 ? ie(s4[c4], a4[c4]) : "style" === c4 ? __assign(__assign({}, s4[c4]), a4[c4]) : a4[c4];
        }
        return n2.className && (s4.className = ie(s4.className, n2.className)), s4;
      }(i3, r4, v2), S3 = g3.as || h3, w3 = {};
      for (var b3 in g3) void 0 === g3[b3] || "$" === b3[0] || "as" === b3 || "theme" === b3 && g3.theme === v2 || ("forwardedAs" === b3 ? w3.as = g3.forwardedAs : y3 && !y3(b3, S3) || (w3[b3] = g3[b3], y3 || false || isPropValid(b3) || st.has(b3) || !A.has(S3) || (st.add(b3), console.warn('styled-components: it looks like an unknown prop "'.concat(b3, '" is being sent through to the DOM, which will likely trigger a React console error. If you would like automatic filtering of unknown props, you can opt-into that behavior via `<StyleSheetManager shouldForwardProp={...}>` (connect an API like `@emotion/is-prop-valid`) or consider using transient props (`$` prefix for automatic filtering.)')))));
      var E3 = function(e5, t2) {
        var n2 = Ge(), o2 = e5.generateAndInjectStyles(t2, n2.styleSheet, n2.stylis);
        return P$2(o2), o2;
      }(a3, g3);
      e4.warnTooManyClasses && e4.warnTooManyClasses(E3);
      var N3 = ie(p3, d3);
      return E3 && (N3 += " " + E3), g3.className && (N3 += " " + g3.className), w3[L(S3) && !A.has(S3) ? "class" : "className"] = N3, s3 && (w3.ref = s3), _$2(S3, w3);
    }(D2, e3, r3);
  }
  O2.displayName = y2;
  var D2 = Rn.forwardRef(O2);
  return D2.attrs = S2, D2.componentStyle = N2, D2.displayName = y2, D2.shouldForwardProp = w2, D2.foldedComponentIds = i2 ? ie(a2.foldedComponentIds, a2.styledComponentId) : "", D2.styledComponentId = g2, D2.target = i2 ? a2.target : e2, Object.defineProperty(D2, "defaultProps", { get: function() {
    return this._foldedDefaultProps;
  }, set: function(e3) {
    this._foldedDefaultProps = i2 ? function(e4) {
      for (var t2 = [], n2 = 1; n2 < arguments.length; n2++) t2[n2 - 1] = arguments[n2];
      for (var o2 = 0, r3 = t2; o2 < r3.length; o2++) le(e4, r3[o2], true);
      return e4;
    }({}, a2.defaultProps, e3) : e3;
  } }), P(y2, g2), D2.warnTooManyClasses = /* @__PURE__ */ function(e3, t2) {
    var n2 = {}, o2 = false;
    return function(r3) {
      if (!o2 && (n2[r3] = true, Object.keys(n2).length >= 200)) {
        var s3 = t2 ? ' with the id of "'.concat(t2, '"') : "";
        console.warn("Over ".concat(200, " classes were generated for component ").concat(e3).concat(s3, ".\n") + "Consider using the attrs method, together with a style object for frequently changed styles.\nExample:\n  const Component = styled.div.attrs(props => ({\n    style: {\n      background: props.background,\n    },\n  }))`width: 100%;`\n\n  <Component />"), o2 = true, n2 = {};
      }
    };
  }(y2, g2), ue(D2, function() {
    return ".".concat(D2.styledComponentId);
  }), c2 && oe(D2, e2, { attrs: true, componentStyle: true, displayName: true, foldedComponentIds: true, shouldForwardProp: true, styledComponentId: true, target: true }), D2;
}
function at(e2, t2) {
  for (var n2 = [e2[0]], o2 = 0, r2 = t2.length; o2 < r2; o2 += 1) n2.push(t2[o2], e2[o2 + 1]);
  return n2;
}
var ct = function(e2) {
  return Object.assign(e2, { isCss: true });
};
function lt(t2) {
  for (var n2 = [], o2 = 1; o2 < arguments.length; o2++) n2[o2 - 1] = arguments[o2];
  if (re(t2) || ce(t2)) return ct(Xe(at(_, __spreadArray([t2], n2, true))));
  var r2 = t2;
  return 0 === n2.length && 1 === r2.length && "string" == typeof r2[0] ? Xe(r2) : ct(Xe(at(r2, n2)));
}
function ut(n2, o2, r2) {
  if (void 0 === r2 && (r2 = C), !o2) throw he(1, o2);
  var s2 = function(t2) {
    for (var s3 = [], i2 = 1; i2 < arguments.length; i2++) s3[i2 - 1] = arguments[i2];
    return n2(o2, r2, lt.apply(void 0, __spreadArray([t2], s3, false)));
  };
  return s2.attrs = function(e2) {
    return ut(n2, o2, __assign(__assign({}, r2), { attrs: Array.prototype.concat(r2.attrs, e2).filter(Boolean) }));
  }, s2.withConfig = function(e2) {
    return ut(n2, o2, __assign(__assign({}, r2), e2));
  }, s2;
}
var pt = function(e2) {
  return ut(it, e2);
}, dt = pt;
A.forEach(function(e2) {
  dt[e2] = pt(e2);
});
"undefined" != typeof navigator && "ReactNative" === navigator.product && console.warn("It looks like you've imported 'styled-components' on React Native.\nPerhaps you're looking to import 'styled-components/native'?\nRead more about this at https://www.styled-components.com/docs/basics#react-native");
var St = "__sc-".concat(f, "__");
"undefined" != typeof window && (window[St] || (window[St] = 0), 1 === window[St] && console.warn("It looks like there are several instances of 'styled-components' initialized in this application. This may cause dynamic styles to not render properly, errors during the rehydration process, a missing theme prop, and makes your application bigger without good reason.\n\nSee https://s-c.sh/2BAXzed for more info."), window[St] += 1);

const SettingWrapper = dt.div`
    border-bottom: ${(props) => props.$noBorder ? "none" : "1px solid var(--color-base-30)"} !important;

    &.react-obsidian-settings-item {
        padding: 8px !important;
        margin-bottom: 12px !important;
        transition: box-shadow 0.3s ease !important;

        .setting-item .button-active {
            background-color: var(--interactive-accent) !important;
            color: var(--text-on-accent) !important;
        }

        .setting-item .clickable-icon {
            color: var(--text-muted);
            transition: color 0.2s ease;
        }

        .setting-item .clickable-icon:hover {
            color: var(--text-normal);
        }

        .setting-item input[type='text'],
        .setting-item input[type='number'] {
            background-color: var(--background-secondary);
            border: 1px solid var(--background-modifier-border);
            border-radius: 4px;
            padding: 6px 8px;
            width: 100%;
        }

        &:last-child {
            border-bottom: none !important;
        }

        &.no-border {
            border-bottom: none !important;
        }
    }
`;

function isPrioritizedElement(element) {
  return void 0 !== element.priority;
}
const ReactObsidianSetting = ({
  name,
  desc,
  setHeading,
  setDisabled,
  setTooltip,
  noBorder,
  class: className,
  addToggles,
  addTexts,
  addTextAreas,
  addMomentFormats,
  addDropdowns,
  addSearches,
  addButtons,
  addExtraButtons,
  addSliders,
  addColorPickers,
  addProgressBars,
  addMultiDesc,
  setupSettingManually
}) => {
  const settingRef = Rn.useRef(null);
  const containerRef = Rn.useRef(null);
  const setupSetting = q$2(
    (setting) => {
      if (setupSettingManually) {
        setupSettingManually(setting);
      }
      if (name) {
        setting.setName(name);
      }
      if (desc) {
        setting.setDesc(desc);
      }
      if (setTooltip) {
        setting.setTooltip(setTooltip);
      }
      if (addMultiDesc) {
        const callback = isPrioritizedElement(addMultiDesc) ? addMultiDesc.callback : addMultiDesc;
        const descContainer = document.createElement("div");
        descContainer.addClass("setting-item-description");
        if (setting.infoEl) {
          setting.infoEl.appendChild(descContainer);
        }
        const multiDesc = new MultiDescComponent({
          containerEl: descContainer
        });
        callback(multiDesc);
      }
      if (setHeading) {
        setting.setHeading();
      }
      if (className) {
        setting.setClass(className);
      }
      const elements = [
        ...addToggles?.map((toggle, index) => ({
          type: "toggle",
          callback: isPrioritizedElement(toggle) ? toggle.callback : toggle,
          priority: isPrioritizedElement(toggle) ? toggle.priority : 0,
          originalIndex: index
        })) ?? [],
        ...addTexts?.map((text, index) => ({
          type: "text",
          callback: isPrioritizedElement(text) ? text.callback : text,
          priority: isPrioritizedElement(text) ? text.priority : 0,
          originalIndex: index
        })) ?? [],
        ...addTextAreas?.map((textArea, index) => ({
          type: "textArea",
          callback: isPrioritizedElement(textArea) ? textArea.callback : textArea,
          priority: isPrioritizedElement(textArea) ? textArea.priority : 0,
          originalIndex: index
        })) ?? [],
        ...addMomentFormats?.map((format, index) => ({
          type: "momentFormat",
          callback: isPrioritizedElement(format) ? format.callback : format,
          priority: isPrioritizedElement(format) ? format.priority : 0,
          originalIndex: index
        })) ?? [],
        ...addDropdowns?.map((dropdown, index) => ({
          type: "dropdown",
          callback: isPrioritizedElement(dropdown) ? dropdown.callback : dropdown,
          priority: isPrioritizedElement(dropdown) ? dropdown.priority : 0,
          originalIndex: index
        })) ?? [],
        ...addSearches?.map((search, index) => ({
          type: "search",
          callback: isPrioritizedElement(search) ? search.callback : search,
          priority: isPrioritizedElement(search) ? search.priority : 0,
          originalIndex: index
        })) ?? [],
        ...addColorPickers?.map((colorPicker, index) => ({
          type: "colorPicker",
          callback: isPrioritizedElement(colorPicker) ? colorPicker.callback : colorPicker,
          priority: isPrioritizedElement(colorPicker) ? colorPicker.priority : 0,
          originalIndex: index
        })) ?? [],
        ...addProgressBars?.map((progressBar, index) => ({
          type: "progressBar",
          callback: isPrioritizedElement(progressBar) ? progressBar.callback : progressBar,
          priority: isPrioritizedElement(progressBar) ? progressBar.priority : 0,
          originalIndex: index
        })) ?? [],
        ...addButtons?.map((button, index) => ({
          type: "button",
          callback: isPrioritizedElement(button) ? button.callback : button,
          priority: isPrioritizedElement(button) ? button.priority : 9,
          originalIndex: index
        })) ?? [],
        ...addExtraButtons?.map((button, index) => ({
          type: "extraButton",
          callback: isPrioritizedElement(button) ? button.callback : button,
          priority: isPrioritizedElement(button) ? button.priority : 10,
          originalIndex: index
        })) ?? [],
        ...addSliders?.map((slider, index) => ({
          type: "slider",
          callback: isPrioritizedElement(slider) ? slider.callback : slider,
          priority: isPrioritizedElement(slider) ? slider.priority : 0,
          originalIndex: index
        })) ?? []
      ].filter(
        (element) => element.callback !== void 0 && element.callback !== false
      );
      const sortedElements = elements.sort((a, b) => {
        if (a.priority === b.priority) {
          return a.originalIndex - b.originalIndex;
        }
        return a.priority - b.priority;
      });
      sortedElements.forEach((element) => {
        switch (element.type) {
          case "toggle":
            setting.addToggle(element.callback);
            break;
          case "text":
            setting.addText(element.callback);
            break;
          case "textArea":
            setting.addTextArea(element.callback);
            break;
          case "momentFormat":
            setting.addMomentFormat(element.callback);
            break;
          case "dropdown":
            setting.addDropdown(element.callback);
            break;
          case "search":
            setting.addSearch(element.callback);
            break;
          case "colorPicker":
            setting.addColorPicker(element.callback);
            break;
          case "progressBar":
            setting.addProgressBar(element.callback);
            break;
          case "button":
            setting.addButton(element.callback);
            break;
          case "extraButton":
            setting.addExtraButton(element.callback);
            break;
          case "slider":
            setting.addSlider(element.callback);
            break;
        }
      });
      setting.setDisabled(!!setDisabled);
    },
    [
      name,
      desc,
      setHeading,
      setDisabled,
      setTooltip,
      className,
      addToggles,
      addTexts,
      addTextAreas,
      addMomentFormats,
      addDropdowns,
      addSearches,
      addButtons,
      addExtraButtons,
      addSliders,
      addColorPickers,
      addProgressBars,
      addMultiDesc,
      setupSettingManually
    ]
  );
  _$1(() => {
    if (!containerRef.current) {
      return;
    }
    containerRef.current.empty();
    settingRef.current = new obsidian.Setting(
      containerRef.current
    );
    setupSetting(settingRef.current);
    return () => {
      containerRef.current?.empty();
    };
  }, [
    name,
    desc,
    setHeading,
    setDisabled,
    setTooltip,
    noBorder,
    className,
    addToggles,
    addTexts,
    addTextAreas,
    addMomentFormats,
    addDropdowns,
    addSearches,
    addButtons,
    addExtraButtons,
    addSliders,
    addColorPickers,
    addProgressBars,
    addMultiDesc,
    setupSettingManually
  ]);
  return /* @__PURE__ */ u$1(
    SettingWrapper,
    {
      $noBorder: noBorder,
      ref: containerRef,
      className: `react-obsidian-settings-item ${className ?? ""}`
    }
  );
};

const ReactObsidianModal = ({
  children,
  title,
  onOpen,
  onClose,
  maxHeight,
  maxWidth,
  width,
  height,
  closable = true,
  className
}) => {
  const modalRoot = document.body;
  const reactHandler = (e) => {
    if (e.key === "Escape" && closable) {
      onClose();
    }
  };
  const windowHandler = (e) => {
    if (e.key === "Escape" && closable) {
      onClose();
    }
  };
  y$1(() => {
    window.addEventListener("keydown", windowHandler);
    return () => {
      window.removeEventListener("keydown", windowHandler);
    };
  }, [onClose]);
  y$1(() => {
    onOpen && onOpen();
  }, [onOpen]);
  const [modalContainerStyle, setModalContainerStyle] = Rn.useState({});
  y$1(() => {
    const style = {};
    if (width) style["--dialog-width"] = width;
    if (height) style.height = height;
    if (maxWidth) style["--dialog-max-width"] = maxWidth;
    if (maxHeight) style["--dialog-max-height"] = maxHeight;
    if (width && !maxWidth) style["--dialog-max-width"] = width;
    if (height && !maxHeight) style["--dialog-max-height"] = height;
    setModalContainerStyle(style);
  }, [width, height, maxWidth, maxHeight]);
  return $$1(
    /* @__PURE__ */ u$1(
      "div",
      {
        className: "modal-container mod-dim",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "modal-title",
        style: modalContainerStyle,
        children: [
          /* @__PURE__ */ u$1(
            "div",
            {
              className: "modal-bg",
              onClick: () => closable && onClose(),
              style: { opacity: "0.85" },
              "aria-hidden": "true",
              onKeyDown: reactHandler
            }
          ),
          /* @__PURE__ */ u$1("div", { className: `modal ${className ?? ""}`, children: [
            /* @__PURE__ */ u$1(
              "div",
              {
                className: "modal-close-button",
                onClick: () => closable && onClose(),
                "aria-label": "Close modal"
              }
            ),
            /* @__PURE__ */ u$1("div", { className: "modal-header", children: /* @__PURE__ */ u$1("div", { className: "modal-title", children: title }) }),
            /* @__PURE__ */ u$1("div", { className: "modal-content", children })
          ] })
        ]
      }
    ),
    modalRoot
  );
};

const InfoModal = ({ info, onClose }) => {
  return /* @__PURE__ */ u$1(
    ReactObsidianModal,
    {
      title: "Image unit properties",
      onClose,
      width: "500px",
      maxHeight: "80vh",
      children: [
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "General Information",
            setHeading: true
          }
        ),
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "Name",
            desc: info.name
          }
        ),
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "Selector",
            desc: info.selector
          }
        ),
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "Status",
            desc: info.enabled ? "Enabled" : "Disabled"
          }
        ),
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "Element type",
            desc: info.elementType
          }
        ),
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "Dimensions",
            setHeading: true
          }
        ),
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "Width",
            desc: `${info.dimensions.width}px`
          }
        ),
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "Height",
            desc: `${info.dimensions.height}px`
          }
        ),
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "Source Location",
            setHeading: true
          }
        ),
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "Start line",
            desc: info.sourceLocation.lineStart.toString()
          }
        ),
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "End line",
            desc: info.sourceLocation.lineEnd.toString()
          }
        ),
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "Lines count",
            desc: info.sourceLocation.linesCount.toString()
          }
        ),
        info.panels.length > 0 && /* @__PURE__ */ u$1(k$3, { children: [
          /* @__PURE__ */ u$1(
            ReactObsidianSetting,
            {
              name: "Panels",
              setHeading: true
            }
          ),
          info.panels.map((panel, index) => /* @__PURE__ */ u$1(
            ReactObsidianSetting,
            {
              name: panel.name,
              desc: panel.enabled ? "\u2713 Enabled" : "\u2717 Disabled"
            },
            `${index}-${panel.name}`
          ))
        ] })
      ]
    }
  );
};

let Info$1 = class Info extends obsidian.Component {
  constructor(contextMenu) {
    super();
    this.contextMenu = contextMenu;
  }
  modalDiv;
  reactRoot;
  showInfo() {
    const info = this.info;
    this.modalDiv ??= document.createElement("div");
    document.body.appendChild(this.modalDiv);
    if (!this.reactRoot) {
      this.reactRoot = createRoot(this.modalDiv);
      this.reactRoot.render(
        /* @__PURE__ */ u$1(
          InfoModal,
          {
            info,
            onClose: this.closeModal
          }
        )
      );
    }
  }
  closeModal = () => {
    this.reactRoot?.unmount();
    this.reactRoot = void 0;
    this.modalDiv?.remove();
    this.modalDiv = void 0;
  };
  get info() {
    const unit = this.contextMenu.events.unit;
    const element = unit.context.element;
    const dSize = unit.context.size;
    const sourceData = unit.context.sourceData;
    const config = unit.context.options;
    const info = {
      name: config.name,
      selector: config.selector,
      enabled: config.on,
      dimensions: {
        width: dSize.width,
        height: dSize.height
      },
      sourceLocation: {
        lineStart: sourceData.lineStart,
        lineEnd: sourceData.lineEnd,
        linesCount: sourceData.lineEnd - sourceData.lineStart + 1
      },
      panels: Object.entries(config.panels).map(([name, panel]) => ({
        name,
        enabled: panel.on
      })),
      elementType: element.tagName.toLowerCase()
    };
    return info;
  }
  onunload() {
    super.onunload();
    this.closeModal();
  }
};

class ContextMenu extends obsidian.Component {
  constructor(events) {
    super();
    this.events = events;
    this.export = new Export(this);
    this.copy = new CopyUnit(this);
    this.copySource = new CopyUnitSource(this);
    this.info = new Info$1(this);
    this.addChild(this.export);
    this.addChild(this.copy);
    this.addChild(this.copySource);
    this.addChild(this.info);
  }
  export;
  copy;
  copySource;
  info;
  initialize() {
    this.load();
    const { container } = this.events.unit.context;
    this.registerDomEvent(container, "contextmenu", this.onContextMenu, {
      capture: true,
      passive: false
    });
  }
  onContextMenu = (event) => {
    const { element } = this.events.unit.context;
    event.preventDefault();
    event.stopPropagation();
    const isThisSvg = element.matches("svg");
    this.events.unit.context.content.focus();
    const menu = new obsidian.Menu();
    menu.addItem((item) => {
      item.setIcon("download");
      item.setTitle("Export as image");
      item.onClick(async () => {
        await this.export.export();
      });
    });
    menu.addItem((item) => {
      item.setIcon("copy");
      item.setTitle(`Copy ${!isThisSvg ? "as image" : "as SVG code"}`);
      item.onClick(async () => {
        await this.copy.copy();
      });
    });
    menu.addItem((item) => {
      item.setIcon("file-text");
      item.setTitle("Copy as source");
      item.onClick(async () => {
        await this.copySource.copy();
      });
    });
    menu.addItem((item) => {
      item.setIcon("info");
      item.setTitle("Info");
      item.onClick(async () => {
        this.info.showInfo();
      });
    });
    menu.showAtMouseEvent(event);
  };
}

class Focus extends obsidian.Component {
  constructor(events) {
    super();
    this.events = events;
  }
  initialize() {
    this.load();
    const { container } = this.events.unit.context;
    this.registerDomEvent(container, "focusin", this.focusIn);
    this.registerDomEvent(container, "focusout", this.focusOut);
  }
  focusIn = () => {
    if (this.events.unit.plugin.settings.data.units.folding.autoFoldOnFocusChange) {
      this.events.unit.controlPanel.fold.unfold();
    }
    this.events.unit.controlPanel.show(TriggerType.FOCUS);
  };
  focusOut = () => {
    if (this.events.unit.plugin.settings.data.units.folding.autoFoldOnFocusChange) {
      this.events.unit.controlPanel.fold.fold();
    }
    this.events.unit.controlPanel.hide(TriggerType.FOCUS);
  };
}

class Keyboard extends obsidian.Component {
  constructor(events) {
    super();
    this.events = events;
  }
  initialize() {
    this.load();
    const { container } = this.events.unit.context;
    this.registerDomEvent(container, "keydown", this.keyDown);
  }
  keyDown = (event) => {
    const key = event.code;
    const KEYS = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Equal",
      "Minus",
      "Digit0"
    ];
    if (!KEYS.includes(key)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    switch (key) {
      case "ArrowUp":
        this.events.unit.actions.moveElement(0, 50, {
          animated: true
        });
        break;
      case "ArrowDown":
        this.events.unit.actions.moveElement(0, -50, {
          animated: true
        });
        break;
      case "ArrowLeft":
        this.events.unit.actions.moveElement(50, 0, {
          animated: true
        });
        break;
      case "ArrowRight":
        this.events.unit.actions.moveElement(-50, 0, {
          animated: true
        });
        break;
    }
    if (event.ctrlKey) {
      switch (key) {
        case "Equal":
          this.events.unit.actions.zoomElement(1.1, {
            animated: true
          });
          break;
        case "Minus":
          this.events.unit.actions.zoomElement(0.9, {
            animated: true
          });
          break;
        case "Digit0":
          this.events.unit.actions.resetZoomAndMove({
            animated: true
          });
          break;
      }
    }
  };
}

class Mouse extends obsidian.Component {
  constructor(events) {
    super();
    this.events = events;
  }
  startX;
  startY;
  initialX;
  initialY;
  isDragging = false;
  initialize() {
    this.load();
    const { container } = this.events.unit.context;
    this.registerDomEvent(container, "wheel", this.wheel, {
      passive: true
    });
    this.registerDomEvent(container, "wheel", this.wheelScroll, {
      passive: true
    });
    this.registerDomEvent(container, "mousedown", this.mouseDown);
    this.registerDomEvent(container, "mousemove", this.mouseMove);
    this.registerDomEvent(container, "mouseup", this.mouseUp);
    this.registerDomEvent(container, "mouseleave", this.mouseLeave);
    this.registerDomEvent(container, "mouseenter", this.mouseEnterOnUnit);
    this.registerDomEvent(container, "mouseleave", this.mouseLeaveOutUnit);
  }
  get elements() {
    const container = this.events.unit.context.container;
    const content = this.events.unit.context.content;
    return { container, content };
  }
  wheel = (event) => {
    if (!event.ctrlKey && document.fullscreenElement !== this.events.unit.context.content) {
      return;
    }
    if (event.shiftKey || event.altKey) {
      return;
    }
    const { content, container } = this.elements;
    const viewportCenterX = event.clientX;
    const viewportCenterY = event.clientY;
    const contentRect = content.getBoundingClientRect();
    const contentCenterX = contentRect.left + contentRect.width / 2;
    const contentCenterY = contentRect.top + contentRect.height / 2;
    const offsetX = (viewportCenterX - contentCenterX) / this.events.unit.scale;
    const offsetY = (viewportCenterY - contentCenterY) / this.events.unit.scale;
    event.deltaY < 0 ? 1.1 : 0.9;
    const prevScale = this.events.unit.scale;
    this.events.unit.scale += event.deltaY * -1e-3;
    this.events.unit.scale = Math.max(0.125, this.events.unit.scale);
    const scaleDiff = this.events.unit.scale - prevScale;
    this.events.unit.dx -= offsetX * scaleDiff;
    this.events.unit.dy -= offsetY * scaleDiff;
    content.setCssStyles({
      transform: `translate(${this.events.unit.dx}px, ${this.events.unit.dy}px) scale(${this.events.unit.scale})`
    });
  };
  wheelScroll = (event) => {
    if (!(event.shiftKey || event.altKey)) {
      return;
    }
    const isHorizontal = event.shiftKey && !event.altKey;
    const isVertical = event.shiftKey && event.altKey;
    let x = 0, y = 0;
    if (isHorizontal) {
      x = event.deltaY > 0 ? 20 : -20;
    }
    if (isVertical) {
      y = event.deltaY > 0 ? 20 : -20;
    }
    this.events.unit.actions.moveElement(x, y, { animated: true });
  };
  mouseDown = (event) => {
    if (event.button !== 0) {
      return;
    }
    const { container, content } = this.elements;
    container.focus({ preventScroll: true });
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.initialX = this.events.unit.dx;
    this.initialY = this.events.unit.dy;
    content.setCssStyles({
      cursor: "grabbing"
    });
    event.preventDefault();
  };
  mouseMove = (event) => {
    if (!this.isDragging) {
      return;
    }
    const { content } = this.elements;
    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;
    this.events.unit.dx = this.initialX + dx;
    this.events.unit.dy = this.initialY + dy;
    content.setCssStyles({
      transform: `translate(${this.events.unit.dx}px, ${this.events.unit.dy}px) scale(${this.events.unit.scale})`
    });
  };
  mouseUp = (event) => {
    const { content } = this.elements;
    this.isDragging = false;
    content.setCssStyles({ cursor: "grab" });
  };
  mouseLeave = (event) => {
    this.mouseUp(event);
  };
  mouseEnterOnUnit = (e) => {
    this.events.unit.controlPanel.show(TriggerType.MOUSE);
  };
  mouseLeaveOutUnit = (e) => {
    this.events.unit.controlPanel.hide(TriggerType.MOUSE);
  };
}

class Touch extends obsidian.Component {
  constructor(events) {
    super();
    this.events = events;
  }
  startX;
  startY;
  initialDistance;
  isDragging = false;
  isPinching = false;
  /**
   * Adds touch event listeners to the given container element.
   *
   * This function registers the following touch event listeners to the given container element:
   * - `touchstart`: Handles the start of a touch event for the container element.
   * - `touchmove`: Handles the movement during a touch event for the container element.
   * - `touchend`: Handles the end of a touch event for the container element.
   *
   * @param container - The container element to add the touch event listeners to.
   */
  initialize() {
    this.load();
    const { container } = this.events.unit.context;
    this.registerDomEvent(container, "touchstart", this.touchStart, {
      passive: false
    });
    this.registerDomEvent(container, "touchmove", this.touchMove, {
      passive: false
    });
    this.registerDomEvent(container, "touchend", this.touchEnd, {
      passive: false
    });
  }
  /**
   * Handles the `touchstart` event on the given container element.
   *
   * If native touch event handling is enabled, this function does nothing.
   *
   * Otherwise, this function sets the active container to the given container,
   * prevents the default behavior of the event, and stops the event from propagating.
   *
   * If there is only one touch point, this function sets the `isDragging` flag to
   * true and records the starting position of the touch.
   *
   * If there are two touch points, this function sets the `isPinching` flag to
   * true and records the initial distance between the two touch points.
   *
   * @param container - The container element that received the touch event.
   * @param e - The `TouchEvent` object that represents the touch event.
   */
  touchStart = (e) => {
    if (this.events.unit.nativeTouchEventsEnabled) {
      return;
    }
    const target = e.target;
    if (target.closest(".interactify-panel")) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    if (e.touches.length === 1) {
      this.isDragging = true;
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      this.isPinching = true;
      this.initialDistance = this.calculateDistance(e.touches);
    }
  };
  touchMove = (e) => {
    if (this.events.unit.nativeTouchEventsEnabled) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const content = this.events.unit.context.content;
    if (!content) {
      return;
    }
    if (this.isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - this.startX;
      const dy = e.touches[0].clientY - this.startY;
      this.events.unit.actions.moveElement(dx, dy);
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    } else if (this.isPinching && e.touches.length === 2) {
      const currentDistance = this.calculateDistance(e.touches);
      const factor = currentDistance / this.initialDistance;
      this.events.unit.actions.zoomElement(factor);
      this.initialDistance = currentDistance;
    }
  };
  /**
   * Handles the `touchend` event on the given container element.
   *
   * If native touch event handling is enabled, this function does nothing.
   *
   * Otherwise, this function prevents the default behavior of the event
   * and stops the event from propagating. It updates the active container
   * to the given container. It also resets the `isDragging` and `isPinching`
   * flags to false.
   *
   * @param container - The container element that received the touch event.
   * @param e - The `TouchEvent` object that represents the touch event.
   */
  touchEnd = (e) => {
    if (this.events.unit.nativeTouchEventsEnabled) {
      return;
    }
    this.events.unit.context.container;
    const target = e.target;
    if (target.closest(".interactify-panel")) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = false;
    this.isPinching = false;
  };
  /**
   * Calculates the distance between the two touch points.
   *
   * @param touches - The two touch points.
   * @returns The distance between the two touch points.
   */
  calculateDistance(touches) {
    const [touch1, touch2] = [touches[0], touches[1]];
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Events extends obsidian.Component {
  constructor(unit) {
    super();
    this.unit = unit;
    this.mouse = new Mouse(this);
    this.touch = new Touch(this);
    this.keyboard = new Keyboard(this);
    this.focus = new Focus(this);
    this.contextMenu = new ContextMenu(this);
    this.addChild(this.mouse);
    this.addChild(this.touch);
    this.addChild(this.keyboard);
    this.addChild(this.focus);
    this.addChild(this.contextMenu);
  }
  mouse;
  touch;
  keyboard;
  focus;
  contextMenu;
  initialize() {
    this.load();
    this.mouse.initialize();
    this.touch.initialize();
    this.keyboard.initialize();
    this.focus.initialize();
    this.contextMenu.initialize();
  }
}

class InteractifyUnitStateManager extends obsidian.Component {
  constructor(unit) {
    super();
    this.unit = unit;
    this.load();
  }
  intersectionObserver = null;
  initialize() {
    this.unit.plugin.eventBus.on("toggle-element", this.onToggleElement);
    this.scheduleActivationIfNeeded();
  }
  scheduleActivationIfNeeded() {
    if (this.unit.context.adapter === InteractifyAdapters.PickerMode) {
      queueMicrotask(async () => await this.activate());
      return;
    }
    const settings = this.unit.plugin.settings;
    if (!settings.data.units.interactivity.markdown.autoDetect) {
      return;
    }
    switch (settings.data.units.interactivity.markdown.activationMode) {
      case ActivationMode.Immediate:
        queueMicrotask(async () => await this.activate());
        break;
      case ActivationMode.Lazy:
        this.setupIntersectionObserver();
        break;
    }
  }
  onToggleElement = async (data) => {
    if (data.element === this.unit.context.element) {
      this.unit.active ? await this.deactivate() : await this.activate();
    }
  };
  activate = async () => {
    if (this.unit.active) {
      return;
    }
    this.unit.context.element.setAttribute(
      "data-interactive-mode",
      InteractiveMode.Interactive
    );
    await this.smoothTransition(
      this.unit.context.originalParent,
      async () => {
        await this.switchToInteractive();
        this.unit.initialize();
      }
    );
    this.unit.context.originalParent.style.removeProperty("transition");
    this.unit.context.originalParent.style.removeProperty("transform");
  };
  deactivate = async () => {
    if (!this.unit.active) {
      return;
    }
    this.unit.context.element.setAttribute(
      "data-interactive-mode",
      InteractiveMode.NonInteractive
    );
    await this.smoothTransition(
      this.unit.context.originalParent,
      async () => {
        this.unit.unload();
        this.unit.controlPanel.controlPanel?.remove();
        await this.switchToNonInteractive();
      }
    );
    this.unit.context.originalParent.style.removeProperty("transition");
    this.unit.context.originalParent.style.removeProperty("transform");
  };
  async smoothTransition(element, callback) {
    const transition = element.animate(
      [
        { opacity: "1", transform: "scale(1)", filter: "blur(0)" },
        { opacity: "0", transform: "scale(0.96)", filter: "blur(1px)" }
      ],
      { duration: 150, fill: "forwards" }
    );
    await transition.finished;
    await callback();
    return element.animate(
      [
        { opacity: "0", transform: "scale(0.96)", filter: "blur(1px)" },
        { opacity: "1", transform: "scale(1)", filter: "blur(0)" }
      ],
      { duration: 200, easing: "ease-out", fill: "forwards" }
    ).finished;
  }
  async switchToInteractive() {
    this.unit.active = true;
    this.unit.plugin.logger.debug(
      `Switch unit with id ${this.unit.id} to interactive state`
    );
    const { content, container, element, originalParent } = this.unit.context;
    this.unit.context.content.setCssStyles({
      transform: `translate(${this.unit.dx}px, ${this.unit.dy}px) scale(${this.unit.scale})`
    });
    if (this.unit.context.element instanceof SVGElement) {
      const originalParentClasses = originalParent.className.trim();
      originalParentClasses && content.addClasses(originalParentClasses.split(/\s+/));
      content.removeClass("live-preview-parent");
      originalParent.className = "";
    }
    this.unit.context.adapter === InteractifyAdapters.LivePreview && this.unit.context.livePreviewWidget?.addClass(
      "live-preview-parent"
    );
    if (this.unit.context.livePreviewWidget) {
      this.unit.registerDomEvent(
        this.unit.context.livePreviewWidget,
        "click",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        true
      );
    }
    originalParent.replaceChild(container, element);
    container.appendChild(content);
    content.appendChild(element);
    await this.waitForElementsLayout([element, content, container]);
  }
  async switchToNonInteractive() {
    this.unit.active = false;
    this.unit.plugin.logger.debug(
      `Switch unit with id ${this.unit.id} to non-interactive state`
    );
    const { content, container, element, originalParent } = this.unit.context;
    if (this.unit.context.element instanceof SVGElement) {
      originalParent.className = content.className;
      originalParent.removeClass("interactify-content");
    }
    if (this.unit.context.adapter === InteractifyAdapters.LivePreview) {
      const lPreviewWidget = this.unit.context.livePreviewWidget;
      lPreviewWidget?.removeClass("live-preview-parent");
      lPreviewWidget?.style?.removeProperty("height");
      lPreviewWidget?.style?.removeProperty("width");
    }
    originalParent.replaceChild(element, container);
    container.remove();
    content.remove();
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  waitForElementsLayout(elements) {
    return new Promise((resolve) => {
      const checkLayout = () => {
        if (!this._loaded) {
          resolve();
          return;
        }
        const allReady = elements.every((el) => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });
        if (!allReady) {
          requestAnimationFrame(checkLayout);
          return;
        }
        const elementRect = elements[0].getBoundingClientRect();
        if (this.unit.context.size.width === 0) {
          this.unit.context.size.width = elementRect.width;
        }
        if (this.unit.context.size.height === 0) {
          this.unit.context.size.height = elementRect.height;
        }
        resolve();
      };
      requestAnimationFrame(checkLayout);
    });
  }
  setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.intersectionRatio > 0.7) {
            this.intersectionObserver?.disconnect();
            this.intersectionObserver = null;
            await this.activate();
          }
        });
      },
      {
        root: null,
        threshold: [0, 0.1, 0.5, 1]
      }
    );
    this.intersectionObserver.observe(this.unit.context.element);
  }
  onunload() {
    super.onunload();
    this.unit.plugin.eventBus.off("toggle-element", this.onToggleElement);
    this.intersectionObserver?.disconnect();
    this.unit.context.element.removeAttribute(
      "data-interactive-initialization-status"
    );
    this.unit.context.element.removeAttribute("data-interactive-mode");
  }
}

class InteractifyUnit extends obsidian.Component {
  id;
  dx = 0;
  dy = 0;
  scale = 1;
  nativeTouchEventsEnabled = false;
  context;
  fileStats;
  active = false;
  actions;
  controlPanel;
  events;
  interactiveStateManager;
  plugin;
  constructor(plugin, context, fileStats) {
    super();
    this.id = crypto.randomUUID();
    this.plugin = plugin;
    this.context = context;
    this.fileStats = fileStats;
    this.interactiveStateManager = new InteractifyUnitStateManager(this);
    this.actions = new UnitActions(this);
    this.controlPanel = new ControlPanel(this);
    this.events = new Events(this);
    this.addChild(this.events);
    this.addChild(this.controlPanel);
    this.interactiveStateManager.initialize();
  }
  initialize() {
    this.plugin.logger.debug(`Initialize unit with id ${this.id}`);
    this.load();
    this.events.initialize();
    this.controlPanel.initialize();
    this.applyLayout();
    this.plugin.logger.debug("Unit initialized successfully", {
      id: this.id
    });
  }
  applyLayout() {
    updateUnitSize(
      this.context,
      this.context.size,
      this.plugin.settings.data.units.size,
      this.plugin.context.inLivePreviewMode
    );
    this.actions.fitToContainer({ animated: true });
  }
  async onDelete() {
    await this.interactiveStateManager.deactivate();
    this.interactiveStateManager.unload();
  }
  onunload() {
    super.onunload();
    this.plugin.logger.debug(
      `Called unload for interactive element with id ${this.id}`
    );
  }
}

class InteractifyUnitFactory {
  static createUnit(plugin, context, fileStats) {
    plugin.logger.debug("Creating unit...");
    const unit = new InteractifyUnit(plugin, context, fileStats);
    plugin.logger.debug("Unit was created and initialized successfully.");
    return unit;
  }
}

class BaseAdapter {
  constructor(plugin, fileStat) {
    this.plugin = plugin;
    this.fileStat = fileStat;
  }
  matchInteractiveElement(element) {
    const interactive = element;
    const units = this.plugin.settings.data.units.configs;
    const specific = units.filter(
      (u) => ![UnitConfigs.IMG_SVG, UnitConfigs.Default].includes(
        u.selector
      )
    );
    const defaults = units.filter(
      (u) => [UnitConfigs.IMG_SVG, UnitConfigs.Default].includes(
        u.selector
      )
    );
    for (const unit of [...specific, ...defaults]) {
      if (!unit.on) continue;
      if (element.matches(unit.selector) || element.closest(unit.selector)) {
        return {
          element: interactive,
          options: JSON.parse(JSON.stringify(unit))
        };
      }
    }
    return void 0;
  }
  initializationGuard(context) {
    if (context.element.dataset.interactiveInitializationStatus !== void 0) {
      return false;
    }
    const initializationStatus = !context.element.cmView ? InteractiveInitialization.Initialized : InteractiveInitialization.NotInitialized;
    context.element.setAttribute(
      "data-interactive-initialization-status",
      initializationStatus
    );
    return initializationStatus !== InteractiveInitialization.NotInitialized;
  }
  isThisSvgIcon(element) {
    if (!(element instanceof SVGElement)) {
      return false;
    }
    const svg = element;
    if (svg.closest("button") || svg.closest(".edit-block-button")) {
      return true;
    }
    if (svg.classList.contains("svg-icon")) {
      return true;
    }
    const rect = svg.getBoundingClientRect();
    if (rect.width > 0 && rect.width <= 32 && rect.height > 0 && rect.height <= 32) {
      return true;
    }
    const parent = svg.parentElement;
    if (parent) {
      const pRect = parent.getBoundingClientRect();
      if (pRect.width > 0 && pRect.width <= 32 && pRect.height > 0 && pRect.height <= 32) {
        return true;
      }
    }
    return false;
  }
  getElSize(context) {
    const el = context.element;
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height
    };
  }
  createUnit(context) {
    const unit = InteractifyUnitFactory.createUnit(
      this.plugin,
      context,
      this.fileStat
    );
    this.emitCreated(unit);
  }
  emitCreated(unit) {
    this.plugin.eventBus.emit("unit.created", unit);
  }
  finalizeContext(ctx) {
    if (!ctx.element || !ctx.sourceData || !ctx.size || !ctx.container || !ctx.content || !ctx.options) {
      throw new Error("Incomplete context");
    }
    return ctx;
  }
  async createInteractiveElementWrapper(context) {
    const container = document.createElement("div");
    const content = document.createElement("div");
    container.addClass("interactify-container");
    content.addClass("interactify-content");
    const el = context.element;
    const originalParent = el.parentElement;
    const renderingMode = this.plugin.context.inPreviewMode ? "preview" : "live-preview";
    container.setAttribute(
      "data-interactify-rendering-mode",
      `${renderingMode}`
    );
    container.setAttribute(
      "data-folded",
      this.plugin.settings.data.units.folding.foldByDefault.toString()
    );
    container.setAttribute("tabindex", "0");
    return { container, content, originalParent };
  }
  async baseUnitProcessing(adapter, context, callbackBeforeUnitCreating) {
    context.adapter = adapter;
    this.plugin.logger.debug(`Processing unit for adapter: ${adapter}`, {
      unitType: context.options.name
    });
    const canContinue = this.initializationGuard(context);
    if (!canContinue) {
      this.plugin.logger.debug(
        `Initialization guard failed for adapter: ${adapter}`
      );
      return;
    }
    const size = this.getElSize(context);
    const { container, content, originalParent } = await this.createInteractiveElementWrapper(context);
    context.container = container;
    context.content = content;
    context.originalParent = originalParent;
    context.size = size;
    callbackBeforeUnitCreating(context);
    const fContext = this.finalizeContext(context);
    this.createUnit(fContext);
    this.plugin.logger.debug(
      `Adapter ${adapter} was processed successfully.`
    );
  }
}

class BaseMdViewAdapter extends BaseAdapter {
  constructor(plugin, fileStat) {
    super(plugin, fileStat);
    this.plugin = plugin;
    this.fileStat = fileStat;
  }
  *childListMutations(mutations) {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        yield mutation;
      }
    }
  }
  *interactiveElementContexts(addedNodes) {
    for (const addedNode of Array.from(addedNodes)) {
      if (!(addedNode instanceof Element)) {
        continue;
      }
      const interactive = addedNode.matches("svg,img") && addedNode || addedNode.querySelector("svg,img");
      if (!interactive) {
        continue;
      }
      if (this.isThisSvgIcon(interactive)) {
        continue;
      }
      const interactiveContext = this.matchInteractiveElement(interactive);
      if (interactiveContext === void 0) {
        continue;
      }
      yield interactiveContext;
    }
  }
}

class LivePreviewAdapter extends BaseMdViewAdapter {
  constructor(plugin, fileStats) {
    super(plugin, fileStats);
  }
  initialize = async (leafID, el, hasExistingObserver) => {
    if (!this.plugin.context.inLivePreviewMode) return;
    if (hasExistingObserver) {
      return;
    }
    this.setupMutationObserver(leafID, el);
    await this.processExistingElements(el);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await this.processExistingElements(el);
  };
  async processExistingElements(el) {
    const cmContent = el.querySelector(".cm-content");
    if (!cmContent) {
      return;
    }
    for (const child of Array.from(cmContent.children)) {
      if (!child.cmView) {
        continue;
      }
      const interactiveElement = child.matches("svg,img") ? child : child.querySelector("svg,img");
      if (!interactiveElement) {
        continue;
      }
      if (this.isThisSvgIcon(interactiveElement)) {
        continue;
      }
      const context = this.matchInteractiveElement(interactiveElement);
      if (context === void 0) {
        continue;
      }
      await this.processUnit({
        ...context,
        livePreviewWidget: child
      });
    }
  }
  setupMutationObserver(leafID, el) {
    const observer = new MutationObserver(async (mutations) => {
      this.plugin.logger.debug("Preview MutationObserver triggered", {
        mutationsCount: mutations.length
      });
      for (const mutation of this.childListMutations(mutations)) {
        for (const context of this.interactiveElementContexts(
          mutation.addedNodes
        )) {
          const elementWithCmView = this.findElementWithLivePreviewWidget(context.element);
          if (elementWithCmView === void 0) {
            continue;
          }
          await this.processUnit({
            ...context,
            livePreviewWidget: elementWithCmView
          });
        }
      }
    });
    this.plugin.state.setLivePreviewObserver(leafID, observer);
    observer.observe(el, { childList: true, subtree: true });
  }
  findElementWithLivePreviewWidget(el) {
    if (el === void 0) {
      return void 0;
    }
    let current = el;
    while (current && current !== document.body) {
      if (current?.cmView) {
        return current;
      }
      current = current?.parentElement;
    }
    return void 0;
  }
  getSource(parent) {
    const widget = parent?.cmView?.deco?.widget;
    const df = {
      source: "No source available",
      lineStart: 0,
      lineEnd: 0
    };
    if (widget === void 0) {
      return df;
    }
    if ("title" in widget && "href" in widget && "start" in widget && "end" in widget) {
      return {
        source: `![[${widget.href}]]`,
        lineStart: widget.start,
        lineEnd: widget.end
      };
    }
    if ("url" in widget && "start" in widget && "end" in widget) {
      return {
        source: `![${widget.title || ""}](${widget.url})`,
        lineStart: widget.start,
        lineEnd: widget.end
      };
    }
    if ("code" in widget && "lineStart" in widget && "lineEnd" in widget) {
      return {
        source: widget.code,
        lineStart: widget.lineStart,
        lineEnd: widget.lineEnd
      };
    }
    return df;
  }
  async processUnit(context) {
    await this.baseUnitProcessing(
      InteractifyAdapters.LivePreview,
      context,
      (ctx) => {
        const sourceData = this.getSource(ctx.livePreviewWidget);
        if (context.livePreviewWidget !== context.element) {
          context.livePreviewWidget.addClass("live-preview-parent");
        }
        context.sourceData = sourceData;
      }
    );
  }
}

class PreviewAdapter extends BaseMdViewAdapter {
  constructor(plugin, fileStats) {
    super(plugin, fileStats);
  }
  initialize = async (leafID, el, context) => {
    this.plugin.logger.debug("MarkdownPreviewAdapter initializing", {
      leafID
    });
    const contextData = {
      context,
      contextEl: el
    };
    await this.setupMutationObserver(leafID, el, contextData);
    await this.processExistingElements(leafID, el, contextData);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await this.processExistingElements(leafID, el, contextData);
  };
  async processExistingElements(leafID, el, contextData) {
    let interactiveElements = Array.from(
      contextData.contextEl.querySelectorAll("svg,img")
    );
    interactiveElements = interactiveElements.filter(
      (el2) => !this.isThisSvgIcon(el2)
    );
    if (interactiveElements.length > 0) {
      const interactiveElementsWithContext = interactiveElements.map(
        this.matchInteractiveElement.bind(this)
      );
      for (const interactiveElement of interactiveElementsWithContext) {
        if (interactiveElement === void 0) {
          continue;
        }
        await this.processUnit(interactiveElement, contextData);
      }
    }
  }
  async setupMutationObserver(leafID, el, contextData) {
    const observer = new MutationObserver(async (mutations) => {
      this.plugin.logger.debug("Preview MutationObserver triggered", {
        mutationsCount: mutations.length
      });
      if (!this.plugin._loaded) {
        observer.disconnect();
        return;
      }
      for (const mutation of this.childListMutations(mutations)) {
        for (const context of this.interactiveElementContexts(
          mutation.addedNodes
        )) {
          await this.processUnit(context, contextData);
        }
      }
    });
    observer.observe(el, {
      childList: true,
      subtree: true
    });
    setTimeout(() => {
      observer.disconnect();
      this.plugin.logger.debug(
        "Preview MutationObserver disconnected after timeout"
      );
    }, 5e3);
  }
  getSource(contextData) {
    const sectionsInfo = contextData.context.getSectionInfo(
      contextData.contextEl
    );
    if (!sectionsInfo) {
      return {
        source: "No source available",
        lineStart: 0,
        lineEnd: 0
      };
    }
    if (sectionsInfo.lineEnd === sectionsInfo.lineStart) {
      return {
        source: sectionsInfo.text,
        lineStart: sectionsInfo.lineStart,
        lineEnd: sectionsInfo.lineEnd
      };
    }
    const { lineStart: ls, lineEnd: le, text } = sectionsInfo;
    const lineStart = ls + 1;
    const lineEnd = le - 1;
    const lines = text.split("\n");
    const source = lines.slice(lineStart, lineEnd + 1).join("\n");
    return {
      source,
      lineStart,
      lineEnd
    };
  }
  async processUnit(context, contextData) {
    await this.baseUnitProcessing(
      InteractifyAdapters.Preview,
      context,
      (ctx) => {
        ctx.sourceData = this.getSource(contextData);
      }
    );
  }
}

class Logger {
  constructor(plugin) {
    this.plugin = plugin;
    this.storageKey = `${plugin.manifest.id}-logs`;
    this.checkStorageAvailability();
  }
  maxEntries = 2e3;
  storageKey;
  isStorageAvailable = true;
  logsDir;
  /**
   * Initializes the logger by writing system information if the debug setting is enabled.
   */
  async init() {
    await this.ensureLogsDirExists();
    this.plugin.settings.data.debug.enabled && await this.writeSystemInfo();
  }
  /**
   * Saves log content to a file in the plugin's log directory.
   *
   * This function ensures that the logs directory exists within the plugin directory,
   * creates it if necessary, and then writes the provided log content to a JSON file
   * named with the current timestamp. After saving the logs, it rotates old log files
   * to maintain a clean log directory.
   *
   * @param content The log content to save.
   * @throws An error if the plugin directory is not found or if there is an issue writing the logs.
   */
  async saveLogsToFile(content) {
    try {
      const now = obsidian.moment().format("YYYY-MM-DD HH:mm:ss");
      const filename = `logs-${now}.json`;
      const filepath = obsidian.normalizePath(`${this.logsDir}/${filename}`);
      await this.plugin.app.vault.adapter.write(filepath, content);
      await this.rotateLogFiles(this.logsDir);
    } catch (error) {
      console.error("Interactify: Error in the file:", error);
    }
  }
  async ensureLogsDirExists() {
    const pluginDir = this.plugin.manifest.dir;
    if (pluginDir === void 0) {
      throw new Error(
        `Interactify: It was not possible to get the way to the plugin. Path:${pluginDir}`
      );
    }
    this.logsDir = obsidian.normalizePath(`${pluginDir}/logs`);
    const exists = await this.plugin.app.vault.adapter.exists(this.logsDir);
    !exists && await this.plugin.app.vault.adapter.mkdir(this.logsDir);
  }
  /**
   * Rotates log files in the specified directory.
   * @param logsDir The directory in which log files are stored.
   * @returns A promise that resolves when the log files have been rotated.
   *
   * This function removes any log files that are older than 7 days.
   */
  async rotateLogFiles(logsDir) {
    try {
      const files = await this.plugin.app.vault.adapter.list(logsDir);
      const now = obsidian.moment().unix() * 1e3;
      const maxAge = 7 * 24 * 60 * 60 * 1e3;
      for (const file of files.files) {
        if (!file.endsWith(".json")) {
          continue;
        }
        const filePath = `${logsDir}/${file}`;
        const stat = await this.plugin.app.vault.adapter.stat(filePath);
        if (stat && now - stat.mtime > maxAge) {
          await this.plugin.app.vault.adapter.remove(filePath);
          console.log(`Interactify: Remove the old log-file${file}`);
        }
      }
    } catch (error) {
      console.error("Interactify: Log Rotation Error:", error);
    }
  }
  /**
   * Returns the version of Obsidian as a string, or 'unknown' if it cannot be determined.
   *
   * The version is extracted from the title of the current page, which is assumed to contain
   * the string "Obsidian vX.Y.Z" where X.Y.Z is the version number.
   * @returns The version of Obsidian as a string, or 'unknown' if it cannot be determined.
   */
  getObsidianVersion() {
    const title = document.title;
    const match = title.match(/Obsidian v([\d.]+)/);
    return match ? match[1] : "unknown";
  }
  async writeSystemInfo() {
    const systemInfo = this.getSystemInfo();
    this.addLogEntry(systemInfo);
  }
  getSystemInfo() {
    return {
      timestamp: obsidian.moment().toISOString(),
      session_start: true,
      obsidian: {
        version: this.getObsidianVersion(),
        title: document.title,
        enabledPlugins_count: this.plugin.app.plugins.enabledPlugins.size,
        enabledPlugins_list: Array.from(
          this.plugin.app.plugins.enabledPlugins
        ),
        vault_name: this.plugin.app.vault.getName(),
        is_mobile: obsidian.Platform.isMobile,
        is_desktop: obsidian.Platform.isDesktopApp
      },
      system: {
        platform: this.getPlatformInfo(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        online_status: navigator.onLine,
        cpu_cores: navigator.hardwareConcurrency || "unknown",
        device_memory: navigator.deviceMemory || "unknown",
        connection_type: navigator.connection?.effectiveType || "unknown"
      },
      plugin: {
        name: this.plugin.manifest.name,
        version: this.plugin.manifest.version,
        minAppVersion: this.plugin.manifest.minAppVersion,
        id: this.plugin.manifest.id,
        author: this.plugin.manifest.author,
        description: this.plugin.manifest.description
      },
      performance: {
        memory_used: performance.memory?.usedJSHeapSize || "unknown",
        memory_total: performance.memory?.totalJSHeapSize || "unknown",
        memory_limit: performance.memory?.jsHeapSizeLimit || "unknown",
        load_time: performance.now()
      },
      storage: {
        localStorage_usage: this.getStorageUsage()
      }
    };
  }
  getShortSystemInfo() {
    return {
      timestamp: obsidian.moment().toISOString(),
      obsidian: {
        version: this.getObsidianVersion(),
        vault_name: this.plugin.app.vault.getName(),
        is_mobile: obsidian.Platform.isMobile
      },
      system: {
        platform: this.getPlatformInfo(),
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      plugin: {
        name: this.plugin.manifest.name,
        version: this.plugin.manifest.version,
        id: this.plugin.manifest.id
      }
    };
  }
  /**
   * Get the platform information.
   *
   * This function uses the `userAgentData` API if available, otherwise it falls back to the
   * `navigator.platform` property. If both of them are not available, it returns 'unknown'.
   *
   * @returns {string} The platform name, or 'unknown' if it cannot be determined.
   */
  getPlatformInfo() {
    if ("userAgentData" in navigator) {
      const uaData = navigator.userAgentData;
      return uaData.platform ?? "unknown";
    }
    return navigator.platform ?? "unknown";
  }
  /**
   * Calculate the current usage of local storage by logs.
   *
   * This function retrieves the logs from local storage using the defined storage key
   * and calculates their memory usage in kilobytes. If no logs are found, it returns '0 B'.
   * In case of an error during retrieval, it returns 'unknown'.
   *
   * @returns {string} The size of the logs in local storage formatted as a string in KB,
   * or '0 B' if no logs are stored, or 'unknown' if an error occurs.
   */
  getStorageUsage() {
    try {
      const logs = localStorage.getItem(this.storageKey);
      if (!logs) {
        return "0 B";
      }
      const bytes = logs.length + this.storageKey.length;
      return `${(bytes / 1024).toFixed(2)} KB`;
    } catch {
      return "unknown";
    }
  }
  /**
   * Check if local storage is available.
   *
   * This function checks if local storage is available by attempting to set and remove an item.
   * If the operation fails, `isStorageAvailable` is set to `false` and a warning is logged.
   */
  checkStorageAvailability() {
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
    } catch {
      this.isStorageAvailable = false;
      console.warn("Interactify: Localstorage is not available");
    }
  }
  /**
   * Add a log entry to the log storage.
   *
   * If the log storage is not available, the log entry is discarded.
   *
   * @param {any} logEntry The log entry to add.
   */
  addLogEntry(logEntry) {
    if (!this.isStorageAvailable) {
      return;
    }
    try {
      const logs = this.getAllLogs();
      logs.push(logEntry);
      if (logs.length > this.maxEntries) {
        logs.splice(0, logs.length - this.maxEntries);
      }
      localStorage.setItem(this.storageKey, JSON.stringify(logs));
    } catch (error) {
      console.error("Logger: \u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u043F\u0438\u0441\u0438 \u0432 localStorage:", error);
      this.isStorageAvailable = false;
    }
  }
  /**
   * Returns all stored logs as an array of objects.
   *
   * The array is empty if no logs are available.
   *
   * @returns {any[]} An array of log objects, or an empty array if no logs are available.
   */
  getAllLogs() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }
  /**
   * Logs a message with the specified level.
   *
   * If the `debug.enabled` setting is `false`, the message is discarded.
   *
   * @param {string} level - The severity level of the message (e.g., 'debug', 'info', 'warn', 'error').
   * @param {string} message - The message to log.
   */
  log(level, message, context) {
    if (!this.plugin.settings.data.debug.enabled) {
      return;
    }
    const logEntry = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      level,
      message,
      context
    };
    this.addLogEntry(logEntry);
  }
  /**
   * Determines if a message should be logged based on its level.
   *
   * This function compares the provided message level with the current
   * logging level set in the plugin's settings. It returns `true` if
   * the message level is equal to or more severe than the current logging
   * level, allowing the message to be logged.
   *
   * @param messageLevel - The severity level of the message (e.g., 'debug', 'info', 'warn', 'error').
   * @returns `true` if the message should be logged, `false` otherwise.
   */
  shouldLog(messageLevel) {
    const levels = ["none", "debug", "info", "warn", "error"];
    const currentLevel = this.plugin.settings.data.debug.level;
    if (currentLevel === "none") {
      return false;
    }
    const messageLevelIndex = levels.indexOf(messageLevel.toLowerCase());
    const currentLevelIndex = levels.indexOf(currentLevel);
    return messageLevelIndex >= currentLevelIndex;
  }
  debug(message, context) {
    if (!this.shouldLog("debug")) {
      return;
    }
    this.log("DEBUG", message, context);
  }
  info(message, context) {
    if (!this.shouldLog("info")) {
      return;
    }
    this.log("INFO", message, context);
  }
  warn(message, context) {
    if (!this.shouldLog("warn")) {
      return;
    }
    this.log("WARNING", message, context);
  }
  error(message, context) {
    if (!this.shouldLog("error")) {
      return;
    }
    this.log("ERROR", message, context);
  }
  /**
   * Exports all stored logs as a formatted string.
   *
   * The exported string includes both system information logs
   * and regular logs. System information logs are identified
   * by the presence of a `session_start` property and are
   * displayed under the "=== SYSTEM INFO ===" section.
   * Regular logs are displayed under the "=== LOGS ===" section,
   * each prefixed by a timestamp and log level.
   *
   * @returns A formatted string containing system information
   * and regular logs. Returns an empty string if no logs are available.
   */
  exportLogs() {
    const logs = this.getAllLogs();
    if (logs.length === 0) {
      return "";
    }
    const systemInfo = logs.filter((log) => log.session_start);
    const regularLogs = logs.filter((log) => !log.session_start);
    let result = "=== SYSTEM INFO ===\n";
    systemInfo.forEach((info) => {
      result += JSON.stringify(info, null, 2) + "\n\n";
    });
    result += "\n=== LOGS ===\n";
    regularLogs.forEach((log) => {
      const date = new Date(log.timestamp);
      const time = date.toLocaleTimeString();
      const dateStr = date.toLocaleDateString();
      result += `[${dateStr} ${time}] ${log.level}: ${log.message} ${log.context ? `context: ${JSON.stringify(log.context, null, 2)}` : ""}
`;
      result += "\n";
    });
    return result;
  }
  /**
   * Clears all stored logs from local storage.
   *
   * This function removes the log entries associated with the
   * current storage key from the local storage. It effectively
   * deletes all logs that have been stored, resetting the log
   * storage to an empty state.
   */
  clearAllLogs() {
    localStorage.removeItem(this.storageKey);
  }
}

class PickerModeAdapter extends BaseAdapter {
  constructor(plugin, fileStats) {
    super(plugin, fileStats);
  }
  initialize = async (el) => {
    const ctx = this.matchInteractiveElement(el);
    if (ctx === void 0) {
      this.plugin.showNotice(
        "This type of content is unsupported. Please check the plugin settings.",
        5e3
      );
      return;
    }
    await this.processUnit(ctx);
  };
  async processUnit(context) {
    await this.baseUnitProcessing(
      InteractifyAdapters.PickerMode,
      context,
      (ctx) => {
        ctx.sourceData = this.getSource();
      }
    );
  }
  getSource() {
    return {
      source: "Picker mode: no source available",
      lineStart: 0,
      lineEnd: 0
    };
  }
}

class PickerMode extends obsidian.Component {
  constructor(plugin) {
    super();
    this.plugin = plugin;
    this.load();
    this.setupEvents();
    this.setupCommands();
    this.plugin.settings.data.units.interactivity.picker.enabled && this.createRibbon();
  }
  isActive = false;
  tooltip = null;
  currentElement = null;
  ribbonButton;
  pickerModeToggleHandler = (payload) => {
    if (!payload.newValue) {
      this.ribbonButton.removeEventListener("click", this.toggle);
      this.ribbonButton.remove();
    } else {
      this.createRibbon();
    }
  };
  setupEvents() {
    const events = this.plugin.settings.events;
    this.plugin.eventBus.on(
      events.units.interactivity.picker.enabled.$path,
      this.pickerModeToggleHandler
    );
  }
  setupCommands() {
    this.plugin.addCommand({
      id: "toggle-picker-mode",
      name: "Toggle picker mode",
      checkCallback: (checking) => {
        if (checking) {
          return this.plugin.settings.data.units.interactivity.picker.enabled;
        }
        if (!this.plugin.settings.data.units.interactivity.picker.enabled) {
          this.plugin.showNotice("Picker mode disabled");
          return;
        }
        this.toggle();
        return true;
      }
    });
  }
  createRibbon() {
    this.ribbonButton = this.plugin.addRibbonIcon(
      "mouse-pointer-click",
      "Picker mode",
      this.toggle
    );
  }
  toggle = (evt) => {
    if (this.isActive) {
      this.deactivate();
    } else {
      this.activate();
    }
  };
  createTooltip() {
    this.tooltip = document.createElement("div");
    this.tooltip.addClass("picker-mode-tooltip");
    document.body.appendChild(this.tooltip);
  }
  showTooltip(element) {
    if (!this.tooltip) return;
    const el = element.matches("svg,img") ? element : element.querySelector("svg,img");
    if (!el) return;
    const initializationStatus = el.getAttribute(
      "data-interactive-initialization-status"
    );
    const mode = el.getAttribute(
      "data-interactive-mode"
    );
    let text = "Make interactive";
    if (initializationStatus === InteractiveInitialization.NotInitialized) {
      text = "Cannot initialize this image. Consult for docs for more info";
    } else {
      const interactiveAction = mode === InteractiveMode.Interactive ? "Deactivate" : "Activate";
      text = `${interactiveAction} interactive mode`;
    }
    this.tooltip.textContent = text;
    this.tooltip.style.opacity = "1";
  }
  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.style.opacity = "0";
    }
    this.currentElement = null;
  }
  activate() {
    this.isActive = true;
    document.body.addClass("picker-mode");
    this.createTooltip();
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseover", this.onMouseOver);
    document.addEventListener("mouseout", this.onMouseOut);
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("mousedown", this.onMouseDown, true);
    document.querySelectorAll("svg, img").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width >= 64 && rect.height >= 64) {
        el.addClass("interactive-candidate");
      }
    });
    this.plugin.showNotice(
      `Picker mode enabled
Click on image to toggle interactive mode
Press Esc to exit`,
      1e4
    );
  }
  deactivate() {
    if (!this.isActive) return;
    this.isActive = false;
    document.body.removeClass("picker-mode");
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseover", this.onMouseOver);
    document.removeEventListener("mouseout", this.onMouseOut);
    document.removeEventListener("mousedown", this.onMouseDown, true);
    document.querySelectorAll("svg, img").forEach((el) => {
      el.removeClass("interactive-candidate");
    });
    this.tooltip?.remove();
    this.tooltip = null;
    this.currentElement = null;
    this.plugin.showNotice("Picker mode disabled");
  }
  onMouseMove = (e) => {
    if (!this.tooltip) return;
    this.tooltip.style.left = `${e.clientX + 12}px`;
    this.tooltip.style.top = `${e.clientY - 32}px`;
  };
  onMouseOver = (e) => {
    const target = e.target;
    const element = target.closest(".cm-preview-code-block") || target.closest("svg,img,.interactify-container");
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const isValidCandidate = rect.width >= 64 && rect.height >= 64;
    if (!isValidCandidate) {
      this.hideTooltip();
      return;
    }
    this.currentElement = element;
    this.showTooltip(element);
  };
  onMouseOut = (e) => {
    const target = e.target;
    const element = target.closest(".cm-preview-code-block") || target.closest("svg,img,.interactify-container");
    if (element === this.currentElement) {
      this.hideTooltip();
    }
  };
  onKeyDown = (e) => {
    if (e.key === "Escape" && this.isActive) {
      this.deactivate();
    }
  };
  onMouseDown = async (event) => {
    if (!(event.target instanceof Element)) return;
    event.stopPropagation();
    event.preventDefault();
    let element = event.target.closest(".cm-preview-code-block") || event.target.closest("svg,img,.interactify-container");
    if (!element) {
      this.deactivate();
      return;
    }
    element = element?.matches("svg,img") ? element : element?.querySelector("svg,img");
    const interactive = element;
    const wasAlreadyInitialized = interactive.dataset.interactiveInitializationStatus === InteractiveInitialization.Initialized;
    if (wasAlreadyInitialized) {
      this.plugin.eventBus.emit("toggle-element", { element });
      this.showTooltip(interactive);
      return;
    }
    const adapter = new PickerModeAdapter(this.plugin, {
      ctime: 0,
      mtime: 0,
      size: 0
    });
    await adapter.initialize(interactive);
    this.showTooltip(interactive);
  };
  onunload() {
    this.deactivate();
    super.onunload();
    this.plugin.eventBus.on(
      this.plugin.settings.events.units.interactivity.picker.enabled.$path,
      this.pickerModeToggleHandler
    );
  }
}

function createEventsWrapper(obj, path = []) {
  return new Proxy(obj, {
    get(target, key) {
      if (key === "$path") {
        return `settings.${path.join(".")}`;
      }
      const basePath = path.length > 0 ? `settings.${path.join(".")}` : "settings";
      if (key === "$all" || key === "$deep") {
        return `${basePath}.**`;
      }
      if (key === "$children") {
        return createEventsWrapper(obj, [...path, key]);
      }
      const value = target[key];
      if (typeof value !== "object" || value === null) {
        const pathStr = `settings.${[...path, key].join(".")}`;
        return {
          $path: pathStr,
          $all: `${pathStr}.**`,
          $deep: `${pathStr}.**`,
          $children: `${pathStr}.*`,
          toString: () => pathStr,
          valueOf: () => pathStr
        };
      }
      return createEventsWrapper(value, [...path, key]);
    }
  });
}

function createSettingsProxy(plugin, obj, path = []) {
  return new Proxy(obj, {
    get(target, key) {
      const value = target[key];
      if (typeof value === "object" && value !== null) {
        return createSettingsProxy(plugin, value, [...path, key]);
      }
      return value;
    },
    set(target, prop, value) {
      const oldValue = target[prop];
      target[prop] = value;
      const fullPath = [...path, prop].join(".");
      plugin.settings.eventBus?.emit(`settings.${fullPath}`, {
        eventName: `settings.${fullPath}`,
        oldValue,
        newValue: value
      });
      return true;
    },
    deleteProperty(target, prop) {
      const oldValue = target[prop];
      const existed = prop in target;
      delete target[prop];
      if (existed) {
        const fullPath = [...path, prop].join(".");
        plugin.settings.eventBus?.emit(`settings.${fullPath}`, {
          eventName: `settings.${fullPath}`,
          operation: "delete",
          oldValue,
          newValue: void 0
        });
      }
      return true;
    }
  });
}

class MigrateFrom_5_2_0_To_5_3_0 {
  constructor(settingsManager) {
    this.settingsManager = settingsManager;
  }
  MAP = {
    diagramsPerPage: "diagrams.settingsPagination.perPage",
    foldByDefault: "diagrams.folding.foldByDefault",
    automaticFoldingOnFocusChange: "diagrams.folding.autoFoldOnFocusChange",
    supported_diagrams: "diagrams.supported_diagrams",
    hideOnMouseOutDiagram: {
      target: "panels.global.triggering.mode",
      transform: (value) => value ? PanelsTriggering.HOVER : PanelsTriggering.ALWAYS
    },
    addHidingButton: "panels.local.panels.service.buttons.hide",
    "panelsConfig.service.enabled": "panels.local.panels.service.on",
    "panelsConfig.move.enabled": "panels.local.panels.move.on",
    "panelsConfig.zoom.enabled": "panels.local.panels.zoom.on",
    diagramExpanded: {
      target: "diagrams.size.expanded",
      transform: (input) => this.migrateDimensionSetting(input)
    },
    diagramFolded: {
      target: "diagrams.size.folded",
      transform: (input) => this.migrateDimensionSetting(input)
    }
  };
  apply(oldSettings) {
    const newSettings = JSON.parse(
      JSON.stringify(this.settingsManager.defaultSettings)
    );
    for (const [oldPath, mapping] of Object.entries(this.MAP)) {
      const oldValue = this.getNestedValue(oldSettings, oldPath);
      if (oldValue === void 0) {
        continue;
      }
      if (typeof mapping === "string") {
        this.setNestedValue(newSettings, mapping, oldValue);
      } else {
        const transformed = mapping.transform(oldValue);
        this.setNestedValue(newSettings, mapping.target, transformed);
      }
    }
    const oldPanelsConfig = oldSettings.panelsConfig;
    if (oldPanelsConfig) {
      if (oldPanelsConfig.service?.position) {
        newSettings.panels.local.panels.service.position = oldPanelsConfig.service.position;
      }
      if (oldPanelsConfig.move?.position) {
        newSettings.panels.local.panels.move.position = oldPanelsConfig.move.position;
      }
      if (oldPanelsConfig.zoom?.position) {
        newSettings.panels.local.panels.zoom.position = oldPanelsConfig.zoom.position;
      }
    }
    return newSettings;
  }
  migrateDimensionSetting(input) {
    return {
      width: {
        value: parseInt(input?.width, 10) || 100,
        unit: input?.widthUnit || "px"
      },
      height: {
        value: parseInt(input?.height, 10) || 100,
        unit: input?.heightUnit || "px"
      }
    };
  }
  getNestedValue(obj, path) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  }
  setNestedValue(obj, path, value) {
    const keys = path.split(".");
    const last = keys.pop();
    const target = keys.reduce((acc, key) => {
      if (!acc[key]) {
        acc[key] = {};
      }
      return acc[key];
    }, obj);
    target[last] = value;
  }
}

class SettingsMigration {
  constructor(settingsManager) {
    this.settingsManager = settingsManager;
  }
  CURRENT_VERSION = "5.3.0";
  migrate(oldSettings) {
    try {
      if (oldSettings?.version === this.CURRENT_VERSION) {
        return {
          success: true,
          version: this.CURRENT_VERSION,
          data: oldSettings
        };
      }
      let migrated;
      const sourceVersion = oldSettings?.version ?? "unknown";
      if (!oldSettings?.version || oldSettings.version === "5.2.0") {
        const migrator = new MigrateFrom_5_2_0_To_5_3_0(
          this.settingsManager
        );
        migrated = migrator.apply(oldSettings);
      } else {
        this.settingsManager.plugin.logger.warn(
          `Unknown settings version: ${sourceVersion}, using defaults`
        );
        migrated = this.settingsManager.defaultSettings;
      }
      return {
        success: true,
        version: this.CURRENT_VERSION,
        data: migrated
      };
    } catch (e) {
      return {
        success: false,
        version: this.CURRENT_VERSION,
        errors: [
          `Migration from ${oldSettings?.version ?? "unknown"} failed: ${e.message}`
        ]
      };
    }
  }
}

class SettingsManager {
  constructor(plugin) {
    this.plugin = plugin;
    this.eventBus = new EventEmitter2({
      wildcard: true,
      delimiter: "."
    });
    this.migration = new SettingsMigration(this);
  }
  eventBus;
  migration;
  events;
  data;
  get defaultSettings() {
    return {
      version: "5.3.0",
      units: {
        interactivity: {
          markdown: {
            autoDetect: true,
            activationMode: ActivationMode.Immediate
          },
          picker: {
            enabled: false
          }
        },
        folding: {
          foldByDefault: false,
          autoFoldOnFocusChange: false
        },
        settingsPagination: {
          perPage: 5
        },
        size: {
          expanded: {
            width: {
              value: 100,
              unit: "%"
            },
            height: {
              value: 100,
              unit: "%"
            }
          },
          folded: {
            width: {
              value: 50,
              unit: "%"
            },
            height: {
              value: 50,
              unit: "%"
            }
          }
        },
        configs: Object.entries(UnitConfigs).map(([key, value]) => ({
          name: key,
          selector: value,
          on: value !== UnitConfigs.IMG_SVG,
          panels: {
            move: {
              on: true
            },
            zoom: {
              on: true
            },
            service: {
              on: true
            }
          }
        }))
      },
      panels: {
        global: {
          triggering: {
            mode: PanelsTriggering.ALWAYS,
            ignoreService: true
          }
        },
        local: {
          preset: "",
          panels: {
            service: {
              on: true,
              buttons: {
                hide: true,
                fullscreen: true
              },
              position: {
                top: "0px",
                right: "0px"
              }
            },
            move: {
              on: true,
              buttons: {
                up: true,
                down: true,
                left: true,
                right: true,
                upLeft: true,
                upRight: true,
                downLeft: true,
                downRight: true
              },
              position: {
                bottom: "0px",
                right: "0px"
              }
            },
            zoom: {
              on: true,
              buttons: {
                in: true,
                out: true,
                reset: true
              },
              position: {
                top: "50%",
                right: "0px"
              }
            }
          }
        }
      },
      debug: {
        enabled: false,
        level: DebugLevel.None
      }
    };
  }
  async loadSettings() {
    const userSettings = await this.plugin.loadData() ?? this.defaultSettings;
    const migrationResult = this.migration.migrate(userSettings);
    let settings;
    let needsSave = false;
    if (!migrationResult.success) {
      console.error(
        `Interactify: Error loading settings: ${JSON.stringify(migrationResult.errors)}. Resetting to defaults...`
      );
      settings = this.defaultSettings;
      needsSave = true;
    } else if (!migrationResult.data) {
      console.error(
        "Migration succeeded but data is empty. Using defaults..."
      );
      settings = this.defaultSettings;
      needsSave = true;
    } else {
      settings = migrationResult.data;
      needsSave = userSettings?.version !== this.migration.CURRENT_VERSION;
    }
    this.data = createSettingsProxy(this.plugin, { ...settings });
    this.events = createEventsWrapper(settings);
    if (needsSave) {
      await this.saveSettings();
    }
  }
  async saveSettings() {
    const saveData = {
      ...this.data
    };
    await this.plugin.saveData(saveData);
  }
  async resetSettings() {
    const pluginPath = this.plugin.manifest.dir;
    if (!pluginPath) {
      throw new Error("Interactify: `No plugin dir found`");
    }
    const configPath = obsidian.normalizePath(`${pluginPath}/data.json`);
    const existsPath = await this.plugin.app.vault.adapter.exists(configPath);
    existsPath && await this.plugin.app.vault.adapter.remove(configPath);
    await this.loadSettings();
  }
}

const SettingsContext = K$2(
  void 0
);
const SettingProvider = ({
  app,
  plugin,
  children
}) => {
  const [reloadCount, setReloadCount] = d(0);
  const [currentPath, setCurrentPath] = d("/units");
  const forceReload = q$2(() => {
    setReloadCount((prev) => prev + 1);
  }, []);
  const contextValue = T$2(
    () => ({
      app,
      plugin,
      forceReload,
      reloadCount,
      currentPath,
      setCurrentPath
    }),
    [app, plugin, forceReload, reloadCount, currentPath, setCurrentPath]
  );
  return /* @__PURE__ */ u$1(SettingsContext.Provider, { value: contextValue, children });
};
const useSettingsContext = () => {
  const context = x$2(SettingsContext);
  if (context === void 0) {
    throw new Error(
      "useSettingsContext must be used within a SettingProvider"
    );
  }
  return context;
};

var dist = {};

var hasRequiredDist;
function requireDist() {
  if (hasRequiredDist) return dist;
  hasRequiredDist = 1;
  Object.defineProperty(dist, "__esModule", { value: true });
  dist.parse = parse;
  dist.serialize = serialize;
  const cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
  const cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
  const domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
  const pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
  const __toString = Object.prototype.toString;
  const NullObject = /* @__PURE__ */ (() => {
    const C = function() {
    };
    C.prototype = /* @__PURE__ */ Object.create(null);
    return C;
  })();
  function parse(str, options) {
    const obj = new NullObject();
    const len = str.length;
    if (len < 2)
      return obj;
    const dec = options?.decode || decode;
    let index = 0;
    do {
      const eqIdx = str.indexOf("=", index);
      if (eqIdx === -1)
        break;
      const colonIdx = str.indexOf(";", index);
      const endIdx = colonIdx === -1 ? len : colonIdx;
      if (eqIdx > endIdx) {
        index = str.lastIndexOf(";", eqIdx - 1) + 1;
        continue;
      }
      const keyStartIdx = startIndex(str, index, eqIdx);
      const keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
      const key = str.slice(keyStartIdx, keyEndIdx);
      if (obj[key] === void 0) {
        let valStartIdx = startIndex(str, eqIdx + 1, endIdx);
        let valEndIdx = endIndex(str, endIdx, valStartIdx);
        const value = dec(str.slice(valStartIdx, valEndIdx));
        obj[key] = value;
      }
      index = endIdx + 1;
    } while (index < len);
    return obj;
  }
  function startIndex(str, index, max) {
    do {
      const code = str.charCodeAt(index);
      if (code !== 32 && code !== 9)
        return index;
    } while (++index < max);
    return max;
  }
  function endIndex(str, index, min) {
    while (index > min) {
      const code = str.charCodeAt(--index);
      if (code !== 32 && code !== 9)
        return index + 1;
    }
    return min;
  }
  function serialize(name, val, options) {
    const enc = options?.encode || encodeURIComponent;
    if (!cookieNameRegExp.test(name)) {
      throw new TypeError(`argument name is invalid: ${name}`);
    }
    const value = enc(val);
    if (!cookieValueRegExp.test(value)) {
      throw new TypeError(`argument val is invalid: ${val}`);
    }
    let str = name + "=" + value;
    if (!options)
      return str;
    if (options.maxAge !== void 0) {
      if (!Number.isInteger(options.maxAge)) {
        throw new TypeError(`option maxAge is invalid: ${options.maxAge}`);
      }
      str += "; Max-Age=" + options.maxAge;
    }
    if (options.domain) {
      if (!domainValueRegExp.test(options.domain)) {
        throw new TypeError(`option domain is invalid: ${options.domain}`);
      }
      str += "; Domain=" + options.domain;
    }
    if (options.path) {
      if (!pathValueRegExp.test(options.path)) {
        throw new TypeError(`option path is invalid: ${options.path}`);
      }
      str += "; Path=" + options.path;
    }
    if (options.expires) {
      if (!isDate(options.expires) || !Number.isFinite(options.expires.valueOf())) {
        throw new TypeError(`option expires is invalid: ${options.expires}`);
      }
      str += "; Expires=" + options.expires.toUTCString();
    }
    if (options.httpOnly) {
      str += "; HttpOnly";
    }
    if (options.secure) {
      str += "; Secure";
    }
    if (options.partitioned) {
      str += "; Partitioned";
    }
    if (options.priority) {
      const priority = typeof options.priority === "string" ? options.priority.toLowerCase() : void 0;
      switch (priority) {
        case "low":
          str += "; Priority=Low";
          break;
        case "medium":
          str += "; Priority=Medium";
          break;
        case "high":
          str += "; Priority=High";
          break;
        default:
          throw new TypeError(`option priority is invalid: ${options.priority}`);
      }
    }
    if (options.sameSite) {
      const sameSite = typeof options.sameSite === "string" ? options.sameSite.toLowerCase() : options.sameSite;
      switch (sameSite) {
        case true:
        case "strict":
          str += "; SameSite=Strict";
          break;
        case "lax":
          str += "; SameSite=Lax";
          break;
        case "none":
          str += "; SameSite=None";
          break;
        default:
          throw new TypeError(`option sameSite is invalid: ${options.sameSite}`);
      }
    }
    return str;
  }
  function decode(str) {
    if (str.indexOf("%") === -1)
      return str;
    try {
      return decodeURIComponent(str);
    } catch (e) {
      return str;
    }
  }
  function isDate(val) {
    return __toString.call(val) === "[object Date]";
  }
  return dist;
}

requireDist();

/**
 * react-router v7.6.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function createMemoryHistory(options = {}) {
  let { initialEntries = ["/"], initialIndex, v5Compat = false } = options;
  let entries;
  entries = initialEntries.map(
    (entry, index2) => createMemoryLocation(
      entry,
      typeof entry === "string" ? null : entry.state,
      index2 === 0 ? "default" : void 0
    )
  );
  let index = clampIndex(
    initialIndex == null ? entries.length - 1 : initialIndex
  );
  let action = "POP" /* Pop */;
  let listener = null;
  function clampIndex(n) {
    return Math.min(Math.max(n, 0), entries.length - 1);
  }
  function getCurrentLocation() {
    return entries[index];
  }
  function createMemoryLocation(to, state = null, key) {
    let location = createLocation(
      entries ? getCurrentLocation().pathname : "/",
      to,
      state,
      key
    );
    warning(
      location.pathname.charAt(0) === "/",
      `relative pathnames are not supported in memory history: ${JSON.stringify(
        to
      )}`
    );
    return location;
  }
  function createHref2(to) {
    return typeof to === "string" ? to : createPath(to);
  }
  let history = {
    get index() {
      return index;
    },
    get action() {
      return action;
    },
    get location() {
      return getCurrentLocation();
    },
    createHref: createHref2,
    createURL(to) {
      return new URL(createHref2(to), "http://localhost");
    },
    encodeLocation(to) {
      let path = typeof to === "string" ? parsePath(to) : to;
      return {
        pathname: path.pathname || "",
        search: path.search || "",
        hash: path.hash || ""
      };
    },
    push(to, state) {
      action = "PUSH" /* Push */;
      let nextLocation = createMemoryLocation(to, state);
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      if (v5Compat && listener) {
        listener({ action, location: nextLocation, delta: 1 });
      }
    },
    replace(to, state) {
      action = "REPLACE" /* Replace */;
      let nextLocation = createMemoryLocation(to, state);
      entries[index] = nextLocation;
      if (v5Compat && listener) {
        listener({ action, location: nextLocation, delta: 0 });
      }
    },
    go(delta) {
      action = "POP" /* Pop */;
      let nextIndex = clampIndex(index + delta);
      let nextLocation = entries[nextIndex];
      index = nextIndex;
      if (listener) {
        listener({ action, location: nextLocation, delta });
      }
    },
    listen(fn) {
      listener = fn;
      return () => {
        listener = null;
      };
    }
  };
  return history;
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined") console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
function createKey() {
  return Math.random().toString(36).substring(2, 10);
}
function createLocation(current, to, state = null, key) {
  let location = {
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: "",
    ...typeof to === "string" ? parsePath(to) : to,
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  };
  return location;
}
function createPath({
  pathname = "/",
  search = "",
  hash = ""
}) {
  if (search && search !== "?")
    pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#")
    pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substring(hashIndex);
      path = path.substring(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substring(searchIndex);
      path = path.substring(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function matchRoutes(routes, locationArg, basename = "/") {
  return matchRoutesImpl(routes, locationArg, basename, false);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    let decoded = decodePath(pathname);
    matches = matchRouteBranch(
      branches[i],
      decoded,
      allowPartial
    );
  }
  return matches;
}
function flattenRoutes(routes, branches = [], parentsMeta = [], parentPath = "") {
  let flattenRoute = (route, index, relativePath) => {
    let meta = {
      relativePath: relativePath === void 0 ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(
        meta.relativePath.startsWith(parentPath),
        `Absolute route path "${meta.relativePath}" nested under path "${parentPath}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      );
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant(
        // Our types know better, but runtime JS may not!
        // @ts-expect-error
        route.index !== true,
        `Index routes must not have child routes. Please remove all child routes from route path "${path}".`
      );
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    if (route.path === "" || !route.path?.includes("?")) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(
    ...restExploded.map(
      (subpath) => subpath === "" ? required : [required, subpath].join("/")
    )
  );
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map(
    (exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded
  );
}
function rankRouteBranches(branches) {
  branches.sort(
    (a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(
      a.routesMeta.map((meta) => meta.childrenIndex),
      b.routesMeta.map((meta) => meta.childrenIndex)
    )
  );
}
var paramRe = /^:[\w-]+$/;
var dynamicSegmentValue = 3;
var indexRouteValue = 2;
var emptySegmentValue = 1;
var staticSegmentValue = 10;
var splatPenalty = -2;
var isSplat = (s) => s === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s) => !isSplat(s)).reduce(
    (score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue),
    initialScore
  );
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return siblings ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a[a.length - 1] - b[b.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function matchRouteBranch(branch, pathname, allowPartial = false) {
  let { routesMeta } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath(
      { path: meta.relativePath, caseSensitive: meta.caseSensitive, end },
      remainingPathname
    );
    let route = meta.route;
    if (!match && end && allowPartial && !routesMeta[routesMeta.length - 1].route.index) {
      match = matchPath(
        {
          path: meta.relativePath,
          caseSensitive: meta.caseSensitive,
          end: false
        },
        remainingPathname
      );
    }
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(
        joinPaths([matchedPathname, match.pathnameBase])
      ),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = { path: pattern, caseSensitive: false, end: true };
  }
  let [matcher, compiledParams] = compilePath(
    pattern.path,
    pattern.caseSensitive,
    pattern.end
  );
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce(
    (memo2, { paramName, isOptional }, index) => {
      if (paramName === "*") {
        let splatValue = captureGroups[index] || "";
        pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
      }
      const value = captureGroups[index];
      if (isOptional && !value) {
        memo2[paramName] = void 0;
      } else {
        memo2[paramName] = (value || "").replace(/%2F/g, "/");
      }
      return memo2;
    },
    {}
  );
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive = false, end = true) {
  warning(
    path === "*" || !path.endsWith("*") || path.endsWith("/*"),
    `Route path "${path}" will be treated as if it were "${path.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${path.replace(/\*$/, "/*")}".`
  );
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (_, paramName, isOptional) => {
      params.push({ paramName, isOptional: isOptional != null });
      return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
    }
  );
  if (path.endsWith("*")) {
    params.push({ paramName: "*" });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else ;
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map((v) => decodeURIComponent(v).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(
      false,
      `The URL path "${value}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${error}).`
    );
    return value;
  }
}
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
function resolvePath(to, fromPathname = "/") {
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname = toPathname ? toPathname.startsWith("/") ? toPathname : resolvePathname(toPathname, fromPathname) : fromPathname;
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return `Cannot include a '${char}' character in a manually specified \`to.${field}\` field [${JSON.stringify(
    path
  )}].  Please separate it out to the \`to.${dest}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function getPathContributingMatches(matches) {
  return matches.filter(
    (match, index) => index === 0 || match.route.path && match.route.path.length > 0
  );
}
function getResolveToMatches(matches) {
  let pathMatches = getPathContributingMatches(matches);
  return pathMatches.map(
    (match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase
  );
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative = false) {
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = { ...toArg };
    invariant(
      !to.pathname || !to.pathname.includes("?"),
      getInvalidPathError("?", "pathname", "search", to)
    );
    invariant(
      !to.pathname || !to.pathname.includes("#"),
      getInvalidPathError("#", "pathname", "hash", to)
    );
    invariant(
      !to.search || !to.search.includes("#"),
      getInvalidPathError("#", "search", "hash", to)
    );
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
var joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
var normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
var normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
var normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}

// lib/router/router.ts
var validMutationMethodsArr = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
new Set(
  validMutationMethodsArr
);
var validRequestMethodsArr = [
  "GET",
  ...validMutationMethodsArr
];
new Set(validRequestMethodsArr);
var DataRouterContext = K$2(null);
DataRouterContext.displayName = "DataRouter";
var DataRouterStateContext = K$2(null);
DataRouterStateContext.displayName = "DataRouterState";
var ViewTransitionContext = K$2({
  isTransitioning: false
});
ViewTransitionContext.displayName = "ViewTransition";
var FetchersContext = K$2(
  /* @__PURE__ */ new Map()
);
FetchersContext.displayName = "Fetchers";
var AwaitContext = K$2(null);
AwaitContext.displayName = "Await";
var NavigationContext = K$2(
  null
);
NavigationContext.displayName = "Navigation";
var LocationContext = K$2(
  null
);
LocationContext.displayName = "Location";
var RouteContext = K$2({
  outlet: null,
  matches: [],
  isDataRoute: false
});
RouteContext.displayName = "Route";
var RouteErrorContext = K$2(null);
RouteErrorContext.displayName = "RouteError";
function useHref(to, { relative } = {}) {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useHref() may be used only in the context of a <Router> component.`
  );
  let { basename, navigator } = x$2(NavigationContext);
  let { hash, pathname, search } = useResolvedPath(to, { relative });
  let joinedPathname = pathname;
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator.createHref({ pathname: joinedPathname, search, hash });
}
function useInRouterContext() {
  return x$2(LocationContext) != null;
}
function useLocation() {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useLocation() may be used only in the context of a <Router> component.`
  );
  return x$2(LocationContext).location;
}
var navigateEffectWarning = `You should call navigate() in a React.useEffect(), not when your component is first rendered.`;
function useIsomorphicLayoutEffect(cb) {
  let isStatic = x$2(NavigationContext).static;
  if (!isStatic) {
    _$1(cb);
  }
}
function useNavigate() {
  let { isDataRoute } = x$2(RouteContext);
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useNavigate() may be used only in the context of a <Router> component.`
  );
  let dataRouterContext = x$2(DataRouterContext);
  let { basename, navigator } = x$2(NavigationContext);
  let { matches } = x$2(RouteContext);
  let { pathname: locationPathname } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches));
  let activeRef = A$2(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = q$2(
    (to, options = {}) => {
      warning(activeRef.current, navigateEffectWarning);
      if (!activeRef.current) return;
      if (typeof to === "number") {
        navigator.go(to);
        return;
      }
      let path = resolveTo(
        to,
        JSON.parse(routePathnamesJson),
        locationPathname,
        options.relative === "path"
      );
      if (dataRouterContext == null && basename !== "/") {
        path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
      }
      (!!options.replace ? navigator.replace : navigator.push)(
        path,
        options.state,
        options
      );
    },
    [
      basename,
      navigator,
      routePathnamesJson,
      locationPathname,
      dataRouterContext
    ]
  );
  return navigate;
}
K$2(null);
function useResolvedPath(to, { relative } = {}) {
  let { matches } = x$2(RouteContext);
  let { pathname: locationPathname } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches));
  return T$2(
    () => resolveTo(
      to,
      JSON.parse(routePathnamesJson),
      locationPathname,
      relative === "path"
    ),
    [to, routePathnamesJson, locationPathname, relative]
  );
}
function useRoutes(routes, locationArg) {
  return useRoutesImpl(routes, locationArg);
}
function useRoutesImpl(routes, locationArg, dataRouterState, future) {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useRoutes() may be used only in the context of a <Router> component.`
  );
  let { navigator } = x$2(NavigationContext);
  let { matches: parentMatches } = x$2(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  let parentPathname = routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  let parentRoute = routeMatch && routeMatch.route;
  {
    let parentPath = parentRoute && parentRoute.path || "";
    warningOnce(
      parentPathname,
      !parentRoute || parentPath.endsWith("*") || parentPath.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${parentPathname}" (under <Route path="${parentPath}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${parentPath}"> to <Route path="${parentPath === "/" ? "*" : `${parentPath}/*`}">.`
    );
  }
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    invariant(
      parentPathnameBase === "/" || parsedLocationArg.pathname?.startsWith(parentPathnameBase),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${parentPathnameBase}" but pathname "${parsedLocationArg.pathname}" was given in the \`location\` prop.`
    );
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = matchRoutes(routes, { pathname: remainingPathname });
  {
    warning(
      parentRoute || matches != null,
      `No routes matched location "${location.pathname}${location.search}${location.hash}" `
    );
    warning(
      matches == null || matches[matches.length - 1].route.element !== void 0 || matches[matches.length - 1].route.Component !== void 0 || matches[matches.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${location.pathname}${location.search}${location.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
    );
  }
  let renderedMatches = _renderMatches(
    matches && matches.map(
      (match) => Object.assign({}, match, {
        params: Object.assign({}, parentParams, match.params),
        pathname: joinPaths([
          parentPathnameBase,
          // Re-encode pathnames that were decoded inside matchRoutes
          navigator.encodeLocation ? navigator.encodeLocation(match.pathname).pathname : match.pathname
        ]),
        pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
          parentPathnameBase,
          // Re-encode pathnames that were decoded inside matchRoutes
          navigator.encodeLocation ? navigator.encodeLocation(match.pathnameBase).pathname : match.pathnameBase
        ])
      })
    ),
    parentMatches,
    dataRouterState,
    future
  );
  if (locationArg && renderedMatches) {
    return /* @__PURE__ */ _$2(
      LocationContext.Provider,
      {
        value: {
          location: {
            pathname: "/",
            search: "",
            hash: "",
            state: null,
            key: "default",
            ...location
          },
          navigationType: "POP" /* Pop */
        }
      },
      renderedMatches
    );
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = { padding: "0.5rem", backgroundColor: lightgrey };
  let codeStyles = { padding: "2px 4px", backgroundColor: lightgrey };
  let devInfo = null;
  {
    console.error(
      "Error handled by React Router default ErrorBoundary:",
      error
    );
    devInfo = /* @__PURE__ */ _$2(k$3, null, /* @__PURE__ */ _$2("p", null, "\u{1F4BF} Hey developer \u{1F44B}"), /* @__PURE__ */ _$2("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ _$2("code", { style: codeStyles }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ _$2("code", { style: codeStyles }, "errorElement"), " prop on your route."));
  }
  return /* @__PURE__ */ _$2(k$3, null, /* @__PURE__ */ _$2("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ _$2("h3", { style: { fontStyle: "italic" } }, message), stack ? /* @__PURE__ */ _$2("pre", { style: preStyles }, stack) : null, devInfo);
}
var defaultErrorElement = /* @__PURE__ */ _$2(DefaultErrorComponent, null);
var RenderErrorBoundary = class extends x$3 {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }
    return {
      error: props.error !== void 0 ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error(
      "React Router caught the following error during render",
      error,
      errorInfo
    );
  }
  render() {
    return this.state.error !== void 0 ? /* @__PURE__ */ _$2(RouteContext.Provider, { value: this.props.routeContext }, /* @__PURE__ */ _$2(
      RouteErrorContext.Provider,
      {
        value: this.state.error,
        children: this.props.component
      }
    )) : this.props.children;
  }
};
function RenderedRoute({ routeContext, match, children }) {
  let dataRouterContext = x$2(DataRouterContext);
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /* @__PURE__ */ _$2(RouteContext.Provider, { value: routeContext }, children);
}
function _renderMatches(matches, parentMatches = [], dataRouterState = null, future = null) {
  if (matches == null) {
    if (!dataRouterState) {
      return null;
    }
    if (dataRouterState.errors) {
      matches = dataRouterState.matches;
    } else if (parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;
  let errors = dataRouterState?.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex(
      (m) => m.route.id && errors?.[m.route.id] !== void 0
    );
    invariant(
      errorIndex >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        errors
      ).join(",")}`
    );
    renderedMatches = renderedMatches.slice(
      0,
      Math.min(renderedMatches.length, errorIndex + 1)
    );
  }
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState) {
    for (let i = 0; i < renderedMatches.length; i++) {
      let match = renderedMatches[i];
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i;
      }
      if (match.route.id) {
        let { loaderData, errors: errors2 } = dataRouterState;
        let needsToRunLoader = match.route.loader && !loaderData.hasOwnProperty(match.route.id) && (!errors2 || errors2[match.route.id] === void 0);
        if (match.route.lazy || needsToRunLoader) {
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  return renderedMatches.reduceRight((outlet, match, index) => {
    let error;
    let shouldRenderHydrateFallback = false;
    let errorElement = null;
    let hydrateFallbackElement = null;
    if (dataRouterState) {
      error = errors && match.route.id ? errors[match.route.id] : void 0;
      errorElement = match.route.errorElement || defaultErrorElement;
      if (renderFallback) {
        if (fallbackIndex < 0 && index === 0) {
          warningOnce(
            "route-fallback",
            false,
            "No `HydrateFallback` element provided to render during initial hydration"
          );
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = null;
        } else if (fallbackIndex === index) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = match.route.hydrateFallbackElement || null;
        }
      }
    }
    let matches2 = parentMatches.concat(renderedMatches.slice(0, index + 1));
    let getChildren = () => {
      let children;
      if (error) {
        children = errorElement;
      } else if (shouldRenderHydrateFallback) {
        children = hydrateFallbackElement;
      } else if (match.route.Component) {
        children = /* @__PURE__ */ _$2(match.route.Component, null);
      } else if (match.route.element) {
        children = match.route.element;
      } else {
        children = outlet;
      }
      return /* @__PURE__ */ _$2(
        RenderedRoute,
        {
          match,
          routeContext: {
            outlet,
            matches: matches2,
            isDataRoute: dataRouterState != null
          },
          children
        }
      );
    };
    return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /* @__PURE__ */ _$2(
      RenderErrorBoundary,
      {
        location: dataRouterState.location,
        revalidation: dataRouterState.revalidation,
        component: errorElement,
        error,
        children: getChildren(),
        routeContext: { outlet: null, matches: matches2, isDataRoute: true }
      }
    ) : getChildren();
  }, null);
}
function getDataRouterConsoleError(hookName) {
  return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function useDataRouterContext(hookName) {
  let ctx = x$2(DataRouterContext);
  invariant(ctx, getDataRouterConsoleError(hookName));
  return ctx;
}
function useDataRouterState(hookName) {
  let state = x$2(DataRouterStateContext);
  invariant(state, getDataRouterConsoleError(hookName));
  return state;
}
function useRouteContext(hookName) {
  let route = x$2(RouteContext);
  invariant(route, getDataRouterConsoleError(hookName));
  return route;
}
function useCurrentRouteId(hookName) {
  let route = useRouteContext(hookName);
  let thisRoute = route.matches[route.matches.length - 1];
  invariant(
    thisRoute.route.id,
    `${hookName} can only be used on routes that contain a unique "id"`
  );
  return thisRoute.route.id;
}
function useRouteId() {
  return useCurrentRouteId("useRouteId" /* UseRouteId */);
}
function useRouteError() {
  let error = x$2(RouteErrorContext);
  let state = useDataRouterState("useRouteError" /* UseRouteError */);
  let routeId = useCurrentRouteId("useRouteError" /* UseRouteError */);
  if (error !== void 0) {
    return error;
  }
  return state.errors?.[routeId];
}
function useNavigateStable() {
  let { router } = useDataRouterContext("useNavigate" /* UseNavigateStable */);
  let id = useCurrentRouteId("useNavigate" /* UseNavigateStable */);
  let activeRef = A$2(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = q$2(
    async (to, options = {}) => {
      warning(activeRef.current, navigateEffectWarning);
      if (!activeRef.current) return;
      if (typeof to === "number") {
        router.navigate(to);
      } else {
        await router.navigate(to, { fromRouteId: id, ...options });
      }
    },
    [router, id]
  );
  return navigate;
}
var alreadyWarned = {};
function warningOnce(key, cond, message) {
  if (!cond && !alreadyWarned[key]) {
    alreadyWarned[key] = true;
    warning(false, message);
  }
}
M$1(DataRoutes);
function DataRoutes({
  routes,
  future,
  state
}) {
  return useRoutesImpl(routes, void 0, state, future);
}
function MemoryRouter({
  basename,
  children,
  initialEntries,
  initialIndex
}) {
  let historyRef = A$2();
  if (historyRef.current == null) {
    historyRef.current = createMemoryHistory({
      initialEntries,
      initialIndex,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = d({
    action: history.action,
    location: history.location
  });
  let setState = q$2(
    (newState) => {
      R$1(() => setStateImpl(newState));
    },
    [setStateImpl]
  );
  _$1(() => history.listen(setState), [history, setState]);
  return /* @__PURE__ */ _$2(
    Router,
    {
      basename,
      children,
      location: state.location,
      navigationType: state.action,
      navigator: history
    }
  );
}
function Route(_props) {
  invariant(
    false,
    `A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.`
  );
}
function Router({
  basename: basenameProp = "/",
  children = null,
  location: locationProp,
  navigationType = "POP" /* Pop */,
  navigator,
  static: staticProp = false
}) {
  invariant(
    !useInRouterContext(),
    `You cannot render a <Router> inside another <Router>. You should never have more than one in your app.`
  );
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = T$2(
    () => ({
      basename,
      navigator,
      static: staticProp,
      future: {}
    }),
    [basename, navigator, staticProp]
  );
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = T$2(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
  warning(
    locationContext != null,
    `<Router basename="${basename}"> is not able to match the URL "${pathname}${search}${hash}" because it does not start with the basename, so the <Router> won't render anything.`
  );
  if (locationContext == null) {
    return null;
  }
  return /* @__PURE__ */ _$2(NavigationContext.Provider, { value: navigationContext }, /* @__PURE__ */ _$2(LocationContext.Provider, { children, value: locationContext }));
}
function Routes({
  children,
  location
}) {
  return useRoutes(createRoutesFromChildren(children), location);
}
function createRoutesFromChildren(children, parentPath = []) {
  let routes = [];
  O$1.forEach(children, (element, index) => {
    if (!mn(element)) {
      return;
    }
    let treePath = [...parentPath, index];
    if (element.type === k$3) {
      routes.push.apply(
        routes,
        createRoutesFromChildren(element.props.children, treePath)
      );
      return;
    }
    invariant(
      element.type === Route,
      `[${typeof element.type === "string" ? element.type : element.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    );
    invariant(
      !element.props.index || !element.props.children,
      "An index route cannot have child routes."
    );
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      Component: element.props.Component,
      index: element.props.index,
      path: element.props.path,
      loader: element.props.loader,
      action: element.props.action,
      hydrateFallbackElement: element.props.hydrateFallbackElement,
      HydrateFallback: element.props.HydrateFallback,
      errorElement: element.props.errorElement,
      ErrorBoundary: element.props.ErrorBoundary,
      hasErrorBoundary: element.props.hasErrorBoundary === true || element.props.ErrorBoundary != null || element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
      lazy: element.props.lazy
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(
        element.props.children,
        treePath
      );
    }
    routes.push(route);
  });
  return routes;
}

// lib/dom/dom.ts
var defaultMethod = "get";
var defaultEncType = "application/x-www-form-urlencoded";
function isHtmlElement(object) {
  return object != null && typeof object.tagName === "string";
}
function isButtonElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
}
function isFormElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
}
function isInputElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && // Ignore everything but left clicks
  (!target || target === "_self") && // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event);
}
var _formDataSupportsSubmitter = null;
function isFormDataSubmitterSupported() {
  if (_formDataSupportsSubmitter === null) {
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      );
      _formDataSupportsSubmitter = false;
    } catch (e) {
      _formDataSupportsSubmitter = true;
    }
  }
  return _formDataSupportsSubmitter;
}
var supportedFormEncTypes = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function getFormEncType(encType) {
  if (encType != null && !supportedFormEncTypes.has(encType)) {
    warning(
      false,
      `"${encType}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${defaultEncType}"`
    );
    return null;
  }
  return encType;
}
function getFormSubmissionInfo(target, basename) {
  let method;
  let action;
  let encType;
  let formData;
  let body;
  if (isFormElement(target)) {
    let attr = target.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(target);
  } else if (isButtonElement(target) || isInputElement(target) && (target.type === "submit" || target.type === "image")) {
    let form = target.form;
    if (form == null) {
      throw new Error(
        `Cannot submit a <button> or <input type="submit"> without a <form>`
      );
    }
    let attr = target.getAttribute("formaction") || form.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("formmethod") || form.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("formenctype")) || getFormEncType(form.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(form, target);
    if (!isFormDataSubmitterSupported()) {
      let { name, type, value } = target;
      if (type === "image") {
        let prefix = name ? `${name}.` : "";
        formData.append(`${prefix}x`, "0");
        formData.append(`${prefix}y`, "0");
      } else if (name) {
        formData.append(name, value);
      }
    }
  } else if (isHtmlElement(target)) {
    throw new Error(
      `Cannot submit element that is not <form>, <button>, or <input type="submit|image">`
    );
  } else {
    method = defaultMethod;
    action = null;
    encType = defaultEncType;
    body = target;
  }
  if (formData && encType === "text/plain") {
    body = formData;
    formData = void 0;
  }
  return { action, method: method.toLowerCase(), encType, formData, body };
}

// lib/dom/ssr/invariant.ts
function invariant2(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}

// lib/dom/ssr/routeModules.ts
async function loadRouteModule(route, routeModulesCache) {
  if (route.id in routeModulesCache) {
    return routeModulesCache[route.id];
  }
  try {
    let routeModule = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      route.module
    );
    routeModulesCache[route.id] = routeModule;
    return routeModule;
  } catch (error) {
    console.error(
      `Error loading route module \`${route.module}\`, reloading page...`
    );
    console.error(error);
    if (window.__reactRouterContext && window.__reactRouterContext.isSpaMode && // @ts-expect-error
    undefined) {
      throw error;
    }
    window.location.reload();
    return new Promise(() => {
    });
  }
}
function isHtmlLinkDescriptor(object) {
  if (object == null) {
    return false;
  }
  if (object.href == null) {
    return object.rel === "preload" && typeof object.imageSrcSet === "string" && typeof object.imageSizes === "string";
  }
  return typeof object.rel === "string" && typeof object.href === "string";
}
async function getKeyedPrefetchLinks(matches, manifest, routeModules) {
  let links = await Promise.all(
    matches.map(async (match) => {
      let route = manifest.routes[match.route.id];
      if (route) {
        let mod = await loadRouteModule(route, routeModules);
        return mod.links ? mod.links() : [];
      }
      return [];
    })
  );
  return dedupeLinkDescriptors(
    links.flat(1).filter(isHtmlLinkDescriptor).filter((link) => link.rel === "stylesheet" || link.rel === "preload").map(
      (link) => link.rel === "stylesheet" ? { ...link, rel: "prefetch", as: "style" } : { ...link, rel: "prefetch" }
    )
  );
}
function getNewMatchesForLinks(page, nextMatches, currentMatches, manifest, location, mode) {
  let isNew = (match, index) => {
    if (!currentMatches[index]) return true;
    return match.route.id !== currentMatches[index].route.id;
  };
  let matchPathChanged = (match, index) => {
    return (
      // param change, /users/123 -> /users/456
      currentMatches[index].pathname !== match.pathname || // splat param changed, which is not present in match.path
      // e.g. /files/images/avatar.jpg -> files/finances.xls
      currentMatches[index].route.path?.endsWith("*") && currentMatches[index].params["*"] !== match.params["*"]
    );
  };
  if (mode === "assets") {
    return nextMatches.filter(
      (match, index) => isNew(match, index) || matchPathChanged(match, index)
    );
  }
  if (mode === "data") {
    return nextMatches.filter((match, index) => {
      let manifestRoute = manifest.routes[match.route.id];
      if (!manifestRoute || !manifestRoute.hasLoader) {
        return false;
      }
      if (isNew(match, index) || matchPathChanged(match, index)) {
        return true;
      }
      if (match.route.shouldRevalidate) {
        let routeChoice = match.route.shouldRevalidate({
          currentUrl: new URL(
            location.pathname + location.search + location.hash,
            window.origin
          ),
          currentParams: currentMatches[0]?.params || {},
          nextUrl: new URL(page, window.origin),
          nextParams: match.params,
          defaultShouldRevalidate: true
        });
        if (typeof routeChoice === "boolean") {
          return routeChoice;
        }
      }
      return true;
    });
  }
  return [];
}
function getModuleLinkHrefs(matches, manifest, { includeHydrateFallback } = {}) {
  return dedupeHrefs(
    matches.map((match) => {
      let route = manifest.routes[match.route.id];
      if (!route) return [];
      let hrefs = [route.module];
      if (route.clientActionModule) {
        hrefs = hrefs.concat(route.clientActionModule);
      }
      if (route.clientLoaderModule) {
        hrefs = hrefs.concat(route.clientLoaderModule);
      }
      if (includeHydrateFallback && route.hydrateFallbackModule) {
        hrefs = hrefs.concat(route.hydrateFallbackModule);
      }
      if (route.imports) {
        hrefs = hrefs.concat(route.imports);
      }
      return hrefs;
    }).flat(1)
  );
}
function dedupeHrefs(hrefs) {
  return [...new Set(hrefs)];
}
function sortKeys(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}
function dedupeLinkDescriptors(descriptors, preloads) {
  let set = /* @__PURE__ */ new Set();
  new Set(preloads);
  return descriptors.reduce((deduped, descriptor) => {
    let key = JSON.stringify(sortKeys(descriptor));
    if (!set.has(key)) {
      set.add(key);
      deduped.push({ key, link: descriptor });
    }
    return deduped;
  }, []);
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var NO_BODY_STATUS_CODES = /* @__PURE__ */ new Set([100, 101, 204, 205]);
function singleFetchUrl(reqUrl, basename) {
  let url = typeof reqUrl === "string" ? new URL(
    reqUrl,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window === "undefined" ? "server://singlefetch/" : window.location.origin
  ) : reqUrl;
  if (url.pathname === "/") {
    url.pathname = "_root.data";
  } else if (basename && stripBasename(url.pathname, basename) === "/") {
    url.pathname = `${basename.replace(/\/$/, "")}/_root.data`;
  } else {
    url.pathname = `${url.pathname.replace(/\/$/, "")}.data`;
  }
  return url;
}

// lib/dom/ssr/components.tsx
function useDataRouterContext2() {
  let context = x$2(DataRouterContext);
  invariant2(
    context,
    "You must render this element inside a <DataRouterContext.Provider> element"
  );
  return context;
}
function useDataRouterStateContext() {
  let context = x$2(DataRouterStateContext);
  invariant2(
    context,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  );
  return context;
}
var FrameworkContext = K$2(void 0);
FrameworkContext.displayName = "FrameworkContext";
function useFrameworkContext() {
  let context = x$2(FrameworkContext);
  invariant2(
    context,
    "You must render this element inside a <HydratedRouter> element"
  );
  return context;
}
function usePrefetchBehavior(prefetch, theirElementProps) {
  let frameworkContext = x$2(FrameworkContext);
  let [maybePrefetch, setMaybePrefetch] = d(false);
  let [shouldPrefetch, setShouldPrefetch] = d(false);
  let { onFocus, onBlur, onMouseEnter, onMouseLeave, onTouchStart } = theirElementProps;
  let ref = A$2(null);
  y$1(() => {
    if (prefetch === "render") {
      setShouldPrefetch(true);
    }
    if (prefetch === "viewport") {
      let callback = (entries) => {
        entries.forEach((entry) => {
          setShouldPrefetch(entry.isIntersecting);
        });
      };
      let observer = new IntersectionObserver(callback, { threshold: 0.5 });
      if (ref.current) observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [prefetch]);
  y$1(() => {
    if (maybePrefetch) {
      let id = setTimeout(() => {
        setShouldPrefetch(true);
      }, 100);
      return () => {
        clearTimeout(id);
      };
    }
  }, [maybePrefetch]);
  let setIntent = () => {
    setMaybePrefetch(true);
  };
  let cancelIntent = () => {
    setMaybePrefetch(false);
    setShouldPrefetch(false);
  };
  if (!frameworkContext) {
    return [false, ref, {}];
  }
  if (prefetch !== "intent") {
    return [shouldPrefetch, ref, {}];
  }
  return [
    shouldPrefetch,
    ref,
    {
      onFocus: composeEventHandlers(onFocus, setIntent),
      onBlur: composeEventHandlers(onBlur, cancelIntent),
      onMouseEnter: composeEventHandlers(onMouseEnter, setIntent),
      onMouseLeave: composeEventHandlers(onMouseLeave, cancelIntent),
      onTouchStart: composeEventHandlers(onTouchStart, setIntent)
    }
  ];
}
function composeEventHandlers(theirHandler, ourHandler) {
  return (event) => {
    theirHandler && theirHandler(event);
    if (!event.defaultPrevented) {
      ourHandler(event);
    }
  };
}
function PrefetchPageLinks({
  page,
  ...dataLinkProps
}) {
  let { router } = useDataRouterContext2();
  let matches = T$2(
    () => matchRoutes(router.routes, page, router.basename),
    [router.routes, page, router.basename]
  );
  if (!matches) {
    return null;
  }
  return /* @__PURE__ */ _$2(PrefetchPageLinksImpl, { page, matches, ...dataLinkProps });
}
function useKeyedPrefetchLinks(matches) {
  let { manifest, routeModules } = useFrameworkContext();
  let [keyedPrefetchLinks, setKeyedPrefetchLinks] = d([]);
  y$1(() => {
    let interrupted = false;
    void getKeyedPrefetchLinks(matches, manifest, routeModules).then(
      (links) => {
        if (!interrupted) {
          setKeyedPrefetchLinks(links);
        }
      }
    );
    return () => {
      interrupted = true;
    };
  }, [matches, manifest, routeModules]);
  return keyedPrefetchLinks;
}
function PrefetchPageLinksImpl({
  page,
  matches: nextMatches,
  ...linkProps
}) {
  let location = useLocation();
  let { manifest, routeModules } = useFrameworkContext();
  let { basename } = useDataRouterContext2();
  let { loaderData, matches } = useDataRouterStateContext();
  let newMatchesForData = T$2(
    () => getNewMatchesForLinks(
      page,
      nextMatches,
      matches,
      manifest,
      location,
      "data"
    ),
    [page, nextMatches, matches, manifest, location]
  );
  let newMatchesForAssets = T$2(
    () => getNewMatchesForLinks(
      page,
      nextMatches,
      matches,
      manifest,
      location,
      "assets"
    ),
    [page, nextMatches, matches, manifest, location]
  );
  let dataHrefs = T$2(() => {
    if (page === location.pathname + location.search + location.hash) {
      return [];
    }
    let routesParams = /* @__PURE__ */ new Set();
    let foundOptOutRoute = false;
    nextMatches.forEach((m) => {
      let manifestRoute = manifest.routes[m.route.id];
      if (!manifestRoute || !manifestRoute.hasLoader) {
        return;
      }
      if (!newMatchesForData.some((m2) => m2.route.id === m.route.id) && m.route.id in loaderData && routeModules[m.route.id]?.shouldRevalidate) {
        foundOptOutRoute = true;
      } else if (manifestRoute.hasClientLoader) {
        foundOptOutRoute = true;
      } else {
        routesParams.add(m.route.id);
      }
    });
    if (routesParams.size === 0) {
      return [];
    }
    let url = singleFetchUrl(page, basename);
    if (foundOptOutRoute && routesParams.size > 0) {
      url.searchParams.set(
        "_routes",
        nextMatches.filter((m) => routesParams.has(m.route.id)).map((m) => m.route.id).join(",")
      );
    }
    return [url.pathname + url.search];
  }, [
    basename,
    loaderData,
    location,
    manifest,
    newMatchesForData,
    nextMatches,
    page,
    routeModules
  ]);
  let moduleHrefs = T$2(
    () => getModuleLinkHrefs(newMatchesForAssets, manifest),
    [newMatchesForAssets, manifest]
  );
  let keyedPrefetchLinks = useKeyedPrefetchLinks(newMatchesForAssets);
  return /* @__PURE__ */ _$2(k$3, null, dataHrefs.map((href2) => /* @__PURE__ */ _$2("link", { key: href2, rel: "prefetch", as: "fetch", href: href2, ...linkProps })), moduleHrefs.map((href2) => /* @__PURE__ */ _$2("link", { key: href2, rel: "modulepreload", href: href2, ...linkProps })), keyedPrefetchLinks.map(({ key, link }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ _$2("link", { key, ...link })
  )));
}
function mergeRefs(...refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}

// lib/dom/lib.tsx
var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
try {
  if (isBrowser) {
    window.__reactRouterVersion = "7.6.2";
  }
} catch (e) {
}
var ABSOLUTE_URL_REGEX2 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
var Link = D$1(
  function LinkWithRef({
    onClick,
    discover = "render",
    prefetch = "none",
    relative,
    reloadDocument,
    replace: replace2,
    state,
    target,
    to,
    preventScrollReset,
    viewTransition,
    ...rest
  }, forwardedRef) {
    let { basename } = x$2(NavigationContext);
    let isAbsolute = typeof to === "string" && ABSOLUTE_URL_REGEX2.test(to);
    let absoluteHref;
    let isExternal = false;
    if (typeof to === "string" && isAbsolute) {
      absoluteHref = to;
      if (isBrowser) {
        try {
          let currentUrl = new URL(window.location.href);
          let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
          let path = stripBasename(targetUrl.pathname, basename);
          if (targetUrl.origin === currentUrl.origin && path != null) {
            to = path + targetUrl.search + targetUrl.hash;
          } else {
            isExternal = true;
          }
        } catch (e) {
          warning(
            false,
            `<Link to="${to}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
          );
        }
      }
    }
    let href2 = useHref(to, { relative });
    let [shouldPrefetch, prefetchRef, prefetchHandlers] = usePrefetchBehavior(
      prefetch,
      rest
    );
    let internalOnClick = useLinkClickHandler(to, {
      replace: replace2,
      state,
      target,
      preventScrollReset,
      relative,
      viewTransition
    });
    function handleClick(event) {
      if (onClick) onClick(event);
      if (!event.defaultPrevented) {
        internalOnClick(event);
      }
    }
    let link = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ _$2(
        "a",
        {
          ...rest,
          ...prefetchHandlers,
          href: absoluteHref || href2,
          onClick: isExternal || reloadDocument ? onClick : handleClick,
          ref: mergeRefs(forwardedRef, prefetchRef),
          target,
          "data-discover": !isAbsolute && discover === "render" ? "true" : void 0
        }
      )
    );
    return shouldPrefetch && !isAbsolute ? /* @__PURE__ */ _$2(k$3, null, link, /* @__PURE__ */ _$2(PrefetchPageLinks, { page: href2 })) : link;
  }
);
Link.displayName = "Link";
var NavLink = D$1(
  function NavLinkWithRef({
    "aria-current": ariaCurrentProp = "page",
    caseSensitive = false,
    className: classNameProp = "",
    end = false,
    style: styleProp,
    to,
    viewTransition,
    children,
    ...rest
  }, ref) {
    let path = useResolvedPath(to, { relative: rest.relative });
    let location = useLocation();
    let routerState = x$2(DataRouterStateContext);
    let { navigator, basename } = x$2(NavigationContext);
    let isTransitioning = routerState != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useViewTransitionState(path) && viewTransition === true;
    let toPathname = navigator.encodeLocation ? navigator.encodeLocation(path).pathname : path.pathname;
    let locationPathname = location.pathname;
    let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
    if (!caseSensitive) {
      locationPathname = locationPathname.toLowerCase();
      nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
      toPathname = toPathname.toLowerCase();
    }
    if (nextLocationPathname && basename) {
      nextLocationPathname = stripBasename(nextLocationPathname, basename) || nextLocationPathname;
    }
    const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
    let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
    let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
    let renderProps = {
      isActive,
      isPending,
      isTransitioning
    };
    let ariaCurrent = isActive ? ariaCurrentProp : void 0;
    let className;
    if (typeof classNameProp === "function") {
      className = classNameProp(renderProps);
    } else {
      className = [
        classNameProp,
        isActive ? "active" : null,
        isPending ? "pending" : null,
        isTransitioning ? "transitioning" : null
      ].filter(Boolean).join(" ");
    }
    let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
    return /* @__PURE__ */ _$2(
      Link,
      {
        ...rest,
        "aria-current": ariaCurrent,
        className,
        ref,
        style,
        to,
        viewTransition
      },
      typeof children === "function" ? children(renderProps) : children
    );
  }
);
NavLink.displayName = "NavLink";
var Form = D$1(
  ({
    discover = "render",
    fetcherKey,
    navigate,
    reloadDocument,
    replace: replace2,
    state,
    method = defaultMethod,
    action,
    onSubmit,
    relative,
    preventScrollReset,
    viewTransition,
    ...props
  }, forwardedRef) => {
    let submit = useSubmit();
    let formAction = useFormAction(action, { relative });
    let formMethod = method.toLowerCase() === "get" ? "get" : "post";
    let isAbsolute = typeof action === "string" && ABSOLUTE_URL_REGEX2.test(action);
    let submitHandler = (event) => {
      onSubmit && onSubmit(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      let submitter = event.nativeEvent.submitter;
      let submitMethod = submitter?.getAttribute("formmethod") || method;
      submit(submitter || event.currentTarget, {
        fetcherKey,
        method: submitMethod,
        navigate,
        replace: replace2,
        state,
        relative,
        preventScrollReset,
        viewTransition
      });
    };
    return /* @__PURE__ */ _$2(
      "form",
      {
        ref: forwardedRef,
        method: formMethod,
        action: formAction,
        onSubmit: reloadDocument ? onSubmit : submitHandler,
        ...props,
        "data-discover": !isAbsolute && discover === "render" ? "true" : void 0
      }
    );
  }
);
Form.displayName = "Form";
function getDataRouterConsoleError2(hookName) {
  return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function useDataRouterContext3(hookName) {
  let ctx = x$2(DataRouterContext);
  invariant(ctx, getDataRouterConsoleError2(hookName));
  return ctx;
}
function useLinkClickHandler(to, {
  target,
  replace: replaceProp,
  state,
  preventScrollReset,
  relative,
  viewTransition
} = {}) {
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, { relative });
  return q$2(
    (event) => {
      if (shouldProcessLinkClick(event, target)) {
        event.preventDefault();
        let replace2 = replaceProp !== void 0 ? replaceProp : createPath(location) === createPath(path);
        navigate(to, {
          replace: replace2,
          state,
          preventScrollReset,
          relative,
          viewTransition
        });
      }
    },
    [
      location,
      navigate,
      path,
      replaceProp,
      state,
      target,
      to,
      preventScrollReset,
      relative,
      viewTransition
    ]
  );
}
var fetcherId = 0;
var getUniqueFetcherId = () => `__${String(++fetcherId)}__`;
function useSubmit() {
  let { router } = useDataRouterContext3("useSubmit" /* UseSubmit */);
  let { basename } = x$2(NavigationContext);
  let currentRouteId = useRouteId();
  return q$2(
    async (target, options = {}) => {
      let { action, method, encType, formData, body } = getFormSubmissionInfo(
        target,
        basename
      );
      if (options.navigate === false) {
        let key = options.fetcherKey || getUniqueFetcherId();
        await router.fetch(key, currentRouteId, options.action || action, {
          preventScrollReset: options.preventScrollReset,
          formData,
          body,
          formMethod: options.method || method,
          formEncType: options.encType || encType,
          flushSync: options.flushSync
        });
      } else {
        await router.navigate(options.action || action, {
          preventScrollReset: options.preventScrollReset,
          formData,
          body,
          formMethod: options.method || method,
          formEncType: options.encType || encType,
          replace: options.replace,
          state: options.state,
          fromRouteId: currentRouteId,
          flushSync: options.flushSync,
          viewTransition: options.viewTransition
        });
      }
    },
    [router, basename, currentRouteId]
  );
}
function useFormAction(action, { relative } = {}) {
  let { basename } = x$2(NavigationContext);
  let routeContext = x$2(RouteContext);
  invariant(routeContext, "useFormAction must be used inside a RouteContext");
  let [match] = routeContext.matches.slice(-1);
  let path = { ...useResolvedPath(action ? action : ".", { relative }) };
  let location = useLocation();
  if (action == null) {
    path.search = location.search;
    let params = new URLSearchParams(path.search);
    let indexValues = params.getAll("index");
    let hasNakedIndexParam = indexValues.some((v) => v === "");
    if (hasNakedIndexParam) {
      params.delete("index");
      indexValues.filter((v) => v).forEach((v) => params.append("index", v));
      let qs = params.toString();
      path.search = qs ? `?${qs}` : "";
    }
  }
  if ((!action || action === ".") && match.route.index) {
    path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
  }
  if (basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
  }
  return createPath(path);
}
function useViewTransitionState(to, opts = {}) {
  let vtContext = x$2(ViewTransitionContext);
  invariant(
    vtContext != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename } = useDataRouterContext3(
    "useViewTransitionState" /* useViewTransitionState */
  );
  let path = useResolvedPath(to, { relative: opts.relative });
  if (!vtContext.isTransitioning) {
    return false;
  }
  let currentPath = stripBasename(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
  let nextPath = stripBasename(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
  return matchPath(path.pathname, nextPath) != null || matchPath(path.pathname, currentPath) != null;
}

// lib/server-runtime/single-fetch.ts
/* @__PURE__ */ new Set([
  ...NO_BODY_STATUS_CODES,
  304
]);

const FooterContent = dt.div`
    font-size: small;
    color: gray;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 40px; /* отступ от кнопок */
    padding: 20px 0;
`;
const Info = dt.div`
    margin-bottom: 12px;
    span {
        margin: 0 4px;
    }
`;
const Slogan = dt.div`
    margin-bottom: 12px;
`;

const About = () => {
  const { plugin } = useSettingsContext();
  return /* @__PURE__ */ u$1(k$3, { children: [
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "GitHub page",
        addButtons: [
          (button) => {
            button.setIcon("github");
            button.setTooltip("Go to GitHub page of this plugin");
            button.onClick(() => {
              window.open(
                "https://github.com/Ssentiago/interactify/",
                "_blank"
              );
            });
            return button;
          }
        ]
      }
    ),
    /* @__PURE__ */ u$1(FooterContent, { children: [
      /* @__PURE__ */ u$1(Slogan, { children: "Make Obsidian images and diagrams Interactify!" }),
      /* @__PURE__ */ u$1(Info, { children: [
        plugin.manifest.version,
        /* @__PURE__ */ u$1("span", { children: "\u2022" }),
        /* @__PURE__ */ u$1(
          "a",
          {
            href: "https://github.com/Ssentiago/interactify/blob/main/LICENSE",
            target: "_blank",
            children: "Apache-2.0"
          }
        ),
        /* @__PURE__ */ u$1("span", { children: "\u2022" }),
        "by",
        " ",
        /* @__PURE__ */ u$1(
          "a",
          {
            href: "https://github.com/gitcpy",
            target: "_blank",
            children: "gitcpy"
          }
        ),
        " ",
        "and",
        " ",
        /* @__PURE__ */ u$1(
          "a",
          {
            href: "https://github.com/Ssentiago",
            target: "_blank",
            children: "Ssentiago"
          }
        )
      ] })
    ] })
  ] });
};

const Debug = () => {
  const { plugin } = useSettingsContext();
  const [, setReload] = d(false);
  const downloadLogs = q$2(() => {
    const logs = plugin.logger.exportLogs();
    const blob = new Blob([logs], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "interactify-logs.txt";
    link.click();
    URL.revokeObjectURL(url);
  }, [plugin.logger]);
  return /* @__PURE__ */ u$1(k$3, { children: [
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Report an issue",
        addMultiDesc: (multidesc) => {
          multidesc.addDescriptions([
            "If you encounter any issues or have suggestions, please report them on GitHub.",
            "How to report an issue:",
            "1. Enable debug logging below and set level to `Debug`.",
            "Warning: This may impact performance temporarily.",
            "2. Reproduce the issue with logging enabled.",
            "3. Export logs using the button below.",
            '4. Click "Report an issue" and fill out the form.',
            "5. Attach the exported log file.",
            "6. Submit the issue."
          ]);
          return multidesc;
        },
        addButtons: [
          (button) => {
            button.setIcon("bug");
            button.setTooltip("Report an issue");
            button.onClick(async () => {
              const systemInfo = JSON.stringify(
                plugin.logger.getShortSystemInfo(),
                null,
                2
              );
              const issueBody = encodeURIComponent(
                `## Issue Description
[Describe your issue here]

## Steps to Reproduce
1. [First step]
2. [Second step]

## System info
${systemInfo}

`
              );
              const githubUrl = `https://github.com/Ssentiago/interactify/issues/new?title=${encodeURIComponent("[Bug Report] ")}&labels=bug&body=${issueBody}`;
              window.open(githubUrl, "_blank");
            });
            return button;
          }
        ]
      }
    ),
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Enable logging",
        desc: "Enable debug logging for troubleshooting",
        addToggles: [
          (toggle) => {
            toggle.setValue(plugin.settings.data.debug.enabled);
            toggle.onChange(async (value) => {
              plugin.settings.data.debug.enabled = value;
              await plugin.settings.saveSettings();
            });
            return toggle;
          }
        ]
      }
    ),
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Log level",
        desc: "Set minimum log level to display",
        addDropdowns: [
          (dropdown) => {
            dropdown.addOptions({
              none: "None",
              error: "Error",
              warn: "Warning",
              info: "Info",
              debug: "Debug"
            });
            dropdown.setValue(plugin.settings.data.debug.level);
            dropdown.onChange(async (value) => {
              plugin.settings.data.debug.level = value;
              await plugin.settings.saveSettings();
            });
            return dropdown;
          }
        ]
      }
    ),
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "About exported logs",
        addMultiDesc: (multiDesc) => {
          multiDesc.addDescriptions([
            "Exported logs contain:",
            "\u2022 Complete system information (OS, hardware, plugins)",
            "\u2022 Debug events with timestamps",
            "\u2022 Performance metrics",
            "Review logs before sharing - remove sensitive data if needed."
          ]);
          return multiDesc;
        }
      }
    ),
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Export logs",
        addButtons: [
          (button) => {
            button.setIcon("download");
            button.setTooltip("Export logs");
            button.onClick(downloadLogs);
            return button;
          }
        ]
      }
    ),
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Copy logs",
        addButtons: [
          (button) => {
            button.setIcon("clipboard");
            button.setTooltip("Copy logs to clipboard");
            button.onClick(async () => {
              const logString = plugin.logger.exportLogs();
              if (logString.trim() === "") {
                plugin.showNotice("No logs data found");
                return;
              }
              await navigator.clipboard.writeText(logString);
              plugin.showNotice("Logs was copied to clipboard");
            });
            return button;
          }
        ]
      }
    ),
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Clear logs storage",
        desc: `Storage: ${plugin.logger.getStorageUsage()}, Entries: ${plugin.logger.getAllLogs().length}`,
        addButtons: [
          (button) => {
            button.setIcon("trash");
            button.setTooltip("Clear logs storage");
            button.onClick(async () => {
              plugin.logger.clearAllLogs();
              setReload((prev) => !prev);
              plugin.showNotice("Logs storage was cleared");
            });
            return button;
          }
        ]
      }
    )
  ] });
};

const MiniNavbar$1 = dt.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid var(--color-base-30);

    .button-active {
        background: var(--interactive-accent);
        color: var(--text-on-accent);
        transform: scale(1.05);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    button {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
    }
`;
dt.div`
    &.fadeIn {
        animation: 0.2s fadeIn forwards;
    }

    &.fadeOut {
        animation: 0.15s fadeOut forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateX(15px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-10px);
        }
    }
`;
dt.div`
    &.fadeIn {
        animation: 0.25s mainFadeIn forwards;
    }

    &.fadeOut {
        animation: 0.2s mainFadeOut forwards;
    }

    @keyframes mainFadeIn {
        from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes mainFadeOut {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(-5px) scale(0.99);
        }
    }
`;

const useHistory = (state, updateState) => {
  const { plugin } = useSettingsContext();
  const [canUndo, setCanUndo] = d(false);
  const [canRedo, setCanRedo] = d(false);
  const [undoStack, setUndoStack] = d([]);
  const [redoStack, setRedoStack] = d([]);
  const [undoDescription, setUndoDescription] = d("");
  const [redoDescription, setRedoDescription] = d("");
  {
    y$1(() => {
      window.undoDebug = {
        undoStack,
        redoStack,
        undoDescription,
        redoDescription,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
        currentState: state
      };
    }, [undoStack, redoStack, undoDescription, redoDescription, state]);
  }
  y$1(() => {
    if (undoStack.length > 0) {
      const action = undoStack[undoStack.length - 1];
      setUndoDescription(action.description);
    } else {
      setUndoDescription("");
    }
    if (redoStack.length > 0) {
      const action = redoStack[redoStack.length - 1];
      setRedoDescription(action.description);
    } else {
      setRedoDescription("");
    }
  }, [undoStack, redoStack]);
  const getUndoLabel = () => {
    if (!undoDescription) {
      return "Nothing to undo\nShortcut: CTR+Z";
    }
    const count = undoStack.length > 1 ? ` (${undoStack.length - 1} more)` : "";
    return `Undo
${undoDescription}${count}
Shortcut: CTR+Z`;
  };
  const getRedoLabel = () => {
    if (!redoDescription) {
      return "Nothing to redo\nShortcut: CTR+SHIFT+Z";
    }
    const count = redoStack.length > 1 ? ` (${redoStack.length - 1} more)` : "";
    return `Redo
${redoDescription}${count}
Shortcut: CTR+SHIFT+Z`;
  };
  y$1(() => {
    const handler = async () => {
      setUndoStack([]);
      setRedoStack([]);
      setCanUndo(false);
      setCanRedo(false);
    };
    plugin.settings.eventBus.on("settings-reset", handler);
    plugin.settings.eventBus.on("settings-clear-history", handler);
    return () => {
      plugin.settings.eventBus.off("settings-reset", handler);
      plugin.settings.eventBus.off("settings-clear-history", handler);
    };
  }, []);
  const updateUndoStack = (state2, description) => {
    let newUndoStack = [...undoStack];
    newUndoStack.push({
      description,
      state: state2
    });
    setCanUndo(true);
    if (newUndoStack.length > 50) {
      newUndoStack = [...newUndoStack.slice(-49)];
    }
    setUndoStack(newUndoStack);
    setRedoStack([]);
    setCanRedo(false);
  };
  const updateRedoStack = (action) => {
    const newRedoStack = [...redoStack, action];
    setRedoStack(newRedoStack);
    setCanRedo(true);
  };
  const undo = async () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      updateRedoStack({
        state: [...state],
        // текущее состояние
        description: previousState.description
        // меняем местами описания
      });
      await updateState([...previousState.state]);
      const newUndoStack = undoStack.slice(0, -1);
      setUndoStack(newUndoStack);
      setCanUndo(newUndoStack.length > 0);
    }
  };
  const redo = async () => {
    if (redoStack.length > 0) {
      const redoAction = redoStack[redoStack.length - 1];
      const newUndoStack = [
        ...undoStack,
        {
          state: [...state],
          // текущее состояние
          description: redoAction.description
        }
      ];
      setUndoStack(newUndoStack);
      const newRedoStack = redoStack.slice(0, -1);
      setRedoStack(newRedoStack);
      await updateState([...redoAction.state]);
      setCanUndo(true);
      setCanRedo(newRedoStack.length > 0);
    }
  };
  y$1(() => {
    const handler = async (e) => {
      if (e.code !== "KeyZ" && e.code !== "KeyY") {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        if (canRedo) {
          await redo();
        } else {
          plugin.showNotice("Nothing to redo");
        }
      } else if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (canUndo) {
          await undo();
        } else {
          plugin.showNotice("Nothing to undo");
        }
      }
      if (e.code === "KeyY" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        await redo();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => {
      window.removeEventListener("keydown", handler, true);
    };
  }, [undo, redo]);
  return {
    updateUndoStack,
    undo,
    redo,
    canUndo,
    canRedo,
    getRedoLabel,
    getUndoLabel
  };
};

const createHistoryContext = () => {
  const Context = K$2(
    void 0
  );
  const HistoryProvider = ({
    state,
    updateState,
    children
  }) => {
    const {
      undo,
      canUndo,
      redo,
      canRedo,
      getRedoLabel,
      getUndoLabel,
      updateUndoStack
    } = useHistory(state, updateState);
    const { plugin } = useSettingsContext();
    const contextValue = T$2(
      () => ({
        undo,
        canUndo,
        redo,
        canRedo,
        getRedoLabel,
        getUndoLabel,
        updateUndoStack
      }),
      [
        undo,
        canUndo,
        redo,
        canRedo,
        getRedoLabel,
        getUndoLabel,
        updateUndoStack
      ]
    );
    y$1(() => {
      return () => {
        plugin.settings.eventBus.emit("settings-clear-history", {
          eventName: "settings-clear-history",
          oldValue: void 0,
          newValue: void 0
        });
      };
    }, [plugin]);
    return /* @__PURE__ */ u$1(Context.Provider, { value: contextValue, children });
  };
  const useHistoryContext = () => {
    const context = x$2(Context);
    if (context === void 0) {
      throw new Error(
        "useUndoRedoContext must be used within a UndoRedoProvider"
      );
    }
    return context;
  };
  return { HistoryProvider, useHistoryContext };
};

const context = createHistoryContext();
const useUnitsHistoryContext = context.useHistoryContext;
const UnitsHistoryProvider = context.HistoryProvider;

const useUnitsManager = () => {
  const { plugin } = useSettingsContext();
  const [units, setUnits] = d(plugin.settings.data.units.configs);
  y$1(() => {
    const handler = () => {
      setUnits(plugin.settings.data.units.configs);
    };
    plugin.settings.eventBus.on(
      plugin.settings.events.units.configs.$path,
      handler
    );
    return () => {
      plugin.settings.eventBus.off(
        plugin.settings.events.units.configs.$path,
        handler
      );
    };
  }, [plugin]);
  const saveUnits = q$2(
    async (newUnits) => {
      setUnits(newUnits);
      plugin.settings.data.units.configs = newUnits;
      await plugin.settings.saveSettings();
    },
    [plugin]
  );
  return { units, saveUnits };
};

const UnitsManagerContext = K$2(
  void 0
);
const UnitsManagerProvider = ({
  children
}) => {
  const { units, saveUnits } = useUnitsManager();
  const contextValue = T$2(
    () => ({
      units,
      saveUnits
    }),
    [units, saveUnits]
  );
  return /* @__PURE__ */ u$1(UnitsManagerContext.Provider, { value: contextValue, children });
};
const useUnitsManagerContext = () => {
  const context = x$2(UnitsManagerContext);
  if (context === void 0) {
    throw new Error(
      "useUnitsManagerContext must be used within a UnitsManagerProvider"
    );
  }
  return context;
};

const useUnitsValidation = () => {
  const { plugin } = useSettingsContext();
  const { units } = useUnitsManagerContext();
  const [unitNamesIndex, setUnitNamesIndex] = d(/* @__PURE__ */ new Set());
  const [unitSelectorsIndex, setUnitSelectorsIndex] = d(/* @__PURE__ */ new Set());
  const updateUnitNameAndSelectors = (units2) => {
    const unitIndexData = {
      names: [],
      selectors: []
    };
    units2.forEach((item) => {
      unitIndexData.names.push(item.name);
      unitIndexData.selectors.push(item.selector);
    });
    setUnitNamesIndex(new Set(unitIndexData.names));
    setUnitSelectorsIndex(new Set(unitIndexData.selectors));
  };
  y$1(() => {
    updateUnitNameAndSelectors(plugin.settings.data.units.configs);
    const handler = (payload) => {
      updateUnitNameAndSelectors(units);
    };
    plugin.settings.eventBus.on(
      plugin.settings.events.units.configs.$path,
      handler
    );
    return () => {
      plugin.settings.eventBus.off(
        plugin.settings.events.units.configs.$path,
        handler
      );
    };
  }, [units]);
  const testSelector = (selector) => {
    try {
      document.querySelector(selector);
      return { valid: true, err: void 0 };
    } catch (err) {
      const parts = err.message.split(":");
      const message = parts.slice(1).join(":").trim();
      return { valid: false, err: message };
    }
  };
  const validateName = (name, exclude) => {
    if (!name.trim()) {
      return {
        empty: true,
        tooltip: "",
        valid: false
      };
    }
    if (unitNamesIndex.has(name) && (!exclude || exclude.name !== name)) {
      return {
        valid: false,
        tooltip: "Unit with that name already exists",
        empty: false
      };
    }
    return { valid: true, tooltip: "", empty: false };
  };
  const validateSelector = (selector, exclude) => {
    if (!selector.trim()) {
      return {
        empty: true,
        tooltip: "",
        valid: false
      };
    }
    const { valid, err } = testSelector(selector);
    if (!valid) {
      return {
        valid: false,
        tooltip: `Invalid CSS selector: ${err}`,
        empty: false
      };
    }
    if (unitSelectorsIndex.has(selector) && (!exclude || exclude.selector !== selector)) {
      return {
        valid: false,
        tooltip: "Unit with that selector already exists",
        empty: false
      };
    }
    return { valid: true, tooltip: "", empty: false };
  };
  const validateBoth = (name, selector, exclude) => {
    const nameResult = validateName(name, exclude);
    const selectorResult = validateSelector(selector, exclude);
    const bothEmpty = nameResult.empty && selectorResult.empty;
    const oneEmpty = (nameResult.empty || selectorResult.empty) && !bothEmpty;
    return { nameResult, selectorResult, bothEmpty, oneEmpty };
  };
  const applyValidationToElement = (element, result) => {
    element.classList.toggle("invalid", !result.empty && !result.valid);
    element.ariaLabel = result.tooltip;
  };
  const processBothValidation = (nameInput, selectorInput, result) => {
    applyValidationToElement(nameInput, result.nameResult);
    applyValidationToElement(selectorInput, result.selectorResult);
    if (result.bothEmpty) {
      plugin.showNotice("Nothing to save");
      return false;
    }
    if (result.oneEmpty) {
      const field = result.nameResult.empty ? "name" : "selector";
      plugin.showNotice(`Fill out unit ${field} field!`);
      return false;
    }
    const bothInvalid = !result.nameResult.valid && !result.selectorResult.valid;
    const oneInvalid = !result.nameResult.valid || !result.selectorResult.valid;
    if (bothInvalid) {
      plugin.showNotice("Unit name and selector are both invalid");
      return false;
    }
    if (oneInvalid) {
      const field = !result.nameResult.valid ? "name" : "selector";
      plugin.showNotice(`Unit ${field} is invalid`);
      return false;
    }
    return true;
  };
  const processNameValidation = (nameInput, result) => {
    applyValidationToElement(nameInput, result);
    return result.valid && !result.empty;
  };
  const processSelectorValidation = (selectorInput, result) => {
    applyValidationToElement(selectorInput, result);
    return result.valid && !result.empty;
  };
  return {
    validateBoth,
    validateName,
    validateSelector,
    processBothValidation,
    processNameValidation,
    processSelectorValidation
  };
};

const useUserGuideVideo = () => {
  const { plugin } = useSettingsContext();
  const pluginPath = T$2(() => plugin.manifest.dir, [plugin]);
  const [isLoading, setIsLoading] = d(true);
  const [videoUrl, setVideoUrl] = d("");
  const downloadVideo = async (videoPath2) => {
    try {
      const url = "https://raw.githubusercontent.com/Ssentiago/interactify/main/assets/videos/find-class.mp4";
      const response = await obsidian.requestUrl(url);
      if (response.status !== 200) {
        plugin.logger.error(
          `Error downloading video: ${response.status}`
        );
        return false;
      }
      await plugin.app.vault.adapter.writeBinary(
        videoPath2,
        response.arrayBuffer
      );
      return true;
    } catch (err) {
      plugin.logger.error(`Error downloading video: ${err.message}`);
      return false;
    }
  };
  const loadVideo = async () => {
    const pluginDir = plugin.manifest.dir;
    if (!pluginDir) {
      return false;
    }
    const assetsPath = obsidian.normalizePath(`${pluginDir}/assets`);
    const videoPath2 = obsidian.normalizePath(`${assetsPath}/user-guide-video.mp4`);
    const existsAssetsPath = await plugin.app.vault.adapter.exists(assetsPath);
    const existsVideo = await plugin.app.vault.adapter.exists(videoPath2);
    !existsAssetsPath && await plugin.app.vault.adapter.mkdir(assetsPath);
    if (!existsVideo) {
      await downloadVideo(videoPath2);
    }
    return plugin.app.vault.adapter.exists(videoPath2);
  };
  const videoPath = A$2(
    obsidian.normalizePath(`${pluginPath}/assets/user-guide-video.mp4`)
  );
  y$1(() => {
    const fetchVideo = async () => {
      setIsLoading(true);
      try {
        const exists = await loadVideo();
        if (exists) {
          const arrayBuffer = await plugin.app.vault.adapter.readBinary(
            videoPath.current
          );
          const buffer = Buffer.from(arrayBuffer);
          const base64 = buffer.toString("base64");
          setVideoUrl(`data:video/mp4;base64,${base64}`);
        } else {
          plugin.showNotice("The user guide video is not available.");
        }
      } catch (error) {
        console.error(error);
        plugin.showNotice(
          "Something went wrong. The video is missing."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideo();
  }, [videoPath]);
  return { isLoading, videoUrl };
};

const UserGuideModal = ({ onClose }) => {
  const { isLoading, videoUrl } = useUserGuideVideo();
  return /* @__PURE__ */ u$1(
    ReactObsidianModal,
    {
      title: "User Guide",
      onClose: () => onClose(),
      children: /* @__PURE__ */ u$1(k$3, { children: [
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "How this plugin does work",
            setHeading: true
          }
        ),
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            addMultiDesc: (multiDesc) => {
              multiDesc.addDesc(
                "This plugin stores data related to your selected elements."
              );
              multiDesc.addDesc(
                "When you open another Markdown file with a diagram code in it and switch to preview mode, the plugin attempts to find the corresponding diagram in preview."
              );
              multiDesc.addDesc(
                "If a matching diagram is found, the plugin creates a container, applies CSS styles, and enables diagram movement, zooming, and adds a control panel."
              );
              return multiDesc;
            }
          }
        ),
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "How to find selectors in DevTool",
            setHeading: true,
            desc: "To identify the CSS selectors for diagrams on this page, follow these steps below using your browser\u2019s DevTools:"
          }
        ),
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "Steps to find selectors:",
            addMultiDesc: (multiDesc) => {
              multiDesc.addDesc(
                "1. Open the markdown file in Obsidian where the diagram is. You should switch to preview mode."
              );
              multiDesc.addDesc(
                "2. Open the DevTools window. You can do it by pressing CTRL + SHIFT + I."
              );
              multiDesc.addDesc(
                '3. Click the "Select an element on this page to inspect it" button (usually a arrow icon) in the top-left corner of the DevTools window. You can also press CTRL + SHIFT + C'
              );
              multiDesc.addDesc(
                "4. Move your cursor over the diagram and click on it to select the element."
              );
              multiDesc.addDesc(
                "5. In the Elements tab of DevTools, you will see the HTML element corresponding to the diagram highlighted."
              );
              multiDesc.addDesc(
                '6. Look for the "class" attribute in the highlighted element. Common examples: `.mermaid`, `.block-language-plantuml`, `#chart-svg`'
              );
              return multiDesc;
            }
          }
        ),
        isLoading && /* @__PURE__ */ u$1("p", { children: "Loading video..." }),
        !isLoading && videoUrl && /* @__PURE__ */ u$1(
          "video",
          {
            src: videoUrl,
            controls: true,
            autoPlay: false,
            style: { width: "100%", maxHeight: "400px" }
          }
        ),
        !isLoading && !videoUrl && /* @__PURE__ */ u$1("p", { children: "Video failed to load. Please try again later." })
      ] })
    }
  );
};

const AddNewUnit = () => {
  const { plugin } = useSettingsContext();
  const [guideOpen, setGuideOpen] = d(false);
  const {
    validateSelector,
    validateBoth,
    validateName,
    processSelectorValidation,
    processNameValidation,
    processBothValidation
  } = useUnitsValidation();
  const { units, saveUnits } = useUnitsManagerContext();
  const { updateUndoStack } = useUnitsHistoryContext();
  const addingUnitWrapperRef = A$2(null);
  const handleAddUnit = async () => {
    if (addingUnitWrapperRef.current === null) {
      return;
    }
    const nameInput = addingUnitWrapperRef.current.querySelector(
      "#unit-name"
    );
    const selectorInput = addingUnitWrapperRef.current.querySelector(
      "#unit-selector"
    );
    if (!nameInput || !selectorInput) {
      return;
    }
    const validationResult = validateBoth(
      nameInput.value,
      selectorInput.value
    );
    const validated = processBothValidation(
      nameInput,
      selectorInput,
      validationResult
    );
    if (!validated) {
      return;
    }
    const oldUnits = [...units];
    const newUnit = {
      name: nameInput.value,
      selector: selectorInput.value,
      on: true,
      panels: {
        move: {
          on: true
        },
        zoom: {
          on: true
        },
        service: {
          on: true
        }
      }
    };
    const newUnits = [...units, newUnit];
    await saveUnits(newUnits);
    updateUndoStack(
      oldUnits,
      `Add unit
Name: ${newUnit.name}
Selector: ${newUnit.selector}`
    );
    plugin.showNotice("New interactive unit was added");
    nameInput.value = "";
    selectorInput.value = "";
  };
  const onKeyDown = async (e) => {
    if (e.code === "Enter") {
      if (addingUnitWrapperRef.current === null) {
        return;
      }
      const isAnyInputsFocused = !!addingUnitWrapperRef.current.querySelector("input:focus");
      if (isAnyInputsFocused) {
        e.preventDefault();
        await handleAddUnit();
      }
    }
  };
  return /* @__PURE__ */ u$1(
    "div",
    {
      onKeyDown,
      ref: addingUnitWrapperRef,
      children: [
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "Add new image unit",
            setHeading: true,
            noBorder: true,
            desc: "Here you can configure which images will receive enhanced controls and UI.",
            addMultiDesc: (multiDesc) => {
              multiDesc.addDescriptions([
                "Adding a Unit Type:",
                "1. Enter a unique name using only Latin letters, numbers and `-` (A-Z, a-z, 0-9, -)",
                "2. Specify a valid CSS selector for your unit",
                "Once added, matching units will get:",
                "\u2022 Mouse and keyboard navigation",
                "\u2022 Additional control buttons",
                "Note: Red border indicates invalid input - hover to see details"
              ]);
              return multiDesc;
            }
          }
        ),
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            addTexts: [
              (name) => {
                name.inputEl.id = "unit-name";
                name.setPlaceholder("Example Unit");
                name.onChange((text) => {
                  name.setValue(text);
                  const validationResult = validateName(
                    name.getValue()
                  );
                  processNameValidation(
                    name.inputEl,
                    validationResult
                  );
                });
                return name;
              },
              (selector) => {
                selector.inputEl.id = "unit-selector";
                selector.setPlaceholder(".example-unit");
                selector.onChange((text) => {
                  selector.setValue(text);
                  const validationResult = validateSelector(
                    selector.getValue()
                  );
                  processSelectorValidation(
                    selector.inputEl,
                    validationResult
                  );
                });
                return selector;
              }
            ],
            addButtons: [
              (button) => {
                button.setIcon("save");
                button.setTooltip("Add this unit");
                button.onClick(async () => {
                  await handleAddUnit();
                });
                return button;
              }
            ],
            addExtraButtons: [
              obsidian.Platform.isDesktopApp && ((extra) => {
                extra.setIcon("info");
                extra.setTooltip(
                  "Click for more information on how the plugin works and how you can find image unit selectors"
                );
                extra.onClick(() => {
                  setGuideOpen(true);
                });
                return extra;
              })
            ]
          }
        ),
        guideOpen && /* @__PURE__ */ u$1(UserGuideModal, { onClose: () => setGuideOpen(false) })
      ]
    }
  );
};

/**
 * @license lucide-react v0.522.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};

/**
 * @license lucide-react v0.522.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

const Icon = D$1(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => _$2(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => _$2(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);

const createLucideIcon = (iconName, iconNode) => {
  const Component = D$1(
    ({ className, ...props }, ref) => _$2(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};

const __iconNode$3 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$3);

const __iconNode$2 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$2);

const __iconNode$1 = [
  ["path", { d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8", key: "1p45f6" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }]
];
const RotateCw = createLucideIcon("rotate-cw", __iconNode$1);

const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode);

const ButtonContainer = dt.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    padding-bottom: 20px;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1px;
        background-color: var(--color-base-30);
        margin-top: 20px;
    }
`;
const PaginationButton = dt.button`
    &:disabled {
        background-color: var(--color-base-50);
        cursor: not-allowed;
    }
`;
const UndoButton = dt.button`
    margin-right: auto; /* Прижимаем к левому краю */
    &:disabled {
        background-color: var(--color-base-50);
        cursor: not-allowed;
    }
`;
const RedoButton = dt.button`
    margin-left: auto; /* Прижимаем к правому краю */
    &:disabled {
        background-color: var(--color-base-50);
        cursor: not-allowed;
    }
`;
const PaginationControls = dt.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const useUnitOperations = () => {
  const { plugin } = useSettingsContext();
  const { validateBoth, processBothValidation } = useUnitsValidation();
  const { units, saveUnits } = useUnitsManagerContext();
  const { updateUndoStack } = useUnitsHistoryContext();
  const handleDelete = async (index) => {
    const oldUnits = [...units];
    const newUnits = [...units];
    const deleted = newUnits[index];
    newUnits.splice(index, 1);
    await saveUnits(newUnits);
    updateUndoStack(
      oldUnits,
      `Delete unit
\`Name: ${deleted.name}
Selector: ${deleted.selector}\``
    );
  };
  const handleToggle = async (index, value) => {
    const oldUnits = createSettingsProxy(
      plugin,
      JSON.parse(JSON.stringify(units)),
      [plugin.settings.events.units.configs]
    );
    units[index].on = value;
    await saveUnits([...units]);
    updateUndoStack(
      oldUnits,
      `${value ? "Enable" : "Disable"} ${units[index].name} unit`
    );
  };
  const handleSaveEditing = async (index) => {
    const oldUnit = units[index];
    const editingNameInput = document.querySelector("#editing-name-input");
    const editingSelectorInput = document.querySelector("#editing-selector-input");
    if (!editingNameInput || !editingSelectorInput) {
      return;
    }
    const validationResult = validateBoth(
      editingNameInput.value,
      editingSelectorInput.value,
      oldUnit
    );
    const validated = processBothValidation(
      editingNameInput,
      editingSelectorInput,
      validationResult
    );
    if (validated) {
      const oldName = oldUnit.name;
      const oldSelector = oldUnit.selector;
      const nameChanged = oldName !== editingNameInput.value;
      const selectorChanged = oldSelector !== editingSelectorInput.value;
      units[index].name = editingNameInput.value;
      units[index].selector = editingSelectorInput.value;
      await saveUnits([...units]);
      editingNameInput.removeAttribute("id");
      editingSelectorInput.removeAttribute("id");
      const changes = [];
      if (nameChanged) {
        changes.push(`name: "${oldName}" \u2192 "${units[index].name}"`);
      }
      if (selectorChanged) {
        changes.push(
          `selector: "${oldSelector}" \u2192 "${units[index].selector}"`
        );
      }
      updateUndoStack(
        units,
        `Edit unit "${units[index].name}":
${changes.join("\n")}`
      );
    }
    return validated;
  };
  return {
    handleDelete,
    handleToggle,
    handleSaveEditing
  };
};

const UnitItem = ({
  unit,
  index,
  modeState,
  setModeState
}) => {
  const {
    validateName,
    validateSelector,
    processNameValidation,
    processSelectorValidation
  } = useUnitsValidation();
  const { handleSaveEditing, handleDelete, handleToggle } = useUnitOperations();
  const editingItemRef = A$2(null);
  const onKeyDown = async (e) => {
    if (e.code === "Enter") {
      const editingItem = editingItemRef.current;
      if (!editingItem) {
        return;
      }
      const isAnyInputFocused = !!editingItem.querySelector("input:focus");
      if (isAnyInputFocused) {
        e.preventDefault();
        await handleSaveEditing(index);
      }
    }
  };
  return modeState.index === index && modeState.mode === "edit" ? /* @__PURE__ */ u$1(
    "div",
    {
      onKeyDown,
      ref: editingItemRef,
      children: /* @__PURE__ */ u$1(
        ReactObsidianSetting,
        {
          addTexts: [
            (nameInput) => {
              nameInput.setValue(unit.name);
              nameInput.inputEl.id = "editing-name-input";
              nameInput.onChange((value) => {
                const result = validateName(value, unit);
                processNameValidation(nameInput.inputEl, result);
              });
              return nameInput;
            },
            (selectorInput) => {
              selectorInput.setValue(unit.selector);
              selectorInput.inputEl.id = "editing-selector-input";
              selectorInput.onChange((value) => {
                const validationResult = validateSelector(
                  value,
                  unit
                );
                processSelectorValidation(
                  selectorInput.inputEl,
                  validationResult
                );
              });
              return selectorInput;
            }
          ],
          addButtons: [
            (button) => {
              button.setIcon("circle-x");
              button.setTooltip(
                "Cancel operation? All changes will be lost."
              );
              button.onClick(() => {
                setModeState({
                  index: -1,
                  mode: "none"
                });
              });
              return button;
            },
            (button) => {
              button.setIcon("save");
              button.setTooltip(`Save changes for ${unit.name}?`);
              button.onClick(async (cb) => {
                await handleSaveEditing(index);
                setModeState({
                  index: -1,
                  mode: "none"
                });
              });
              return button;
            }
          ]
        }
      )
    }
  ) : /* @__PURE__ */ u$1(
    ReactObsidianSetting,
    {
      name: unit.name,
      desc: unit.selector,
      addToggles: [
        (toggle) => {
          toggle.setValue(unit.on);
          toggle.setTooltip(
            `${unit.on ? "Disable" : "Enable"} ${unit.name} unit`
          );
          toggle.onChange(async (value) => {
            await handleToggle(index, value);
          });
          return toggle;
        }
      ],
      addButtons: [
        ![UnitConfigs.IMG_SVG, UnitConfigs.Default].contains(
          unit.selector
        ) && ((button) => {
          button.setIcon("edit");
          button.setTooltip(`Edit ${unit.name} unit`);
          button.onClick(async () => {
            setModeState({
              index,
              mode: "edit"
            });
          });
          return button;
        }),
        ![UnitConfigs.IMG_SVG, UnitConfigs.Default].contains(
          unit.selector
        ) && ((button) => {
          button.setIcon("trash");
          button.setTooltip(`Delete ${unit.name} unit`);
          button.onClick(async () => {
            await handleDelete(index);
          });
          return button;
        })
      ],
      addExtraButtons: [
        (button) => {
          button.setTooltip(`Options for ${unit.name} unit`);
          button.onClick(() => {
            setModeState({
              index,
              mode: "options"
            });
          });
          return button;
        }
      ]
    }
  );
};

const usePagination = ({
  itemsPerPage,
  totalItems
}) => {
  const [page, setPage] = d(1);
  const [delta, setDelta] = d(0);
  const totalPages = T$2(
    () => Math.max(1, Math.ceil(totalItems / itemsPerPage)),
    [totalItems, itemsPerPage]
  );
  const pageStartIndex = T$2(
    () => (page - 1) * itemsPerPage,
    [page, itemsPerPage]
  );
  const pageEndIndex = T$2(
    () => pageStartIndex + itemsPerPage,
    [pageStartIndex, itemsPerPage]
  );
  y$1(() => {
    const newTotalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    setPage((prevPage) => Math.min(prevPage, newTotalPages));
  }, [itemsPerPage, totalItems]);
  const navigateToPage = (delta2) => {
    setPage((prev) => Math.min(totalPages, Math.max(prev + delta2, 1)));
  };
  return {
    page,
    pageStartIndex,
    pageEndIndex,
    delta,
    setDelta,
    totalPages,
    navigateToPage
  };
};

const UnitOptionsModal = ({
  unitIndex,
  onClose,
  onChanges
}) => {
  const { plugin } = useSettingsContext();
  const { units } = useUnitsManagerContext();
  const unit = T$2(() => units[unitIndex], [unitIndex]);
  return /* @__PURE__ */ u$1(
    ReactObsidianModal,
    {
      onClose,
      title: `${unit.name} unit options`,
      children: [
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            desc: "These settings will only apply to this unit."
          }
        ),
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "Panels",
            setHeading: true
          }
        ),
        Object.entries(unit.panels).map(([panel, { on }]) => /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: panel.charAt(0).toUpperCase().concat(panel.slice(1).toLowerCase()),
            addToggles: [
              (toggle) => {
                toggle.setValue(on);
                toggle.onChange(async (value) => {
                  const oldUnits = createSettingsProxy(
                    plugin,
                    JSON.parse(JSON.stringify(units)),
                    [plugin.settings.events.units.configs]
                  );
                  plugin.settings.data.units.configs[unitIndex].panels[panel].on = value;
                  await plugin.settings.saveSettings();
                  onChanges(
                    oldUnits,
                    `Turn ${!value ? "off" : "on"} panel \`${panel}\` for unit \`${unit.name}\``
                  );
                });
                return toggle;
              }
            ]
          },
          panel
        ))
      ]
    }
  );
};

const AvailableUnits = () => {
  const { plugin } = useSettingsContext();
  const [unitsPerPage, setUnitsPerPage] = d(
    plugin.settings.data.units.settingsPagination.perPage
  );
  const { units } = useUnitsManagerContext();
  const [modeState, setModeState] = d({
    mode: "none",
    index: -1
  });
  const { navigateToPage, totalPages, pageStartIndex, pageEndIndex, page } = usePagination({
    itemsPerPage: unitsPerPage,
    totalItems: units.length
  });
  const {
    updateUndoStack,
    undo,
    canUndo,
    canRedo,
    getRedoLabel,
    redo,
    getUndoLabel
  } = useUnitsHistoryContext();
  y$1(() => {
    const handler = async () => {
      setUnitsPerPage(
        plugin.settings.data.units.settingsPagination.perPage
      );
    };
    plugin.settings.eventBus.on(
      plugin.settings.events.units.settingsPagination.perPage.$path,
      handler
    );
    return () => {
      plugin.settings.eventBus.off(
        plugin.settings.events.units.settingsPagination.perPage.$path,
        handler
      );
    };
  }, [plugin]);
  const visibleDUnits = T$2(() => {
    return units.slice(pageStartIndex, pageEndIndex);
  }, [units, pageStartIndex, pageEndIndex]);
  const getPageChangeButtonLabel = (type) => {
    const canChange = type === "next" ? page < totalPages : page > 1;
    const base = canChange ? `Go to ${type} page` : `No ${type} page`;
    const isOccupied = modeState.mode === "edit";
    if (isOccupied && canChange) {
      return `Can't change page while editing`;
    }
    return base;
  };
  return /* @__PURE__ */ u$1(k$3, { children: [
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Available image configs",
        setHeading: true
      }
    ),
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Image configs per page",
        setDisabled: modeState.mode === "edit",
        addSliders: [
          (slider) => {
            slider.setValue(
              plugin.settings.data.units.settingsPagination.perPage
            );
            slider.setLimits(1, 50, 1);
            slider.setDynamicTooltip();
            slider.onChange(async (value) => {
              plugin.settings.data.units.settingsPagination.perPage = value;
              await plugin.settings.saveSettings();
            });
            return slider;
          }
        ]
      }
    ),
    /* @__PURE__ */ u$1(ButtonContainer, { children: [
      /* @__PURE__ */ u$1(
        UndoButton,
        {
          onClick: undo,
          disabled: !canUndo,
          "aria-label": getUndoLabel(),
          children: /* @__PURE__ */ u$1(RotateCcw, { size: "20px" })
        }
      ),
      /* @__PURE__ */ u$1(PaginationControls, { children: [
        /* @__PURE__ */ u$1(
          PaginationButton,
          {
            onClick: () => navigateToPage(-1),
            disabled: page === 1 || modeState.mode === "edit",
            "aria-label": getPageChangeButtonLabel("previous"),
            children: /* @__PURE__ */ u$1(ArrowLeft, { size: "20px" })
          }
        ),
        `Page ${page} of ${totalPages} (Total image configs: ${units.length})`,
        /* @__PURE__ */ u$1(
          PaginationButton,
          {
            onClick: () => navigateToPage(1),
            disabled: page === totalPages || modeState.mode === "edit",
            "aria-label": getPageChangeButtonLabel("next"),
            children: /* @__PURE__ */ u$1(ArrowRight, { size: "20px" })
          }
        )
      ] }),
      /* @__PURE__ */ u$1(
        RedoButton,
        {
          disabled: !canRedo,
          onClick: redo,
          "aria-label": getRedoLabel(),
          children: /* @__PURE__ */ u$1(RotateCw, { size: "20px" })
        }
      )
    ] }),
    visibleDUnits.map((unit, index) => /* @__PURE__ */ u$1(
      UnitItem,
      {
        unit,
        index: pageStartIndex + index,
        modeState,
        setModeState
      },
      `${unit.name}-${unit.selector}`
    )),
    modeState.mode === "options" && modeState.index !== -1 && /* @__PURE__ */ u$1(
      UnitOptionsModal,
      {
        unitIndex: modeState.index,
        onChanges: updateUndoStack,
        onClose: () => {
          setModeState({
            mode: "none",
            index: -1
          });
        }
      }
    )
  ] });
};

const Management$1 = () => {
  const { units, saveUnits } = useUnitsManagerContext();
  return /* @__PURE__ */ u$1(
    UnitsHistoryProvider,
    {
      state: units,
      updateState: saveUnits,
      children: [
        /* @__PURE__ */ u$1(AddNewUnit, {}),
        /* @__PURE__ */ u$1(AvailableUnits, {})
      ]
    }
  );
};

const Folding = () => {
  const { plugin } = useSettingsContext();
  return /* @__PURE__ */ u$1(k$3, { children: [
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Fold",
        setHeading: true
      }
    ),
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Fold images by default",
        addToggles: [
          (toggle) => {
            toggle.setValue(
              plugin.settings.data.units.folding.foldByDefault
            ).onChange(async (value) => {
              plugin.settings.data.units.folding.foldByDefault = value;
              await plugin.settings.saveSettings();
            });
            return toggle;
          }
        ]
      }
    ),
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Automatically fold images on focus change",
        addToggles: [
          (toggle) => {
            toggle.setValue(
              plugin.settings.data.units.folding.autoFoldOnFocusChange
            ).onChange(async (value) => {
              plugin.settings.data.units.folding.autoFoldOnFocusChange = value;
              await plugin.settings.saveSettings();
            });
            return toggle;
          }
        ]
      }
    )
  ] });
};

var ComponentType = /* @__PURE__ */ ((ComponentType2) => {
  ComponentType2["Folded"] = "folded";
  ComponentType2["Expanded"] = "expanded";
  return ComponentType2;
})(ComponentType || {});

const dimensionSpec = {
  px: {
    min: 100,
    max: 1e3,
    label: "px",
    rangeMessage: "100-1000px"
  },
  "%": {
    min: 10,
    max: 100,
    label: "%",
    rangeMessage: "10-100%"
  }
};
const getRangeMessage = (unit) => dimensionSpec[unit].rangeMessage;
const isDimensionInValidRange = (value, unit) => {
  const n = parseInt(value, 10);
  const { min, max } = dimensionSpec[unit];
  return n >= min && n <= max;
};
const getErrorMessage = (field, unit) => `Invalid ${field}. Please enter number in range ${getRangeMessage(unit)}.`;
const DimensionsOption = ({
  type,
  initialOptions
}) => {
  const { plugin } = useSettingsContext();
  const hasValidationErrorsRef = A$2(false);
  const [heightUnit, setHeightUnit] = d(initialOptions.height.unit);
  const [widthUnit, setWidthUnit] = d(initialOptions.width.unit);
  const heightValueRef = A$2(initialOptions.height.value);
  const widthValueRef = A$2(initialOptions.width.value);
  const inputsRef = A$2(null);
  const prefix = T$2(
    () => type === ComponentType.Folded ? "Folded" : "Expanded",
    [type]
  );
  const validateDimensionInput = q$2(
    (inputEl, field, unit) => {
      const value = inputEl.value;
      const isValid = isDimensionInValidRange(value, unit);
      if (!isValid) {
        inputEl.addClass("invalid");
        obsidian.setTooltip(inputEl, getErrorMessage(field, unit));
        hasValidationErrorsRef.current = true;
      } else {
        inputEl.removeClass("invalid");
        obsidian.setTooltip(inputEl, "");
        hasValidationErrorsRef.current = false;
      }
    },
    []
  );
  const validateAllFields = (widthInput, heightInput) => {
    const widthValid = isDimensionInValidRange(widthInput.value, widthUnit);
    const heightValid = isDimensionInValidRange(
      heightInput.value,
      heightUnit
    );
    return widthValid && heightValid;
  };
  y$1(() => {
    const widthInput = inputsRef.current?.querySelector(
      "#input-width"
    );
    const heightInput = inputsRef.current?.querySelector(
      "#input-height"
    );
    if (widthInput?.value) {
      validateDimensionInput(widthInput, "width", widthUnit);
    }
    if (heightInput?.value) {
      validateDimensionInput(heightInput, "height", heightUnit);
    }
  }, [widthUnit, heightUnit]);
  const handleSave = async () => {
    if (!inputsRef.current) {
      return;
    }
    const widthInput = inputsRef.current.querySelector(
      "#input-width"
    );
    const heightInput = inputsRef.current.querySelector(
      "#input-height"
    );
    const isValid = validateAllFields(widthInput, heightInput);
    if (!isValid) {
      plugin.showNotice("Please fix validation errors");
      return;
    }
    const inputWidth = parseInt(widthInput.value, 10);
    const inputHeight = parseInt(heightInput.value, 10);
    if (inputWidth === initialOptions.width.value && inputHeight === initialOptions.height.value && widthUnit === initialOptions.width.unit && heightUnit === initialOptions.height.unit) {
      plugin.showNotice("Nothing to save");
      return;
    }
    initialOptions.width.value = inputWidth;
    initialOptions.height.value = inputHeight;
    initialOptions.width.unit = widthUnit;
    initialOptions.height.unit = heightUnit;
    if (type === ComponentType.Folded) {
      plugin.settings.data.units.size.folded = initialOptions;
    } else {
      plugin.settings.data.units.size.expanded = initialOptions;
    }
    await plugin.settings.saveSettings();
    plugin.showNotice("Saved successfully");
  };
  const onKeyDown = async (e) => {
    if (e.code === "Enter") {
      if (!inputsRef.current) {
        return;
      }
      const isAnyFocused = !!inputsRef.current.querySelector("input:focus");
      if (isAnyFocused) {
        e.preventDefault();
        await handleSave();
      }
    }
  };
  return /* @__PURE__ */ u$1(k$3, { children: [
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: `${prefix} image unit container size`,
        addMultiDesc: (multiDesc) => {
          multiDesc.addDescriptions([
            `Set the container dimensions for ${prefix.toLowerCase()} state.`,
            `px: 100-1000, %: 10-100`,
            "Click Save button or press Enter to apply changes."
          ]);
          return multiDesc;
        },
        noBorder: true
      }
    ),
    /* @__PURE__ */ u$1(
      "div",
      {
        onKeyDown,
        ref: inputsRef,
        children: /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            addTexts: [
              (inputHeight) => {
                const parent = inputHeight.inputEl.parentElement;
                inputHeight.inputEl.id = "input-height";
                const label = document.createElement("label");
                label.textContent = "Height:";
                parent.insertBefore(label, inputHeight.inputEl);
                inputHeight.setValue(
                  heightValueRef.current.toString()
                );
                inputHeight.setPlaceholder("height");
                inputHeight.onChange((value) => {
                  const replaced = value.replace(/\D/, "");
                  inputHeight.setValue(replaced);
                  heightValueRef.current = parseInt(replaced, 10);
                  validateDimensionInput(
                    inputHeight.inputEl,
                    "height",
                    heightUnit
                  );
                });
                return inputHeight;
              },
              (inputWidth) => {
                const wrapper = inputWidth.inputEl.parentElement;
                inputWidth.inputEl.id = "input-width";
                const label = document.createElement("label");
                label.textContent = "Width:";
                wrapper.insertBefore(label, inputWidth.inputEl);
                inputWidth.setValue(
                  widthValueRef.current.toString()
                );
                inputWidth.setPlaceholder("width");
                inputWidth.onChange((value) => {
                  const replaced = value.replace(/\D/, "");
                  inputWidth.setValue(replaced);
                  widthValueRef.current = parseInt(replaced, 10);
                  validateDimensionInput(
                    inputWidth.inputEl,
                    "width",
                    widthUnit
                  );
                });
                return inputWidth;
              }
            ],
            addDropdowns: [
              (dropdown) => {
                dropdown.addOptions({ px: "px", "%": "%" });
                dropdown.setValue(heightUnit);
                dropdown.onChange((value) => {
                  setHeightUnit(value);
                });
                return dropdown;
              },
              (dropdown) => {
                dropdown.addOptions({ px: "px", "%": "%" });
                dropdown.setValue(widthUnit);
                dropdown.onChange((value) => {
                  setWidthUnit(value);
                });
                return dropdown;
              }
            ],
            addButtons: [
              (button) => {
                button.setIcon("save");
                button.onClick(handleSave);
                return button;
              }
            ]
          }
        )
      }
    )
  ] });
};

const Size = () => {
  const { plugin } = useSettingsContext();
  return /* @__PURE__ */ u$1(k$3, { children: [
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Image unit size",
        addMultiDesc: (multidesc) => {
          multidesc.addDescriptions([
            "Note: You need to reopen all the open Markdown views with images in them to apply these settings."
          ]);
          return multidesc;
        },
        setHeading: true
      }
    ),
    /* @__PURE__ */ u$1(
      DimensionsOption,
      {
        type: ComponentType.Expanded,
        initialOptions: plugin.settings.data.units.size.expanded
      }
    ),
    /* @__PURE__ */ u$1(
      DimensionsOption,
      {
        type: ComponentType.Folded,
        initialOptions: plugin.settings.data.units.size.folded
      }
    )
  ] });
};

const Interactive = () => {
  const { plugin } = useSettingsContext();
  const [isIMOptionEnabled, setIsIMOptionEnabled] = d(
    plugin.settings.data.units.interactivity.markdown.autoDetect
  );
  const [activationMode, setActivationMode] = d(
    plugin.settings.data.units.interactivity.markdown.activationMode
  );
  const [activationModeTooltip, setActivationModeTooltip] = d("");
  const activationModeTooltips = T$2(
    () => ({
      immediate: "Images become interactive instantly when detected. Best for small notes.",
      lazy: "Images become interactive only when scrolled into view. Best for notes with many images."
    }),
    []
  );
  const updateActivationModeTooltip = q$2(
    (dropdown) => {
      const selectedValue = dropdown.selectEl.options[dropdown.selectEl.options.selectedIndex].value;
      setActivationModeTooltip(activationModeTooltips[selectedValue]);
    },
    []
  );
  return /* @__PURE__ */ u$1(k$3, { children: [
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Interactivity options",
        setHeading: true
      }
    ),
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Enable picker mode",
        addMultiDesc: (m) => {
          m.addDescriptions([
            "Adds a ribbon button and command palette entry for toggling picker mode.",
            "When activated, hover over images/SVG elements to see availability status, then click to initialize or toggle interactivity."
          ]);
          return m;
        },
        addToggles: [
          (t) => {
            t.setValue(
              plugin.settings.data.units.interactivity.picker.enabled
            );
            t.onChange(async (value) => {
              plugin.settings.data.units.interactivity.picker.enabled = value;
              await plugin.settings.saveSettings();
            });
            return t;
          }
        ]
      }
    ),
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Auto-detect images",
        addMultiDesc: (m) => {
          m.addDescriptions([
            "* This option is available only for Obsidian Markdown View",
            "When enabled, the plugin will automatically scan and prepare all suitable images for potential interactivity."
          ]);
          return m;
        },
        addToggles: [
          (toggle) => {
            toggle.setValue(
              plugin.settings.data.units.interactivity.markdown.autoDetect
            );
            toggle.onChange(async (value) => {
              setIsIMOptionEnabled(value);
              plugin.settings.data.units.interactivity.markdown.autoDetect = value;
              await plugin.settings.saveSettings();
            });
            return toggle;
          }
        ]
      }
    ),
    isIMOptionEnabled && /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Activation mode for Obsidian Markdown View",
        desc: "Live Preview mode uses lazy loading by default",
        addButtons: [
          (button) => {
            button.setIcon("message-circle-question");
            button.setTooltip(activationModeTooltip);
            return button;
          }
        ],
        addDropdowns: [
          (dropdown) => {
            dropdown.addOptions({
              immediate: "Immediate",
              lazy: "Lazy"
            });
            dropdown.setValue(
              plugin.settings.data.units.interactivity.markdown.activationMode
            );
            updateActivationModeTooltip(dropdown);
            dropdown.onChange(async (value) => {
              const mode = value;
              setActivationMode(mode);
              plugin.settings.data.units.interactivity.markdown.activationMode = mode;
              await plugin.settings.saveSettings();
              updateActivationModeTooltip(dropdown);
            });
            return dropdown;
          }
        ]
      }
    )
  ] });
};

const Settings$1 = () => {
  return /* @__PURE__ */ u$1(k$3, { children: [
    /* @__PURE__ */ u$1(Interactive, {}),
    /* @__PURE__ */ u$1(Size, {}),
    /* @__PURE__ */ u$1(Folding, {})
  ] });
};

const Elements = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return /* @__PURE__ */ u$1(UnitsManagerProvider, { children: [
    /* @__PURE__ */ u$1(MiniNavbar$1, { children: /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        addButtons: [
          (button) => {
            button.setIcon("settings");
            button.setTooltip("Settings");
            button.onClick(async () => {
              await navigate("/units/settings");
            });
            if (location.pathname === "/units" || location.pathname === "/units/settings") {
              button.setClass("button-active");
            }
            return button;
          },
          (button) => {
            button.setIcon("folder-plus");
            button.setTooltip("Images management");
            button.onClick(async () => {
              await navigate("/units/management");
            });
            if (location.pathname === "/units/management") {
              button.setClass("button-active");
            }
            return button;
          }
        ]
      }
    ) }),
    /* @__PURE__ */ u$1(Routes, { location, children: [
      /* @__PURE__ */ u$1(
        Route,
        {
          index: true,
          element: /* @__PURE__ */ u$1(Settings$1, {})
        }
      ),
      /* @__PURE__ */ u$1(
        Route,
        {
          path: "settings",
          element: /* @__PURE__ */ u$1(Settings$1, {})
        }
      ),
      /* @__PURE__ */ u$1(
        Route,
        {
          path: "management",
          element: /* @__PURE__ */ u$1(Management$1, {})
        }
      )
    ] })
  ] });
};

const MiniNavbar = dt.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid var(--color-base-30);

    .button-active {
        background: var(--interactive-accent);
        color: var(--text-on-accent);
        transform: scale(1.05);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    button {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
    }
`;

const UI_PRIORITY = {
  TOGGLE: 1,
  BUTTON: 2
};
const ButtonManagementModal = ({
  onClose,
  title
}) => {
  const { plugin } = useSettingsContext();
  const buttonData = Rn.useMemo(() => {
    const { zoom, move, service } = plugin.settings.data.panels.local.panels;
    return {
      zoom: [
        {
          tooltip: "Zoom In",
          icon: "zoom-in",
          getValue: () => zoom.buttons.in,
          setValue: (v) => zoom.buttons.in = v
        },
        {
          tooltip: "Zoom Out",
          icon: "zoom-out",
          getValue: () => zoom.buttons.out,
          setValue: (v) => zoom.buttons.out = v
        },
        {
          tooltip: "Reset",
          icon: "refresh-cw",
          getValue: () => zoom.buttons.reset,
          setValue: (v) => zoom.buttons.reset = v
        }
      ],
      move: [
        {
          tooltip: "Move Up",
          icon: "arrow-up",
          getValue: () => move.buttons.up,
          setValue: (v) => move.buttons.up = v
        },
        {
          tooltip: "Move Down",
          icon: "arrow-down",
          getValue: () => move.buttons.down,
          setValue: (v) => move.buttons.down = v
        },
        {
          tooltip: "Move Left",
          icon: "arrow-left",
          getValue: () => move.buttons.left,
          setValue: (v) => move.buttons.left = v
        },
        {
          tooltip: "Move Right",
          icon: "arrow-right",
          getValue: () => move.buttons.right,
          setValue: (v) => move.buttons.right = v
        },
        {
          tooltip: "Move Right Up",
          icon: "arrow-up-right",
          getValue: () => move.buttons.upRight,
          setValue: (v) => move.buttons.upRight = v
        },
        {
          tooltip: "Move Right Down",
          icon: "arrow-down-right",
          getValue: () => move.buttons.downRight,
          setValue: (v) => move.buttons.downRight = v
        },
        {
          tooltip: "Move Left Up",
          icon: "arrow-up-left",
          getValue: () => move.buttons.upLeft,
          setValue: (v) => move.buttons.upLeft = v
        },
        {
          tooltip: "Move Left Down",
          icon: "arrow-down-left",
          getValue: () => move.buttons.downLeft,
          setValue: (v) => move.buttons.downLeft = v
        }
      ],
      service: [
        {
          tooltip: "Hide",
          icon: "eye",
          getValue: () => service.buttons.hide,
          setValue: (v) => service.buttons.hide = v
        },
        {
          tooltip: "Fullscreen",
          icon: "fullscreen",
          getValue: () => service.buttons.fullscreen,
          setValue: (v) => service.buttons.fullscreen = v
        }
      ]
    };
  }, [plugin]);
  return /* @__PURE__ */ u$1(
    ReactObsidianModal,
    {
      title,
      onClose,
      children: [
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "Panel buttons section",
            setHeading: true
          }
        ),
        Object.entries(buttonData).map(([panel, panelData]) => /* @__PURE__ */ u$1(Rn.Fragment, { children: [
          /* @__PURE__ */ u$1(
            ReactObsidianSetting,
            {
              name: panel.charAt(0).toUpperCase().concat(panel.slice(1).toLowerCase()),
              setHeading: true
            }
          ),
          panelData.map(
            ({ tooltip, icon, getValue, setValue }, index) => /* @__PURE__ */ u$1(
              ReactObsidianSetting,
              {
                name: tooltip,
                noBorder: index !== panelData.length - 1,
                addButtons: [
                  {
                    priority: UI_PRIORITY.BUTTON,
                    callback: (button) => {
                      button.setIcon(icon);
                      button.setTooltip(tooltip);
                      return button;
                    }
                  }
                ],
                addToggles: [
                  {
                    priority: UI_PRIORITY.TOGGLE,
                    callback: (toggle) => {
                      toggle.setValue(getValue()).onChange(
                        async (value) => {
                          setValue(value);
                          await plugin.settings.saveSettings();
                        }
                      );
                      return toggle;
                    }
                  }
                ]
              },
              tooltip
            )
          )
        ] }, panel))
      ]
    }
  );
};

const UnitSetup = dt.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;
const UnitPreview = dt.div`
    position: relative;
    width: 400px;
    height: 300px;
    border: 2px solid var(--color-base-30);
    margin: 0 auto;
`;
const PanelPreview = dt.div`
    position: absolute;
    width: 60px;
    height: 40px; 
    padding: 8px;
    background: var(--color-base-20);
    border-radius: 4px;
    font-size: 0.9em;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: move;
    opacity: ${({ dragging }) => dragging ? 0.5 : 1};
    transition: ${({ dragging }) => dragging ? "all 0.3s ease" : "none"}}
`;
const FoldPanel = dt(PanelPreview)`
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    text-align: justify;
`;
const PanelControl = dt.div`
    display: flex;
    justify-content: center;
    gap: 20px;
`;
const PanelToggle = dt.label`
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 0.9em;
`;

const calculatePosition = (x, y, containerRect) => {
  const PANEL_WIDTH = 60;
  const PANEL_HEIGHT = 40;
  const SNAP_THRESHOLD = 30;
  const calculateVerticalPosition = (panelTop2, panelBottom2, containerHeight) => {
    if (panelTop2 <= SNAP_THRESHOLD) {
      return { top: "0px" };
    }
    if (containerHeight - panelBottom2 <= SNAP_THRESHOLD) {
      return { bottom: "0px" };
    }
    return { top: `${(panelTop2 / containerHeight * 100).toFixed(1)}%` };
  };
  const calculateHorizontalPosition = (panelLeft2, panelRight2, containerWidth) => {
    if (panelLeft2 <= SNAP_THRESHOLD) {
      return { left: "0px" };
    }
    if (containerWidth - panelRight2 <= SNAP_THRESHOLD) {
      return { right: "0px" };
    }
    return { left: `${(panelLeft2 / containerWidth * 100).toFixed(1)}%` };
  };
  const position = {};
  const panelLeft = x;
  const panelRight = x + PANEL_WIDTH;
  const panelTop = y;
  const panelBottom = y + PANEL_HEIGHT;
  const distanceToLeft = panelLeft;
  const distanceToRight = containerRect.width - panelRight;
  const distanceToTop = panelTop;
  const distanceToBottom = containerRect.height - panelBottom;
  const distances = [
    { edge: "left", value: distanceToLeft },
    { edge: "right", value: distanceToRight },
    { edge: "top", value: distanceToTop },
    { edge: "bottom", value: distanceToBottom }
  ];
  const closestEdge = distances.reduce(
    (a, b) => Math.abs(a.value) < Math.abs(b.value) ? a : b
  );
  if (Math.abs(closestEdge.value) <= SNAP_THRESHOLD) {
    switch (closestEdge.edge) {
      case "left":
        position.left = "0px";
        Object.assign(
          position,
          calculateVerticalPosition(
            panelTop,
            panelBottom,
            containerRect.height
          )
        );
        break;
      case "right":
        position.right = "0px";
        Object.assign(
          position,
          calculateVerticalPosition(
            panelTop,
            panelBottom,
            containerRect.height
          )
        );
        break;
      case "top":
        position.top = "0px";
        Object.assign(
          position,
          calculateHorizontalPosition(
            panelLeft,
            panelRight,
            containerRect.width
          )
        );
        break;
      case "bottom":
        position.bottom = "0px";
        Object.assign(
          position,
          calculateHorizontalPosition(
            panelLeft,
            panelRight,
            containerRect.width
          )
        );
        break;
    }
  } else {
    position.left = `${(panelLeft / containerRect.width * 100).toFixed(1)}%`;
    position.top = `${(panelTop / containerRect.height * 100).toFixed(1)}%`;
  }
  return position;
};
const useDragDrop = ({ unitPreviewRef, panels }) => {
  const { plugin } = useSettingsContext();
  const [draggedPanel, setDraggedPanel] = d(null);
  const handleDragStart = (e, panelName) => {
    const panel = e.currentTarget;
    const rect = panel.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        panelName,
        offsetX,
        offsetY
      })
    );
    setDraggedPanel(panelName);
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    if (!unitPreviewRef.current) {
      return;
    }
    const container = unitPreviewRef.current;
    const containerRect = container.getBoundingClientRect();
    const data = JSON.parse(
      e.dataTransfer.getData("application/json")
    );
    const x = e.clientX - containerRect.left - data.offsetX;
    const y = e.clientY - containerRect.top - data.offsetY;
    const position = calculatePosition(x, y, containerRect);
    const panelName = data.panelName;
    panels[panelName].position = position;
    setDraggedPanel(null);
    await plugin.settings.saveSettings();
  };
  const handleTouchStart = (e, panelName) => {
    const touch = e.touches[0];
    const panel = e.target;
    const rect = panel.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    setDraggedPanel(panelName);
    panel.dataset.dragData = JSON.stringify({
      panelName,
      offsetX,
      offsetY
    });
  };
  const handleTouchMove = (e) => {
    const container = unitPreviewRef.current;
    if (!container || draggedPanel) {
      return;
    }
    e.preventDefault();
    const touch = e.touches[0];
    const panel = e.currentTarget;
    const dragData = JSON.parse(panel.dataset.dragData ?? "{}");
    const containerRect = container.getBoundingClientRect();
    const x = touch.clientX - containerRect.left - dragData.offsetX;
    const y = touch.clientY - containerRect.top - dragData.offsetY;
    const position = calculatePosition(x, y, containerRect);
    panel.style.left = position.left;
    panel.style.top = position.top;
  };
  const handleTouchEnd = async (e) => {
    const container = unitPreviewRef.current;
    if (!container || !draggedPanel) {
      return;
    }
    const panel = e.currentTarget;
    const dragData = JSON.parse(panel.dataset.dragData ?? "{}");
    const touch = e.changedTouches[0];
    const containerRect = container.getBoundingClientRect();
    const x = touch.clientX - containerRect.left - dragData.offsetX;
    const y = touch.clientY - containerRect.top - dragData.offsetY;
    const position = calculatePosition(x, y, containerRect);
    const panelName = dragData.panelName;
    panels[panelName].position = position;
    setDraggedPanel(null);
    await plugin.settings.saveSettings();
  };
  const props = obsidian.Platform.isDesktopApp ? {
    panel: (name) => {
      return {
        draggable: true,
        onDragStart: (e) => handleDragStart(e, name)
      };
    },
    container: {
      onDrop: handleDrop,
      onDragOver: (e) => e.preventDefault()
    }
  } : {
    panel: (name) => {
      return {
        onTouchStart: (e) => handleTouchStart(e, name),
        onTouchMove: (e) => handleTouchMove(e),
        onTouchEnd: (e) => handleTouchEnd(e)
      };
    },
    container: {}
  };
  return {
    draggedPanel,
    props
  };
};

const PanelLayout = () => {
  const { plugin } = useSettingsContext();
  const [panels, setPanels] = d(
    plugin.settings.data.panels.local.panels
  );
  const [, setUpdateTrigger] = d(false);
  const unitPreviewRef = Rn.useRef(null);
  const { draggedPanel, props } = useDragDrop({
    unitPreviewRef,
    panels
  });
  y$1(() => {
    const handler = (p) => {
      setUpdateTrigger((prev) => !prev);
    };
    plugin.settings.eventBus.on(
      plugin.settings.events.panels.local.panels.$all,
      handler
    );
    return () => {
      plugin.settings.eventBus.off(
        plugin.settings.events.panels.local.panels.$all,
        handler
      );
    };
  }, []);
  const togglePanelState = async (panelName) => {
    panels[panelName].on = !panels[panelName].on;
    await plugin.settings.saveSettings();
  };
  return /* @__PURE__ */ u$1(UnitSetup, { children: [
    /* @__PURE__ */ u$1(
      UnitPreview,
      {
        ref: unitPreviewRef,
        onDragOver: (e) => e.preventDefault(),
        ...props.container,
        children: [
          Object.entries(panels).map(
            ([name, config]) => config.on && /* @__PURE__ */ u$1(
              PanelPreview,
              {
                dragging: draggedPanel === name,
                ...props.panel(name),
                style: {
                  ...config.position
                },
                children: name
              },
              name
            )
          ),
          /* @__PURE__ */ u$1(FoldPanel, { children: "fold" })
        ]
      }
    ),
    /* @__PURE__ */ u$1(PanelControl, { children: Object.entries(panels).map(([name, config]) => /* @__PURE__ */ u$1(PanelToggle, { children: [
      /* @__PURE__ */ u$1(
        "input",
        {
          type: "checkbox",
          checked: config.on,
          onChange: () => togglePanelState(name)
        }
      ),
      name
    ] }, name)) })
  ] });
};

const LayoutModal = ({ onClose, title }) => {
  return /* @__PURE__ */ u$1(
    ReactObsidianModal,
    {
      onClose,
      title,
      children: [
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "Panel configuration",
            desc: "Customize control panels appearance and position",
            setHeading: true,
            noBorder: true
          }
        ),
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "Available panels",
            addMultiDesc: (multiDesc) => {
              multiDesc.addDesc(
                "\u2022 Move Panel: By default located at bottom right - Contains 8 directional buttons for images movement"
              );
              multiDesc.addDesc(
                "\u2022 Zoom Panel: By default located at center right - Features zoom in/out and reset controls"
              );
              multiDesc.addDesc(
                "\u2022 Service Panel: By default located at upper right - Contains additional functionality buttons"
              );
              return multiDesc;
            },
            noBorder: true
          }
        ),
        /* @__PURE__ */ u$1(
          ReactObsidianSetting,
          {
            name: "How to customize panels",
            addMultiDesc: (multiDesc) => {
              multiDesc.addDesc(
                "1. Use checkboxes below to toggle panel visibility on/off"
              );
              multiDesc.addDesc(
                "2. Click and drag any panel to reposition it on the image unit"
              );
              multiDesc.addDesc(
                "3. Panel positions are saved automatically"
              );
              multiDesc.addDesc(
                "4. Reload the view to see your changes take effect"
              );
              return multiDesc;
            }
          }
        ),
        /* @__PURE__ */ u$1(PanelLayout, {})
      ]
    }
  );
};

const Management = () => {
  const { plugin } = useSettingsContext();
  const [layoutModalOpen, setLayoutModalOpen] = Rn.useState(false);
  const [buttonModalOpen, setButtonModalOpen] = Rn.useState(false);
  const isApplyingPreset = A$2(false);
  const presets = {
    mobile: {
      zoom: { in: true, out: true, reset: false },
      move: {
        up: false,
        down: false,
        left: false,
        right: false,
        upRight: false,
        downRight: false,
        upLeft: false,
        downLeft: false
      },
      service: { hide: true, fullscreen: false }
    },
    desktop: {
      zoom: { in: true, out: true, reset: true },
      move: {
        up: true,
        down: true,
        left: true,
        right: true,
        upRight: true,
        downRight: true,
        upLeft: true,
        downLeft: true
      },
      service: { hide: true, fullscreen: true }
    },
    presentation: {
      zoom: { in: true, out: true, reset: true },
      move: {
        up: false,
        down: false,
        left: false,
        right: false,
        upRight: false,
        downRight: false,
        upLeft: false,
        downLeft: false
      },
      service: { hide: true, fullscreen: true }
    }
  };
  y$1(() => {
    const handler = async (payload) => {
      if (isApplyingPreset.current) {
        return;
      }
      plugin.settings.data.panels.local.preset = "";
      await plugin.settings.saveSettings();
    };
    plugin.settings.eventBus.on(
      `${plugin.settings.events.panels.local.panels.$path}.**`,
      handler
    );
    return () => {
      plugin.settings.eventBus.off(
        `${plugin.settings.events.panels.local.panels.$path}.**`,
        handler
      );
    };
  }, [plugin, isApplyingPreset]);
  const applyPreset = async (preset) => {
    isApplyingPreset.current = true;
    const { zoom, move, service } = plugin.settings.data.panels.local.panels;
    const config = presets[preset];
    Object.assign(zoom.buttons, config.zoom);
    Object.assign(move.buttons, config.move);
    Object.assign(service.buttons, config.service);
    await plugin.settings.saveSettings();
    isApplyingPreset.current = false;
  };
  return /* @__PURE__ */ u$1(k$3, { children: [
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Apply preset",
        desc: "Apply button visibility preset",
        addDropdowns: [
          (dropdown) => {
            dropdown.addOption("", "Select preset...").addOption("mobile", "Mobile minimal").addOption("desktop", "Desktop full").addOption("presentation", "Presentation mode").setValue(plugin.settings.data.panels.local.preset).onChange(async (value) => {
              if (value) {
                plugin.settings.data.panels.local.preset = value;
                await applyPreset(
                  value
                );
              }
            });
            return dropdown;
          }
        ]
      }
    ),
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Panel layout",
        desc: "Adjust panel positions and visibility",
        addButtons: [
          (button) => {
            button.setIcon("layout");
            button.setTooltip("Open panel layout editor");
            button.onClick(() => {
              setLayoutModalOpen(true);
            });
            return button;
          }
        ]
      }
    ),
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Buttons layout",
        desc: "Configure which buttons are shown on each panel",
        addButtons: [
          (button) => {
            button.setIcon("panels-top-left");
            button.setTooltip("Open panel buttons editor");
            button.onClick(() => {
              setButtonModalOpen(true);
            });
            return button;
          }
        ]
      }
    ),
    layoutModalOpen && /* @__PURE__ */ u$1(
      LayoutModal,
      {
        onClose: () => setLayoutModalOpen(false),
        title: "Panel layout editor"
      }
    ),
    buttonModalOpen && /* @__PURE__ */ u$1(
      ButtonManagementModal,
      {
        onClose: () => setButtonModalOpen(false),
        title: "Panels buttons"
      }
    )
  ] });
};

const Settings = () => {
  const { plugin } = useSettingsContext();
  const [serviceOptionVisible, setServiceOptionVisible] = d(
    plugin.settings.data.panels.global.triggering.mode !== PanelsTriggering.ALWAYS
  );
  const [dropdownQuestionTooltip, setDropdownQuestionTooltip] = d("");
  const panelTriggeringOptionsTooltips = T$2(
    () => ({
      always: "Panels are always visible when this option is selected.",
      hover: "Panels become visible when hovering the mouse over the image unit. The service panel may remain hidden if the ignore option is enabled.",
      focus: "Panels become visible when the image unit is focused (e.g., clicked). The service panel may remain hidden if the ignore option is enabled."
    }),
    [plugin]
  );
  const extractTooltipDependsOnOption = q$2(
    (dropdown) => {
      const selectedValue = dropdown.selectEl.options[dropdown.selectEl.options.selectedIndex].value;
      const tooltip = panelTriggeringOptionsTooltips[selectedValue];
      setDropdownQuestionTooltip(tooltip);
    },
    [plugin]
  );
  return /* @__PURE__ */ u$1(k$3, { children: [
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Panels behavior",
        setHeading: true
      }
    ),
    /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Panels visibility",
        desc: "Control when panels will be visible",
        addDropdowns: [
          (dropdown) => {
            dropdown.addOptions({
              always: "Always",
              hover: "On hover",
              focus: "On focus"
            });
            dropdown.setValue(
              plugin.settings.data.panels.global.triggering.mode
            );
            extractTooltipDependsOnOption(dropdown);
            dropdown.onChange(async (value) => {
              plugin.settings.data.panels.global.triggering.mode = value;
              setServiceOptionVisible(
                value !== PanelsTriggering.ALWAYS
              );
              extractTooltipDependsOnOption(dropdown);
              await plugin.settings.saveSettings();
            });
            return dropdown;
          }
        ],
        addButtons: [
          (button) => {
            button.setIcon("message-circle-question");
            button.setTooltip(dropdownQuestionTooltip);
            return button;
          }
        ]
      }
    ),
    serviceOptionVisible && /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        name: "Ignore panel visibility rule for service panel",
        desc: "Service panel will always be visible regardless of visibility mode",
        addToggles: [
          (toggle) => {
            toggle.setValue(
              plugin.settings.data.panels.global.triggering.ignoreService
            );
            toggle.onChange(async (value) => {
              plugin.settings.data.panels.global.triggering.ignoreService = value;
              await plugin.settings.saveSettings();
            });
            return toggle;
          }
        ]
      }
    )
  ] });
};

const PanelSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSettingsActive = location.pathname === "/panel-section/settings" || location.pathname === "/panel-section";
  const isManagementActive = location.pathname === "/panel-section/management";
  return /* @__PURE__ */ u$1(k$3, { children: [
    /* @__PURE__ */ u$1(MiniNavbar, { children: /* @__PURE__ */ u$1(
      ReactObsidianSetting,
      {
        addButtons: [
          (button) => {
            button.setIcon("settings");
            button.setTooltip("Panels Settings");
            button.onClick(async () => {
              await navigate("/panel-section/settings");
            });
            if (isSettingsActive) {
              button.setClass("button-active");
            }
            return button;
          },
          (button) => {
            button.setIcon("folder-plus");
            button.setTooltip("Panels Management");
            button.onClick(async () => {
              await navigate("/panel-section/management");
            });
            if (isManagementActive) {
              button.setClass("button-active");
            }
            return button;
          }
        ]
      }
    ) }),
    /* @__PURE__ */ u$1(Routes, { children: [
      /* @__PURE__ */ u$1(
        Route,
        {
          index: true,
          element: /* @__PURE__ */ u$1(Settings, {})
        }
      ),
      /* @__PURE__ */ u$1(
        Route,
        {
          path: "settings",
          element: /* @__PURE__ */ u$1(Settings, {})
        }
      ),
      /* @__PURE__ */ u$1(
        Route,
        {
          path: "management",
          element: /* @__PURE__ */ u$1(Management, {})
        }
      )
    ] })
  ] });
};

const AnimatedRoutes = dt.div`
    &.fadeIn {
        animation: 0.25s routeFadeIn forwards;
    }

    &.fadeOut {
        animation: 0.2s routeFadeOut forwards;
    }

    @keyframes routeFadeIn {
        from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes routeFadeOut {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(-5px) scale(0.99);
        }
    }
`;

const NavbarContainer = dt.nav`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    border-bottom: 2px solid var(--background-modifier-border);
`;
const NavbarTabs = dt.div`
    display: flex;
    gap: 16px;
`;
const NavbarTab = dt.button`
    display: flex;
    align-items: center;
    background: none;
    border: none;
    text-decoration: none;
    color: var(--text-normal);
    font-size: 16px;
    padding: 8px 12px;
    gap: 10px;
    border-radius: 4px;
    transition:
        background-color 0.3s,
        color 0.3s;
    cursor: pointer;
    position: relative;

    &:hover {
        background-color: var(--background-modifier-hover);
        color: var(--text-accent-hover);
    }

    &.active {
        background-color: var(--background-modifier-active-hover);
        color: var(--text-accent);
    }

    &.active::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 3px;
        background-color: var(--text-accent);
        border-radius: 2px 2px 0 0;
    }
`;

const Navbar = () => /* @__PURE__ */ u$1(NavbarContainer, { children: /* @__PURE__ */ u$1(NavbarTabs, { children: [
  /* @__PURE__ */ u$1(
    NavbarTab,
    {
      as: NavLink,
      to: "/units",
      draggable: false,
      children: "Images"
    }
  ),
  /* @__PURE__ */ u$1(
    NavbarTab,
    {
      as: NavLink,
      to: "/panel",
      draggable: false,
      children: "Panel"
    }
  ),
  /* @__PURE__ */ u$1(
    NavbarTab,
    {
      as: NavLink,
      to: "/debug/",
      draggable: false,
      children: "Debug"
    }
  ),
  /* @__PURE__ */ u$1(
    NavbarTab,
    {
      as: NavLink,
      to: "/about",
      draggable: false,
      children: "About"
    }
  )
] }) });

const ResetSettings = () => {
  const { plugin, forceReload, setCurrentPath } = useSettingsContext();
  const location = useLocation();
  return /* @__PURE__ */ u$1(
    ReactObsidianSetting,
    {
      addButtons: [
        (button) => {
          button.setIcon("rotate-ccw");
          button.setTooltip("Reset settings to default");
          button.onClick(async () => {
            setCurrentPath(location.pathname);
            await plugin.settings.resetSettings();
            plugin.settings.eventBus.emit("settings-reset", {
              eventName: "settings-reset",
              oldValue: void 0,
              newValue: void 0
            });
            forceReload();
            plugin.showNotice(
              "Settings have been reset to default."
            );
          });
          return button;
        }
      ]
    }
  );
};

const DesktopToolbar = dt.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: 100%;

    &::before {
        content: '';
    }
`;
const DesktopResetButtonWrapper = dt.div`
    justify-self: end;
    display: flex;
    align-items: center;
    margin-top: 35px;
`;
const MobileResetButtonWrapper = dt.div`
    display: flex;
    justify-content: flex-end;
    margin-top: -50px;
    margin-right: 0;
    padding: 0;
    width: 100%;
    margin-bottom: 0;
`;

const Toolbar = () => {
  if (obsidian.Platform.isDesktopApp) {
    return /* @__PURE__ */ u$1(DesktopToolbar, { children: [
      /* @__PURE__ */ u$1(Navbar, {}),
      /* @__PURE__ */ u$1(DesktopResetButtonWrapper, { children: /* @__PURE__ */ u$1(ResetSettings, {}) })
    ] });
  }
  return /* @__PURE__ */ u$1(k$3, { children: [
    /* @__PURE__ */ u$1(MobileResetButtonWrapper, { children: /* @__PURE__ */ u$1(ResetSettings, {}) }),
    /* @__PURE__ */ u$1(Navbar, {})
  ] });
};

const RoutesContent = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = d(location);
  const [transitionStage, setTransitionStage] = d("fadeIn");
  y$1(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut");
    }
  }, [location, displayLocation]);
  return /* @__PURE__ */ u$1(k$3, { children: [
    /* @__PURE__ */ u$1(Toolbar, {}),
    /* @__PURE__ */ u$1(
      AnimatedRoutes,
      {
        $stage: transitionStage,
        className: transitionStage,
        onAnimationEnd: () => {
          if (transitionStage === "fadeOut") {
            setTransitionStage("fadeIn");
            setDisplayLocation(location);
          }
        },
        children: /* @__PURE__ */ u$1(Routes, { location: displayLocation, children: [
          /* @__PURE__ */ u$1(
            Route,
            {
              path: "/units/*",
              element: /* @__PURE__ */ u$1(Elements, {})
            }
          ),
          /* @__PURE__ */ u$1(
            Route,
            {
              path: "/panel/*",
              element: /* @__PURE__ */ u$1(PanelSection, {})
            }
          ),
          /* @__PURE__ */ u$1(
            Route,
            {
              path: "/debug/*",
              element: /* @__PURE__ */ u$1(Debug, {})
            }
          ),
          /* @__PURE__ */ u$1(
            Route,
            {
              path: "/about",
              element: /* @__PURE__ */ u$1(About, {})
            }
          )
        ] })
      }
    )
  ] });
};

const SettingsPage = () => {
  const { reloadCount, currentPath } = useSettingsContext();
  return /* @__PURE__ */ u$1(
    MemoryRouter,
    {
      initialEntries: [currentPath],
      children: /* @__PURE__ */ u$1(RoutesContent, {})
    },
    reloadCount
  );
};

const SettingsRoot = ({ app, plugin }) => /* @__PURE__ */ u$1(
  SettingProvider,
  {
    app,
    plugin,
    children: /* @__PURE__ */ u$1(SettingsPage, {})
  }
);

class SettingsTab extends obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.app = app;
    this.plugin = plugin;
    this.containerEl.addClass("interactify-settings");
  }
  root = void 0;
  display() {
    this.plugin.settings.eventBus.on(
      "**",
      (payload) => {
        this.plugin.eventBus.emit(payload.eventName, payload);
      }
    );
    this.root = createRoot(this.containerEl);
    this.root.render(
      /* @__PURE__ */ u$1(
        SettingsRoot,
        {
          app: this.app,
          plugin: this.plugin
        }
      )
    );
  }
  /**
   * Hides the settings tab.
   *
   * This method unmounts the React root component and clears the container element.
   */
  hide() {
    this.plugin.settings.eventBus.removeAllListeners();
    this.root?.unmount();
    this.containerEl.empty();
  }
}

class PluginContext {
  constructor(plugin) {
    this.plugin = plugin;
  }
  leaf;
  view;
  get leafID() {
    return this.leaf && this.leaf.id;
  }
  /**
   * Whether the context is active.
   *
   * The context is active if:
   * 1. The context is associated with a leaf.
   * 2. The context is associated with a view.
   * 3. The view is associated with a file.
   *
   * @readonly
   */
  get active() {
    return this.leaf !== void 0 && this.view !== void 0 && this.view.file !== null;
  }
  /**
   * Checks if the current view is in preview mode.
   */
  get inPreviewMode() {
    const viewState = this.view?.getState();
    return viewState?.mode === "preview";
  }
  /**
   * Checks if the current view is in live preview mode.
   */
  get inLivePreviewMode() {
    const viewState = this.view?.getState();
    return !viewState?.source && viewState?.mode === "source";
  }
  /**
   * Initializes the view context with the currently active view.
   */
  initialize(onInitialize) {
    const view = this.plugin.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!view) {
      return;
    }
    this.leaf = view.leaf;
    this.view = view;
    onInitialize(this.leafID);
  }
  /**
   * Cleans up the view context if the leaf is no longer alive.
   */
  cleanup(onCleanup) {
    if (!this.leaf) {
      return;
    }
    const isLeafAlive = this.plugin.app.workspace.getLeafById(this.leafID);
    if (isLeafAlive === null) {
      onCleanup(this.leafID);
      this.view = void 0;
      this.leaf = void 0;
    }
  }
}

class PluginStateChecker {
  constructor(plugin) {
    this.plugin = plugin;
  }
  /**
   * Determines if the plugin is being opened for the first time.
   *
   * Compares current plugin metadata with stored metadata in local storage. Updates local storage if it's the first launch.
   *
   * @returns `true` if it's the first time the plugin is opened, otherwise `false`.
   */
  async isFirstPluginStart() {
    const pluginMetadata = await this.getPluginMetadata();
    const localStoragePluginMetadata = localStorage.getItem(
      "interactify-metadata"
    );
    if (!localStoragePluginMetadata) {
      localStorage.setItem(
        "interactify-metadata",
        pluginMetadata.toString()
      );
      return true;
    }
    const localStoragePluginMetadataNumber = parseInt(
      localStoragePluginMetadata,
      10
    );
    if (isNaN(localStoragePluginMetadataNumber) || pluginMetadata !== localStoragePluginMetadataNumber) {
      localStorage.setItem(
        "interactify-metadata",
        pluginMetadata.toString()
      );
      return true;
    }
    return false;
  }
  /**
   * Retrieves metadata for the plugin based on its directory creation time.
   *
   * Constructs the path to the plugin directory, retrieves its stats, and returns the directory's creation time in milliseconds.
   *
   * @returns {Promise<number>} A promise that resolves to the plugin directory's creation time in milliseconds.
   * @throws {Error} Throws an error if the plugin directory is not found.
   */
  async getPluginMetadata() {
    const { dir: pluginDir } = this.plugin.manifest;
    if (!pluginDir) {
      throw new Error("No plugin dir found.");
    }
    const pluginDirStat = await this.plugin.app.vault.adapter.stat(pluginDir);
    return pluginDirStat?.ctime ?? 0;
  }
}

class State {
  constructor(plugin) {
    this.plugin = plugin;
  }
  data = /* @__PURE__ */ new Map();
  orphans = { units: [] };
  /**
   * Initializes the data for a leaf with the given id if it doesn't exist.
   *
   * @param leafID The id of the leaf to initialize.
   */
  initializeLeaf(leafID) {
    if (!this.data.get(leafID)) {
      this.data.set(leafID, {
        units: [],
        livePreviewObserver: void 0
      });
      this.plugin.logger.debug(
        `Initialized data for leaf width id: ${leafID}...`
      );
    }
  }
  async cleanupLeaf(leafID) {
    const data = this.data.get(leafID);
    if (!data) {
      this.plugin.logger.error(`No data for leaf`, { leafID });
      return;
    }
    data.livePreviewObserver?.disconnect();
    data.livePreviewObserver = void 0;
    for (const unit of data.units) {
      await unit.onDelete();
      this.plugin.logger.debug(`Unloaded unit`, {
        unitName: unit.context.options.name
      });
    }
    this.data.delete(leafID);
    this.plugin.logger.debug(
      `Data for leaf with id ${leafID} was cleaned successfully.`
    );
  }
  async clear() {
    this.plugin.logger.debug("Started to clear state...");
    for (const leafID of this.data.keys()) {
      await this.cleanupLeaf(leafID);
    }
    await this.cleanOrphan();
    this.plugin.logger.debug("State was cleared successfully.");
  }
  /**
   * Retrieves the live preview observer associated with the specified leaf.
   *
   * @param leafID - The ID of the leaf for which to retrieve the observer.
   * @returns The MutationObserver associated with the leaf, or `undefined` if none exists.
   */
  getLivePreviewObserver(leafID) {
    return this.data.get(leafID)?.livePreviewObserver;
  }
  /**
   * Sets the live preview observer associated with the specified leaf.
   *
   * If the state has a data entry associated with the specified leafID, it will
   * set the livePreviewObserver property of that data entry to the specified
   * observer. If no data is found for the given leafID, this method does
   * nothing.
   *
   * @param leafID - The ID of the leaf for which to set the observer.
   * @param observer - The MutationObserver to associate with the leaf.
   */
  setLivePreviewObserver(leafID, observer) {
    const data = this.data.get(leafID);
    if (data) {
      data.livePreviewObserver = observer;
    }
  }
  /**
   * Checks if there is a live preview observer associated with the specified leaf.
   *
   * This method determines whether a live preview observer has been set for
   * the given leafID by attempting to retrieve it.
   *
   * @param leafID - The ID of the leaf to check for an associated observer.
   * @returns `true` if a live preview observer exists for the leaf, `false` otherwise.
   */
  hasObserver(leafID) {
    return !!this.getLivePreviewObserver(leafID);
  }
  getUnits(leafID) {
    return this.data.get(leafID)?.units ?? [];
  }
  pushUnit(leafID, unit) {
    const data = this.data.get(leafID);
    if (!data) {
      this.plugin.logger.error(`No data for leafID: ${leafID}`);
      return;
    }
    data.units.push(unit);
  }
  pushOrphanUnit(unit) {
    this.orphans.units.push(unit);
  }
  async cleanOrphan() {
    for (const unit of this.orphans.units) {
      await unit.onDelete();
    }
  }
  async cleanupUnitsOnFileChange(leafID, currentFileStats) {
    const data = this.data.get(leafID);
    if (!data) {
      this.plugin.logger.error(`No data for leafID: ${leafID}`);
      return;
    }
    const currentFileCtime = currentFileStats.ctime;
    const unitsToKeep = [];
    for (const unit of data.units) {
      if (unit.context.adapter === InteractifyAdapters.PickerMode || currentFileCtime !== unit.fileStats.ctime) {
        await unit.onDelete();
        this.plugin.logger.debug(
          `Cleaned up unit with id ${unit.id} due to file change`
        );
      } else {
        unitsToKeep.push(unit);
      }
    }
    data.units = unitsToKeep;
  }
}

class InteractifyPlugin extends obsidian.Plugin {
  context;
  state;
  settings;
  pluginStateChecker;
  logger;
  eventBus;
  pickerMode;
  /**
   * Initializes the plugin when it is loaded.
   *
   * This function is called automatically when the plugin is loaded by Obsidian.
   * It initializes the plugin by calling `initializePlugin`.
   *
   * @returns A promise that resolves when the plugin has been fully initialized.
   */
  async onload() {
    {
      window.plugin = this;
    }
    await this.initializePlugin();
    this.logger.info("Plugin loaded successfully");
  }
  async onunload() {
    this.logger.debug("Plugin unloading...");
    await this.state.clear();
    this.eventBus.removeAllListeners();
    this.logger.info("Plugin unloaded successfully");
  }
  /**
   * Initializes the plugin.
   *
   * This function initializes the plugin's core components, event system, and utilities.
   * It is called when the plugin is loading.
   *
   * @returns A promise that resolves when the plugin has been successfully initialized.
   */
  async initializePlugin() {
    await this.initializeCore();
    await this.initializeUtils();
    await this.initializeEventSystem();
    await this.initializeUI();
    this.logger.info("Plugin initialized successfully.");
  }
  /**
   * Initializes the plugin's core components.
   *
   * This function initializes the plugin's settings manager and adds a settings tab to the Obsidian settings panel.
   *
   * @returns A promise that resolves when the plugin's core components have been successfully initialized.
   */
  async initializeCore() {
    this.settings = new SettingsManager(this);
    await this.settings.loadSettings();
    this.logger = new Logger(this);
    await this.logger.init();
    this.context = new PluginContext(this);
    this.state = new State(this);
    this.addSettingTab(new SettingsTab(this.app, this));
    this.logger.debug("Core initialized");
  }
  /**
   * Asynchronously initializes the event system for handling events in the plugin.
   * This function sets up the EventPublisher and EventObserver instances, and registers event handlers for 'layout-change' and 'active-leaf-change' events.
   *
   * @returns A promise that resolves once the event system has been successfully initialized.
   */
  async initializeEventSystem() {
    this.eventBus = new EventEmitter2({
      wildcard: true,
      delimiter: "."
    });
    this.setupInternalEventHandlers();
    this.setupObsidianEventHandlers();
    this.logger.debug("Event system initialized");
  }
  async initializeUI() {
    this.setupCommands();
    this.pickerMode = new PickerMode(this);
    this.addChild(this.pickerMode);
    this.logger.debug("UI initialized");
  }
  /**
   * Initializes the plugin's utility classes.
   *
   * This function initializes the PluginStateChecker, which is responsible for
   * checking if the plugin is being opened for the first time
   *
   * @returns A promise that resolves when the plugin's utilities have been
   *          successfully initialized.
   */
  async initializeUtils() {
    this.pluginStateChecker = new PluginStateChecker(this);
    this.logger.debug("Utils initialized");
  }
  setupInternalEventHandlers() {
    this.eventBus.on("unit.created", (unit) => {
      const leafID = this.context.leafID;
      if (!leafID) {
        this.logger.warn("No active leaf found.");
        this.state.pushOrphanUnit(unit);
        this.logger.debug("orphan unit was added to state");
        return;
      }
      this.state.pushUnit(leafID, unit);
      this.logger.debug("Unit added to state", {
        leafID,
        unitName: unit.context.options.name
      });
    });
  }
  setupObsidianEventHandlers() {
    const onLeafEvent = async (event) => {
      this.context.cleanup((leafID) => this.state.cleanupLeaf(leafID));
      this.context.initialize(
        (leafID) => this.state.initializeLeaf(leafID)
      );
      if (!this.settings.data.units.interactivity.markdown.autoDetect) {
        return;
      }
      if (!this.context.active) {
        return;
      }
      if (event === "layout-change") {
        await this.state.cleanupUnitsOnFileChange(
          this.context.leafID,
          this.context.view.file.stat
        );
        await this.state.cleanOrphan();
      }
      if (!this.context.inLivePreviewMode) {
        return;
      }
      const adapter = new LivePreviewAdapter(this, {
        ...this.context.view.file.stat
      });
      const sourceContainer = this.context.view.contentEl.querySelector(
        ".markdown-source-view"
      );
      await adapter.initialize(
        this.context.leafID,
        sourceContainer,
        this.state.hasObserver(this.context.leafID)
      );
      this.logger.debug("Initialized adapter for Live Preview Mode...");
    };
    this.registerMarkdownPostProcessor(
      async (element, context) => {
        this.context.initialize(
          (leafID) => this.state.initializeLeaf(leafID)
        );
        if (!this.settings.data.units.interactivity.markdown.autoDetect) {
          return;
        }
        if (this.context.active && this.context.inPreviewMode) {
          this.logger.debug(
            "Calling withing the Markdown PostProcessor..."
          );
          const adapter = new PreviewAdapter(this, {
            ...this.context.view.file.stat
          });
          await adapter.initialize(
            this.context.leafID,
            element,
            context
          );
          this.logger.debug(
            "Initialized adapter for Preview Mode..."
          );
        }
      }
    );
    this.registerEvent(
      this.app.workspace.on("layout-change", async () => {
        this.logger.debug("Calling withing the layout-change-event...");
        await onLeafEvent("layout-change");
      })
    );
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", async () => {
        this.logger.debug(
          "Called withing the active-leaf-change event..."
        );
        await onLeafEvent("active-leaf-change");
      })
    );
  }
  setupCommands() {
    this.addCommand({
      id: "toggle-panels-management-state",
      name: "Toggle control panels visibility for all the active interactive images in current note",
      checkCallback: (checking) => {
        const units = this.state.getUnits(this.context.leafID);
        if (checking) {
          return (this.context.inLivePreviewMode || this.context.inPreviewMode) && this.context.active && units.some((u) => u.active);
        }
        if (!this.context.active) {
          this.showNotice(
            "This command can only be used when a Markdown view is open."
          );
          return;
        }
        if (!units.some((d) => d.active)) {
          this.showNotice("No active interactive images found");
          return;
        }
        const filteredU = units.filter((d) => d.active);
        const anyVisible = filteredU.some(
          (u) => u.controlPanel.hasVisiblePanels
        );
        filteredU.forEach(
          (u) => anyVisible ? u.controlPanel.hide(TriggerType.FORCE) : u.controlPanel.show(TriggerType.FORCE)
        );
        const message = anyVisible ? "Control panels hidden" : "Control panels shown";
        this.showNotice(message);
        this.logger.debug(
          "Called command `toggle-panels-management-state`"
        );
        return true;
      }
    });
  }
  /**
   * Displays a notice with the provided message for a specified duration.
   *
   * @param message - The message to display in the notice.
   * @param duration - The duration in milliseconds for which the notice should be displayed. Defaults to undefined.
   * @returns void
   */
  showNotice(message, duration) {
    new obsidian.Notice(message, duration);
  }
}

module.exports = InteractifyPlugin;
