import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js';
import { followUserAccount, getLimitUser, unfollowUserAcount } from '../controller/follow.controller.js';



const followRouter = express.Router();

followRouter.post('/', authMiddleware, followUserAccount);
followRouter.delete('/:unfollowUserId', authMiddleware, unfollowUserAcount )
followRouter.get('/user', authMiddleware, getLimitUser)




export default followRouter





