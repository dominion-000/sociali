import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// home
app.get("/", (res) => {
    res.json({
        success: true,
        message: "Sociali is running 🚀",
    });
});

// auth
app.use(
    "/api/v1/auth",
    authRoutes
);

// post
app.use(
    "/api/v1/posts",
    postRoutes
);

export default app;
