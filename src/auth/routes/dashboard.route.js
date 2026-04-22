// // routes/dashboard.routes.js
// import express from "express";
// import { getDashboardStats } from "../controllers/dashboard.controller.js";
// import { isLoggedIn, isAdminOrSuperAdmin } from "../middleware/auth.middleware.js";

// const router = express.Router();

// // GET /api/dashboard
// router.get("/", isLoggedIn, isAdminOrSuperAdmin, getDashboardStats);

// export default router;


import express from "express";
import { createAdmin } from "../controllers/admin.controller.js";
import { isLoggedIn, isSuperAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", isLoggedIn, isSuperAdmin, createAdmin);
