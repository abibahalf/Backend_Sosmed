import express from 'express'
import { getSearchUser, getUserbyUsername, updateUser } from '../controller/user.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const userRouter = express.Router()


userRouter.get('/search', getSearchUser)
userRouter.get('/:username', getUserbyUsername)
userRouter.put('/update-user', authMiddleware, updateUser)


export default userRouter