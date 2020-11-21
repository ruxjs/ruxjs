'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var invariant = require('invariant');
var redux = require('redux');
var reactRedux = require('react-redux');
var path = require('path');
var react = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var invariant__default = /*#__PURE__*/_interopDefaultLegacy(invariant);

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/**
 *  redux Middleware
 * @param apply proxy hander apply
 */
function proxyMiddleware(apply) {
  return function () {
    return function (next) {
      return function (action) {
        var hander = {
          apply: apply
        };
        var dispatch = new Proxy(next, hander);
        return dispatch(action);
      };
    };
  };
}

/**
 * 数据类型校验
 * @param type 待校验类型
 */
function isType(type) {
  return Object.prototype.toString.call(type).slice(8, -1);
}
/* 字符串类型 */

function isString(type) {
  return isType(type) === 'String';
}
/* 函数类型 */

function isFuntion(type) {
  return isType(type) === 'Function';
}
/* 对象类型 */

function isObject(type) {
  return isType(type) === 'Object';
}
/* Returns an empty object */

var noop = function noop() {
  return {};
};
/* warn function */

function warn(is, warnText) {
  if (!is) {
    console.warn(warnText);
  }
}

var filesMap = new Map();
var isAutoCollectModels = true;

var f1 = function f1(key) {
  return path.basename(key).split('.')[0] === 'model';
};

var f2 = function f2(file) {
  return function (key) {
    return file(key)["default"];
  };
};

var f3 = function f3(fileObject) {
  return isObject(fileObject) && (fileObject.nameSpace || fileObject.state || fileObject.reducer || fileObject.effect);
};

var f4 = function f4(fileObject) {
  return (fileObject.nameSpace || fileObject.baseNameSpace) && filesMap.set(fileObject.nameSpace || fileObject.baseNameSpace, fileObject);
};

var f5 = function f5(fns) {
  for (var fn in fns) {
    !isFuntion(fns[fn]) && delete fns[fn];
  }
};
/**
 * One method is used to deeply collect the files under the model file
 */


function pageCollector() {
  try {
    var pageFile = require.context('../../../src/page', true, /\.tsx?|jsx?$/);

    pageFile.keys().filter(f1).map(f2(pageFile)).filter(f3).forEach(f4);
  } catch (e) {
    console.warn(e);
  }
}
/**
 * One method is used to deeply collect the files under the page file
 */


function modelCollector() {
  try {
    var modelFile = require.context('../../../src/model', true, /\.tsx?|jsx?$/);

    modelFile.keys().map(function (key) {
      var file = f2(modelFile)(key);
      isObject(file) && (file.baseNameSpace = path.basename(key).split('.')[0]);
      return file;
    }).filter(f3).forEach(f4);
  } catch (e) {
    console.warn(e);
  }
}
/**
 *
 * @param models a standard model
 */


function checkModel(models) {
  if (models) {
    /**
     * If there is no automatic collection of models, you can immediately collect models manually here
     */
    invariant__default['default'](isObject(models), "Models are required to be an object property , but got ".concat(isType(models)));

    for (var model in models) {
      var m = models[model];
      !m.nameSpace && (m.nameSpace = model);
      f3(m) && f4(m);
    }
  }
  /* check every models */


  filesMap.forEach(function (value) {
    var reducer = value.reducer,
        state = value.state,
        effect = value.effect;
    !isObject(state) && (value.state = noop());
    !isObject(reducer) && (value.reducer = noop());
    !isObject(effect) && (value.effect = noop());
    f5(reducer);
    f5(effect);
  });
}
/**
 * Do you want to collect models under the page folder
 * @param isPage
 */


function autoInjectModel(isPage) {
  if (!isAutoCollectModels) return;

  if (isPage) {
    pageCollector();
  }

  modelCollector();
  checkModel();
}
/* get a rux model */


var getModel = function getModel(nameSpace) {
  return filesMap.get(nameSpace);
};
/* map model to store */


