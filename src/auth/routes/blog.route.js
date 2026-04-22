import express from 'express';
import {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
} from '../controllers/blog.controllers.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new blog (only for logged-in users)
router.post('/', isLoggedIn, createBlog);

// Get all blogs (public)
router.get('/', getAllBlogs);

// Get single blog by ID (public)
router.get('/:id', getBlogById);

// Update a blog (only author/admin)
router.put('/:id', isLoggedIn, updateBlog);

// Delete a blog (only author/admin)
router.delete('/:id', isLoggedIn, deleteBlog);

export default router;
