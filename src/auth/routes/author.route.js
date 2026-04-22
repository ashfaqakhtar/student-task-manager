import express from "express";
import { makeAuthor } from "../controllers/authorController.js";
import { isLoggedIn} from "../middleware/auth.middleware.js";

const router = express.Router();

// Only Admin/SuperAdmin can make someone author
router.put("/make-author/:userId", isLoggedIn, authorizeRoles("admin", "superadmin"), makeAuthor);

export default router;
