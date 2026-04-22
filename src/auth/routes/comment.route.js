// import express from 'express'
// import {addComment, showComment, updateComment, deleteComment} from '../controllers/comment.controllers.js'
// import {isLoggedIn} from '../middleware/auth.middleware.js'

// const router = express.Router()

// router.post('/', isLoggedIn, addComment );
// router.get('/:id', showComment);
// router.put('/:id', isLoggedIn, updateComment);
// router.delete('/:id', isLoggedIn, deleteComment)



// export default router;


import express from 'express';
import {
    addComment,
    showComment,
    updateComment,
    deleteComment
} from '../controllers/comment.controllers.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

const router = express.Router();

// ✅ Add Comment to Blog
router.post('/:blogId', isLoggedIn, addComment);

// ✅ Get Comments of a Blog
router.get('/blog/:blogId', showComment);

// ✅ Update Comment
router.put('/:commentId', isLoggedIn, updateComment);

// ✅ Delete Comment
router.delete('/:commentId', isLoggedIn, deleteComment);

export default router;
