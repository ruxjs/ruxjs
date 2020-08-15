import invariant from 'invariant'
import {
  combineReducers,
  applyMiddleware,
  createStore
} from 'redux'

import {
  connect
} from 'react-redux'
import proxyMiddleware from './src/proxyMiddleware'
import {
  autoInjectModel,
  checkModel,
  filesMap,
  autoCollectModels
} from './src/model'
import createHOC from './src/component/createHoc'
import modelHOC from './src/component/modelHoc'
import {
  isObject,
  isString,
  isFuntion,
  warn
} from './src/utils'
import handerEffect, { isEffect } from './src/effect'
import {
  createReduder
} from './src/reducer'



function createAppApi() {

  /* A unique identifier for each event subscriber  */
  let eventId = 0

  const app = {
    _model: filesMap,
    initialState: {},
    subscribe: []
  }

  /**
   * dispatch a eventType
   * @param eventType
   */
  function dispatchEvent(eventType) {
    console.log(eventType)
  }

  /**
   * get app state
   */
  function getState() {
    invariant(
      app._store,
      'app store does not exist.'
    )
    return app._store.getState()
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
  function subscribe(...arg) {
    const a1 = arg[0]
    const a2 = arg[1]
    const queue = app.subscribe
    const unSubscribe = (f) => {
      return function () {
        const index = queue.findIndex((fn) => f(fn))
        queue.splice(index, 1)
      }
    }
    if (arg.length === 2 && isString(a1) && isFuntion(a2)) {
      const fn = a2
      fn.$$event = a1
      fn.$$eventId = ++ eventId
      queue.push(fn)
      return unSubscribe((fn) => a2.$$event === fn.$$event && a2.$$eventId ===fn.$$eventId )
    } else if (arg.length === 1 && isFuntion(a1)) {
      a1.$$eventId = ++ eventId
      queue.push(a1)
      return unSubscribe((fn) => fn === a1 && fn.$$eventId === a1.$$eventId )
    } else {
      warn(
        false,
        'Parameters do not match .'
      )
      return () => {}
    }
  }

  /**
   * Running special listeners
   * @param type for example subscribe(type , callback)
   */
  function runcallbackQuene(type) {
    const pre = getState()
    return function () {
      const next = getState()
      app.subscribe.filter((fn) => fn.$$event === type).forEach(fn => fn.apply(null, [pre, next]))
    }
  }

  /**
   * proxy hander function
   * @param target  redux store dispatch
   * @param contextThis  context
   * @param arg Parameter array
  */
  function apply(target, contextThis, arg) {
    invariant(
      isObject(arg[0]),
      'dispatch parameter must be a objecy'
    )
    const { type } = arg[0]
    invariant(
      type && isString(type),
      'Type is required in the first parameter of the dispatch ,and  type expected to be a string type'
    )
    const run = runcallbackQuene(type)

    const actionTypeArr = type.split('.')
    let result = null
    if (actionTypeArr.length === 2) {

      /* Resolution type */
      const nameSpace = actionTypeArr[0]
      const currentName = actionTypeArr[1]
      const currentModel = app._model.get(nameSpace)

      if (!currentModel) return dispatchEvent(nameSpace)

      /* effect  */
      const effect = isEffect(currentModel.effect, currentName)
      if (effect) {
        result = (effect).call(currentModel, handerEffect(target, contextThis, nameSpace), ...arg)
        Promise.resolve().then(() => {
          run()
        })
      } else {
        result = Reflect.apply(target, contextThis, arg)
        run()
      }

    } else {
      result = Reflect.apply(target, contextThis, arg)
      run()
    }
    return result
  }

  /**
   * create a element
   * @param config  model config
   * @param element a reactElement
   */
  function create(config, element) {
    invariant(
      isObject(config),
      'The first parameter is expected to be an object'
    )
    invariant(
      isFuntion(element),
      'The second parameter of createApp is expected to be a function'
    )
    const {
      deep = false
    } = (isObject(config) ? config : {})
    const middleware = proxyMiddleware(apply)
    autoInjectModel(deep)

    /*  create a redux store  */
    const store = app._store = createStore(
      combineReducers(createReduder(app._model)),
      app.initialState,
      applyMiddleware(middleware)
    )

    /*  Register event listener  */
    app.unSubscribe = store.subscribe(() => {
      const subscribe = app.subscribe
      subscribe.forEach((fn) => {
        !fn.$$event && fn(store.getState())
      })
    })
    return createHOC(app, element)()
  }

  /**
   * register a middleware
   * @param middleware rux middleware include nameSpace, reducer, effect, state
   */
  function use(middleware) {
    console.log(middleware)
  }

  /**
   * inject a rux model
   * @param models
   */
  function injectModel(models) {
    autoCollectModels()
    checkModel(models)
  }

  /* Exposed API */
  return {
    create,
    use,
    injectModel,
    subscribe
  }
}

const app = createAppApi()
const exportSubscribe = app.subscribe

export {  modelHOC as model }
export { exportSubscribe as subscribe }
export { connect }
export { autoInjectModel as injectModel }
export default app

