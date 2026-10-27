import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkSavedFeed, toggleSaveFeed } from '../controller/bookmark.controller.js';

const BookmarkRouter = express.Router();

BookmarkRouter.post('/:postId', authMiddleware, toggleSaveFeed)
BookmarkRouter.get('/:postId', authMiddleware, checkSavedFeed)

export default BookmarkRouter
