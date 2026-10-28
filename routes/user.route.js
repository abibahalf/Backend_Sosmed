import express from 'express'
import { getSearchUser, getUserbyUsername, updateAvatar, updateUser } from '../controller/user.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import upload from '../middleware/upload.middleware.js'




const userRouter = express.Router()


userRouter.get('/search', getSearchUser)
userRouter.get('/:username', getUserbyUsername)
userRouter.put('/update-user', authMiddleware, updateUser)
userRouter.put('/update-photo-profile', authMiddleware, upload.single('image'), updateAvatar)

export default userRouter