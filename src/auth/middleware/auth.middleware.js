import jwt from "jsonwebtoken";

// Existing authentication middleware
export const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies?.cookie;

        if (!token) {
            console.log("No token");
            return res.status(401).json({
                success: false,
                message: "Authentication failed"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Data :", decoded);

        req.user = decoded; // user info from token
        next();

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// New middleware to check Super Admin
export const isSuperAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "superadmin") {
        return res.status(403).json({
            success: false,
            message: "Access denied! Super Admin only."
        });
    }
    next();
};
