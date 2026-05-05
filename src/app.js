import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";
import uiRoutes from "./routes/ui.routes.js";
import errorHandler from "./middleware/error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// request logger
app.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        console.log(
            `${req.method} ${req.url} - ${res.statusCode} - ${Date.now() - start}ms`
        );
    });

    next();
});

// UI Routes
app.use("/", uiRoutes);

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

// user
app.use(
    "/api/v1/users",
    userRoutes
);

// Not Found
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// error handling
app.use(errorHandler);

export default app;
