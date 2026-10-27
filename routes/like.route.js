import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js';
import { LikeFeedUser } from '../controller/like.controller.js';

const LikeRouteer = express.Router();

LikeRouteer.post('/:postId', authMiddleware, LikeFeedUser)

export default LikeRouteer