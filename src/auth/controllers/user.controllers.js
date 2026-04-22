import User from "../model/User.model.js";
import crypto from "crypto";
import sendVerificationMail from "../mail/mail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import forgotPasswordMail from '../mail/forgotPasswordMail.js'


// register controller 
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // 🧩 Validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters long",
        });
    }

    try {
        // 🔎 Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        }

        // 🔐 Create email verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        console.log("✅ Verification Token:", verificationToken);
        console.log("⏳ Expires at:", new Date(verificationTokenExpiry));

        // 🧩 Create new user
        const user = await User.create({
            name,
            email,
            password,
            verificationToken,          // ✅ same key as in model
            verificationTokenExpiry,    // ✅ same key as in model
        });

        // 📧 Send verification email
        console.log("📧 Sending verification to:", user.email);
        await sendVerificationMail(user.email, verificationToken);

        // ✅ Send success response
        return res.status(201).json({
            success: true,
            message: "User registered successfully! Please verify your email.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("❌ Error during registration:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error. User registration failed.",
        });
    }
};

//email verification controller
const userVerify = async (req, res) => {

    const { token } = req.params;

    try {

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Token"
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Email Verified '
        })


    } catch (error) {
        console.error("❌ Error during registration:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error during email verification.",
        });
    }

}

// login controlller 
const login = async (req, res) => {

    const { email, password } = req.body

    try {

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials ! pleae enter email and pasword"
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not registerd ! Please signup !!"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        // console.log(isMatch);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password !!"
            })
        }

        const token = jwt.sign({ id: user._id, role: user.role },

            process.env.JWT_SECRET, {
            expiresIn: "24hr"
        }
        );

        const isProd = process.env.NODE_ENV === "production";
        const cookieOptions = {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        }

        res.cookie("cookie", token, cookieOptions)

        res.status(200).json({
            success: true,
            message: "login sucessfull",
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
            }
        })


    } catch (error) {
        console.error("❌ Login Failed", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error during login",
        });
    }

}


//profile controller 
const profile = async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select('-password')

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Error User not found !!"
            })
        }

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Internal Server Error"
        });
    }


}

// logout controller 

const logout = async (req, res) => {

    try {

        res.cookie("cookie", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 0
        })
        res.status(200).json({
            success: true,
            message: "Logged out successfully !!"
        })

    } catch (error) {
        return res.status(400).json({
            sucess: false,
            message: "something went wrong ! logging out failed !!"
        })
    }
}

// forgot password
const forgotPassword = async (req, res) => {

    const { email } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                sucess: false,
                message: "User not found !! please enter correct email to reset your password"
            })
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = Date.now() + 10 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        await forgotPasswordMail(user.email, resetToken);

        res.status(200).json({
            success: true,
            message: "Reset Link sent successfully. Please check your Inbox !"
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Something went Wrong ! Please try again to reset password !!"
        })
    }
}


// Reset Password Controller
const resetPassword = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        // 🧩 Step 1: Validate input
        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Invalid password! Must be at least 6 characters long.",
            });
        }

        // 🧩 Step 2: Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token!",
            });
        }

        // 🧩 Step 3: Hash new password
        // const hashedPassword = await bcrypt.hash(password, 10);

        // 🧩 Step 4: Update password and clear token
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        // 🧩 Step 5: Send success response
        return res.status(200).json({
            success: true,
            message: "Password reset successful! Please log in with your new password.",
        });
    } catch (error) {
        console.error("❌ Reset Password Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error! Password reset failed.",
        });
    }
};


export {
    registerUser,
    userVerify,
    login,
    profile,
    logout,
    resetPassword,
    forgotPassword,
};
