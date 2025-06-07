import express from 'express'
import { logIn, logOut, getProfile, signUp } from '../Controllers/auth.controller.js';
import { verifyToken } from '../Middlewares/verifyToken.js';
const router = express.Router()


router.post('/login', logIn);
router.post('/signup', signUp);
router.get('/profile', verifyToken, getProfile);
router.post('/logout', logOut)
export default router