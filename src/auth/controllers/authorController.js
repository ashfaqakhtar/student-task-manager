import User from "../model/User.model.js";

export const makeAuthor = async (req, res) => {
    try {
        // check permission
        if (req.user.role !== "superadmin" && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to create authors",
            });
        }

        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.role = "author";
        await user.save();

        res.status(200).json({
            success: true,
            message: `${user.name} is now an Author!`,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
