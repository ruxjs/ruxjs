
/**
 *  redux Middleware
 * @param apply proxy hander apply
 */
export default function proxyMiddleware(apply){
    return () => (next) => (action) =>{
        const hander = { apply }
        const dispatch = new Proxy(next,hander)
        return dispatch(action)
    }
}