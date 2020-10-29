import * as path from 'path'
import invariant from 'invariant'

import {
    isObject,
    isType,
    noop,
    isFuntion
} from './utils'

const filesMap = new Map()

let isAutoCollectModels = true

const f1 = (key) => path.basename(key).split('.')[0] === 'model'

const f2 = (file) => (key) => file(key).default

const f3 = (fileObject) => isObject(fileObject) && (fileObject.nameSpace || fileObject.state || fileObject.reducer || fileObject.effect)

const f4 = (fileObject) => (fileObject.nameSpace || fileObject.baseNameSpace) && filesMap.set(fileObject.nameSpace || fileObject.baseNameSpace, fileObject)

const f5 = (fns) => {
    for (let fn in fns) {
        !isFuntion(fns[fn]) && delete fns[fn]
    }
}

/**
 * One method is used to deeply collect the files under the model file
 */
function pageCollector() {
    try {
        const pageFile = require.context('../../../src/page', true, /\.tsx?|jsx?$/)
        pageFile.keys()
            .filter(f1)
            .map(f2(pageFile))
            .filter(f3)
            .forEach(f4)
    } catch (e) {
        console.warn(e)
    }
}

/**
 * One method is used to deeply collect the files under the page file
 */
function modelCollector() {
    try {
        const modelFile = require.context('../../../src/model', true, /\.tsx?|jsx?$/)
        modelFile.keys()
            .map((key) => {
                const file = f2(modelFile)(key)
                isObject(file) && (file.baseNameSpace = path.basename(key).split('.')[0])
                return file
            })
            .filter(f3)
            .forEach(f4)
    } catch (e) {
        console.warn(e)
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
        invariant(
            isObject(models),
            `Models are required to be an object property , but got ${ isType(models) }`
        )
        for (let model in models) {
            const m = models[model]
            !m.nameSpace && (m.nameSpace = model)
            f3(m) && f4(m)
        }
    }
    /* check every models */
    filesMap.forEach((value) => {
        const {
            reducer,
            state,
            effect
        } = value
            !isObject(state) && (value.state = noop());
        (!isObject(reducer)) && (value.reducer = noop());
        (!isObject(effect)) && (value.effect = noop());
        f5(reducer)
        f5(effect)
    })
}

/**
 * Do you want to collect models under the page folder
 * @param isPage
 */
function autoInjectModel(isPage) {
    if (!isAutoCollectModels) return
    if (isPage) {
        pageCollector()
    }
    modelCollector()
    checkModel()
}

/* get a rux model */
const getModel = (nameSpace) => filesMap.get(nameSpace)

/* map model to store */
function mapModels(nameSpace, store, map = noop()) {
    if (Array.isArray(nameSpace)) {
         nameSpace.forEach(n=>{
             mapModels(n,store,map)
         })
    } else {
        const currentModel = getModel(nameSpace)
        if (currentModel) {
            const {
                state
            } = currentModel
            for (let name in state) {
                map[name] = store[nameSpace][name]
            }
        }
    }
    return map
}




const autoCollectModels = () => isAutoCollectModels = false

export {
    autoInjectModel,
    autoCollectModels,
    checkModel,
    getModel,
    filesMap,
    mapModels
}