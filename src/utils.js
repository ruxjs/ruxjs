/**
 * 数据类型校验
 * @param type 待校验类型
 */
export function isType (type){
    return  Object.prototype.toString.call(type).slice(8,-1)
  }

/* 字符串类型 */
export function isString (type) {
    return isType(type) === 'String'
}

/* 数字类型 */
export function isNumber (type){
    return isType(type) === 'Number'
}

/* 函数类型 */
export function isFuntion (type){
    return isType(type) === 'Function'
}

/* 数组类型 */
export function isArray (type){
    return isType(type) === 'Array'
}

/* 对象类型 */
export function isObject (type){
    return isType(type) === 'Object'
}

/* Returns an empty object */
export const noop = () => ({});

/* warn function */
export function warn(is,warnText){
    if(!is){
        console.warn( warnText )
    }
}

/* Check whether it is a promise object */
export function isPromise(promise) {
    return !!promise && ( isObject(promise)|| isFuntion(promise) ) &&  isFuntion(promise.then)
}
