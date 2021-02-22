import Router from 'koa-router';
let router = new Router();
import {
    MemberController
} from '../controllers'

import {
    validateToken
} from '../middlewares/token-authorization'

import {
    validateLogin
} from '../validators/validateMember'

//POST login
router.post('/api/login',validateLogin,MemberController.login)

//GET list of members
router.get('/api/members',validateToken,MemberController.getList)

export default router;