function mapModels(nameSpace, store) {
  var map = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop();

  if (Array.isArray(nameSpace)) {
    nameSpace.forEach(function (n) {
      mapModels(n, store, map);
    });
  } else {
    var currentModel = getModel(nameSpace);

    if (currentModel) {
      var state = currentModel.state;

      for (var name in state) {
        map[name] = store[nameSpace][name];
      }
    }
  }

  return map;
}

var autoCollectModels = function autoCollectModels() {
  return isAutoCollectModels = false;
};

/**
 *
 * @param {*} app rux app
 * @param {*} render render function
 */

function createHoc(app, render) {
  return function index() {
    return /*#__PURE__*/react.createElement(reactRedux.Provider, {
      store: app._store
    }, render());
  };
}

/**
 * Inject the entire model directly into the component
 * @param nameSpace model nameSpace
 */

function model(nameSpace) {
  return function (Content) {
    return reactRedux.connect(function (store) {
      return mapModels(nameSpace, store);
    })(Content);
  };
}

/**
 * find current effect functions
 * @param effects
 * @param name
 */
function isEffect(effects, name) {
  var effect = null;

  for (var e in effects) {
    e === name && (effect = effects[e]);
  }

  return effect;
}
/**
 *
 * @param target
 * @param contextThis
 * @param nameSpace
 */

function handerEffect(target, contextThis, nameSpace) {
  return function (action) {
    var type = action.type;

    var newAction = _objectSpread2(_objectSpread2({}, action), {}, {
      type: ~type.indexOf('.') ? type : "".concat(nameSpace, ".").concat(type)
    });

    return Reflect.apply(target, contextThis, [newAction]);
  };
}

/**
 * @param actionType
 * @param reducer
 */
function handleAction(actionType, reducer, nameSpace) {
  return function (state, action) {
    var type = action.type;
    var typeArr = type.split('.');

    if (actionType === typeArr[1] && nameSpace === typeArr[0]) {
      return reducer(state, action);
    }

    return state;
  };
}
/**
 * @param reducers reducers
 * reference: https://github.com/dvajs/dva/blob/master/packages/dva-core/src/handleActions.js
 */


function reduceReducers() {
  for (var _len = arguments.length, reducers = new Array(_len), _key = 0; _key < _len; _key++) {
    reducers[_key] = arguments[_key];
  }

  return function (previous, current) {
    return reducers.reduce(function (p, r) {
      return r(p, current);
    }, previous);
  };
}
/**
 * @param handlers  reducer handers
 * @param defaultState  state
 */


function handleActions(handlers, defaultState, nameSpace) {
  var reducers = Object.keys(handlers).map(function (type) {
    return handleAction(type, handlers[type], nameSpace);
  });
  var reducer = reduceReducers.apply(void 0, _toConsumableArray(reducers));
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    return reducer(state, action);
  };
}
/**
 *
 * @param models
 */


function createReduder(models) {
  var reducers = {};
  models.forEach(function (model, key) {
    var state = model.state,
        reducer = model.reducer;
    reducers[key] = handleActions(reducer, state, key);
  });
  return reducers;
}

