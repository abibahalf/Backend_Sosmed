import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js';
import { followUserAccount } from '../controller/follow.controller.js';



const followRouter = express.Router();

followRouter.post('/', authMiddleware, followUserAccount)

export default followRouter





