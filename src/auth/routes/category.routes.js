import express from 'express'
import {
    createCategory,
    getAllCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
} from '../controllers/category.controllers.js'
import { isLoggedIn } from '../middleware/auth.middleware.js';

const router = express.Router()

router.post('/', isLoggedIn, createCategory);
router.get("/", getAllCategory);
router.get('/:id', getCategoryById)
router.put('/:id', isLoggedIn, updateCategory);
router.delete('/:id', isLoggedIn, deleteCategory)






export default router;