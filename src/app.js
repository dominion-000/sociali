import express from "express";
import cors from "cors";

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

export default app;
