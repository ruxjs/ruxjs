import { createElement } from 'react'
import { Provider } from 'react-redux'

/**
 *
 * @param {*} app rux app
 * @param {*} render render function
 */
export default function createHoc(app, render) {
    return function index() {
        return createElement(Provider, {
            store: app._store
        }, render())
    }
}