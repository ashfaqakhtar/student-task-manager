import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null; // 👈 pehle check hona chahiye

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        // Delete local file after upload (optional but recommended)
        fs.unlinkSync(localFilePath);

        console.log("✅ File uploaded successfully:", response.url);
        return response;
    } catch (error) {
        console.error("❌ Cloudinary Upload Error:", error.message);
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // Clean up failed uploads
        }
        return null;
    }
};

export { uploadCloudinary };
