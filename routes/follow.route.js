import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js';
import { followUserAccount, getLimitUser, isFollowUser, unfollowUserAcount } from '../controller/follow.controller.js';
import { CheckLikeUser } from '../controller/like.controller.js';



const followRouter = express.Router();

followRouter.post('/', authMiddleware, followUserAccount);
followRouter.delete('/:unfollowUserId', authMiddleware, unfollowUserAcount )
followRouter.get('/user', authMiddleware, getLimitUser)
followRouter.get('/:followUserId', authMiddleware, isFollowUser )




export default followRouter





