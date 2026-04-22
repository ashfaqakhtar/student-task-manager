import express from "express";
import { createAdmin } from "../controllers/admin.controller.js";
import { isLoggedIn, isSuperAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Only Super Admin can create Admin
router.post("/create", isLoggedIn, isSuperAdmin, createAdmin);

export default router;
