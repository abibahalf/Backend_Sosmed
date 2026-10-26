import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { createComment, deleteCommentById} from '../controller/comment.controller.js'
 
const commentRouter = express.Router()

commentRouter.post('/', authMiddleware, createComment)
commentRouter.delete('/:id', authMiddleware, deleteCommentById)


export default commentRouter