import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../src/app.js";
import connectDB from "../src/config/db.js";

dotenv.config();

// connect before tests
beforeAll(async () => {
    await connectDB();
});

// close after tests
afterAll(async () => {
    await mongoose.connection.close();
});

export default app;
