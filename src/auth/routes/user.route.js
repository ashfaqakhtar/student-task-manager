import express from 'express'
import { registerUser, userVerify, login, profile, logout, forgotPassword, resetPassword } from "../controllers/user.controllers.js";
import { isLoggedIn } from '../middleware/auth.middleware.js';



const router = express.Router()

router.post('/register', registerUser)
router.get("/verify/:token", userVerify)
router.post('/login', login)
router.get('/profile', isLoggedIn, profile)
router.get('/logout', isLoggedIn, logout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)




export default router;