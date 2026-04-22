// import dotenv from "dotenv";
// import app from "./app.js";
// import connectDB from "./db/dbConnection.js";


// // imoprt all routes
// import userRoutes from './routes/user.route.js'
// import blogRoutes from './routes/blog.route.js'
// import commentRoutes from './routes/comment.route.js'
// import categoryRoutes from './routes/category.routes.js'
// import likeRoutes from "./routes/like.route.js"


// dotenv.config({
//   path: "./.env",
// });


// const PORT = process.env.PORT || 8000;


// connectDB()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`✅ Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("❌ MongoDB Connection Error:", error.message);
//   });



// // User Routes

// app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/blogs", blogRoutes);
// app.use("/api/v1/comments", commentRoutes);
// app.use("/api/v1/categories", categoryRoutes);
// app.use("/api/v1/likes", likeRoutes);


import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/dbConnection.js";

dotenv.config();

// DB connection (serverless safe)
let isConnected = false;

const connectOnce = async () => {
  if (isConnected) return;
  await connectDB();
  isConnected = true;
};

// Vercel will call this
export default async function handler(req, res) {
  await connectOnce();
  return app(req, res);
}
