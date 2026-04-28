import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import protect from "./middleware/auth.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// home
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Social API is running 🚀",
  });
});

// auth
app.use(
 "/api/v1/auth",
 authRoutes
);

// test auth middleware
app.get(
 "/api/v1/protected",
 protect,
 (req,res)=>{
   res.json({
    success:true,
    user:req.user
   });
 });

export default app;
