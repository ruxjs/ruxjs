

/**
 * find current effect functions
 * @param effects
 * @param name
 */
export function isEffect(effects,name){
    let  effect = null
    for(let  e in effects ){
        e === name && (effect = effects[e] )
    }
    return effect
}

/**
 *
 * @param target
 * @param contextThis
 * @param nameSpace
 */
export default function handerEffect(target,contextThis,nameSpace){
    return function (action){
          const { type } = action
          const newAction = {
              ...action,
              type: ~type.indexOf('.') ? type  : `${nameSpace}.${type}`
          }
          return Reflect.apply(target,contextThis,[ newAction ])
    }
}