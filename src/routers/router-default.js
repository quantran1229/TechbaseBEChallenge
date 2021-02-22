import Router from 'koa-router';
import {
    util
}from '../services'
import db from '../models'

let router = new Router();
const Util = new util()

let defaultRouterReturn = async (ctx)=>{
    Util.setNotFound(404,"No route found")
    return Util.send(ctx)
}

//default api return
router.get('/',defaultRouterReturn)

router.post('/',defaultRouterReturn)

router.put('/',defaultRouterReturn)

router.delete('/',defaultRouterReturn)

export default router;