function createAppApi() {
  /* A unique identifier for each event subscriber  */
  var eventId = 0;
  var app = {
    _model: filesMap,
    initialState: {},
    subscribe: []
  };
  /**
   * dispatch a eventType
   * @param eventType
   */

  function dispatchEvent(eventType) {
    console.log(eventType);
  }
  /**
   * get app state
   */


  function getState() {
    invariant__default['default'](app._store, 'app store does not exist.');
    return app._store.getState();
  }
  /**
   * subscribe events
   * There are two cases for the subscribe function parameter
   * First, global add subscription
   * for example  subscribe((newState)=>{})
   * The second，Add a listener for an effect or a reducer
   * for example , subscribe('index.getData',(oldState,newState) => {})
   * @param fn subscribe callback
   */


  function subscribe() {
    var a1 = arguments.length <= 0 ? undefined : arguments[0];
    var a2 = arguments.length <= 1 ? undefined : arguments[1];
    var queue = app.subscribe;

    var unSubscribe = function unSubscribe(f) {
      return function () {
        var index = queue.findIndex(function (fn) {
          return f(fn);
        });
        queue.splice(index, 1);
      };
    };

    if (arguments.length === 2 && isString(a1) && isFuntion(a2)) {
      var fn = a2;
      fn.$$event = a1;
      fn.$$eventId = ++eventId;
      queue.push(fn);
      return unSubscribe(function (fn) {
        return a2.$$event === fn.$$event && a2.$$eventId === fn.$$eventId;
      });
    } else if (arguments.length === 1 && isFuntion(a1)) {
      a1.$$eventId = ++eventId;
      queue.push(a1);
      return unSubscribe(function (fn) {
        return fn === a1 && fn.$$eventId === a1.$$eventId;
      });
    } else {
      warn(false, 'Parameters do not match .');
      return function () {};
    }
  }
  /**
   * Running special listeners
   * @param type for example subscribe(type , callback)
   */


  function runcallbackQuene(type) {
    var pre = getState();
    return function () {
      var next = getState();
      app.subscribe.filter(function (fn) {
        return fn.$$event === type;
      }).forEach(function (fn) {
        return fn.apply(null, [pre, next]);
      });
    };
  }
  /**
   * proxy hander function
   * @param target  redux store dispatch
   * @param contextThis  context
   * @param arg Parameter array
  */


  function apply(target, contextThis, arg) {
    invariant__default['default'](isObject(arg[0]), 'dispatch parameter must be a objecy');
    var type = arg[0].type;
    invariant__default['default'](type && isString(type), 'Type is required in the first parameter of the dispatch ,and  type expected to be a string type');
    var run = runcallbackQuene(type);
    var actionTypeArr = type.split('.');
    var result = null;

    if (actionTypeArr.length === 2) {
      /* Resolution type */
      var nameSpace = actionTypeArr[0];
      var currentName = actionTypeArr[1];

      var currentModel = app._model.get(nameSpace);

      if (!currentModel) return dispatchEvent(nameSpace);
      /* effect  */

      var effect = isEffect(currentModel.effect, currentName);

      if (effect) {
        result = effect.call.apply(effect, [currentModel, handerEffect(target, contextThis, nameSpace)].concat(_toConsumableArray(arg)));
        Promise.resolve().then(function () {
          run();
        });
      } else {
        result = Reflect.apply(target, contextThis, arg);
        run();
      }
    } else {
      result = Reflect.apply(target, contextThis, arg);
      run();
    }

    return result;
  }
  /**
   * create a element
   * @param config  model config
   * @param element a reactElement
   */


  function create(config, element) {
    invariant__default['default'](isObject(config), 'The first parameter is expected to be an object');
    invariant__default['default'](isFuntion(element), 'The second parameter of createApp is expected to be a function');

    var _ref = isObject(config) ? config : {},
        _ref$deep = _ref.deep,
        deep = _ref$deep === void 0 ? false : _ref$deep;

    var middleware = proxyMiddleware(apply);
    autoInjectModel(deep);
    /*  create a redux store  */

    var store = app._store = redux.createStore(redux.combineReducers(createReduder(app._model)), app.initialState, redux.applyMiddleware(middleware));
    /*  Register event listener  */

    app.unSubscribe = store.subscribe(function () {
      var subscribe = app.subscribe;
      subscribe.forEach(function (fn) {
        !fn.$$event && fn(store.getState());
      });
    });
    return createHoc(app, element)();
  }
  /**
   * register a middleware
   * @param middleware rux middleware include nameSpace, reducer, effect, state
   */


  function use(middleware) {
    console.log(middleware);
  }
  /**
   * inject a rux model
   * @param models
   */


  function injectModel(models) {
    autoCollectModels();
    checkModel(models);
  }
  /* Exposed API */


  return {
    create: create,
    use: use,
    injectModel: injectModel,
    subscribe: subscribe
  };
}

var app = createAppApi();
var exportSubscribe = app.subscribe;

Object.defineProperty(exports, 'connect', {
  enumerable: true,
  get: function () {
    return reactRedux.connect;
  }
});
exports.default = app;
exports.injectModel = autoInjectModel;
exports.model = model;
exports.subscribe = exportSubscribe;
//# sourceMappingURL=index.js.map
