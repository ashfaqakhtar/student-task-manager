import User from "../model/User.model.js"; // assuming User model already hai
import bcrypt from "bcryptjs";

// Super Admin creates Admin
export const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required!"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Admin with this email already exists!"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const newAdmin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin" // explicitly admin
        });

        return res.status(201).json({
            success: true,
            message: "Admin created successfully!",
            data: { name: newAdmin.name, email: newAdmin.email, role: newAdmin.role }
        });

    } catch (error) {
        console.error("Error creating admin:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error! Cannot create admin."
        });
    }
};
