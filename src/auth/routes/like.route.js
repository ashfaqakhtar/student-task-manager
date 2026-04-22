import express from "express"
import { toggleLike, getBlogLikes } from '../controllers/like.controllers.js'
import { isLoggedIn } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post('/:blogId', toggleLike);
router.get('/:blogId', getBlogLikes);


export default router