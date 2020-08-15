# rux 一款集成redux和react-redux状态管理工具 

## 一 快速开始

安装方式

### 1 快速安装构建

对于新的项目，全局安装脚手架,rux/cli ,rux/cli搭建项目可以支持ts ,可以快速构建项目

````js
npm install rux/cli -g 
````

然后新建文件夹创建项目。

````js
rux -create
````

### 2 正常安装

对于已经构建好的项目，可以使用如下方式安装。

````js
npm install ruxjs --save 
````

## 二 如何使用

### 初始化配置

````js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import rux from 'ruxjs'

rux.injectModel({
    index: {
        nameSpace: 'index',
        state: {
            number: 1
        },
        reducer: {
            numberAdd(state) {
                return {
                    ...state,
                    number: state.number + 1
                }
            }
        },
        effect: {
            async asyncnumberAdd(dispatch, {
                type
            }) {
                setTimeout(() => {
                    dispatch({
                        type: 'numberAdd'
                    })
                }, 3000)
            }
        }
    },
})

ReactDOM.render(
    rux.create({}, () => < App / > ),
    document.getElementById('app')
)
````



### 更多api 

更多api, 请参考 www.ruxjs.com