import express from 'express'
import followRouter from './follow.route.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';
import { CreateFeed, DeleteFeed, DetailFeed, ReadAllFeeds } from '../controller/feed.controller.js';


const FeedRouter = express.Router();

FeedRouter.post('/', authMiddleware, upload.single('image'), CreateFeed)
FeedRouter.get('/', authMiddleware, ReadAllFeeds)
FeedRouter.get('/:id', authMiddleware, DetailFeed)
FeedRouter.delete('/:id', authMiddleware, DeleteFeed)

export default FeedRouter

