import express from 'express';
import { registerUser, loginUser, GetUser } from '../controller/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';


const AuthRouter = express.Router();

AuthRouter.post('/register', registerUser);

AuthRouter.post('/login', loginUser);
AuthRouter.get('/me', authMiddleware, GetUser)

export default AuthRouter;