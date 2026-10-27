import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js';
import { CheckLikeUser, LikeFeedUser } from '../controller/like.controller.js';

const LikeRouteer = express.Router();

LikeRouteer.post('/:postId', authMiddleware, LikeFeedUser)
LikeRouteer.get('/:postId', authMiddleware, CheckLikeUser)

export default LikeRouteer