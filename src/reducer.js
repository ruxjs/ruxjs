
/**
 * @param actionType
 * @param reducer
 */
function handleAction(actionType,reducer,nameSpace) {
    return (state, action) => {
      const { type } = action
      const typeArr = type.split('.')
      if (actionType === typeArr[1] && nameSpace === typeArr[0] ) {
        return reducer(state, action)
      }
      return state
    }
}

/**
 * @param reducers reducers
 * reference: https://github.com/dvajs/dva/blob/master/packages/dva-core/src/handleActions.js
 */
function reduceReducers(...reducers) {
    return (previous, current) => reducers.reduce((p, r) => r(p, current), previous);
}

/**
 * @param handlers  reducer handers
 * @param defaultState  state
 */
function handleActions(handlers, defaultState,nameSpace) {
    const reducers = Object.keys(handlers).map(type => handleAction(type, handlers[type],nameSpace));
    const reducer = reduceReducers(...reducers);
    return (state = defaultState, action) => reducer(state, action);
}

/**
 *
 * @param models
 */
function createReduder(models){
    const reducers = {}
    models.forEach((model,key)=>{
        const { state, reducer } = model
        reducers[key] = handleActions(reducer,state,key)
    })
   return reducers
}


export { handleActions as handerReduer }

export { createReduder }