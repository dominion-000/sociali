import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { paginate } from "../utils/pagination.js";

const router = express.Router();

// Home page - Public Feed with Search, Sort, Pagination
router.get("/", async (req, res) => {
    try {
        const { page, limit, skip } = paginate(req);
        
        let query = {
            state: "published"
        };

        const { search, tag, sort } = req.query;

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } }
            ];
        }

        if (tag) {
            query.tags = tag;
        }

        let sortQuery = { createdAt: -1 };
        if (sort === "popular") {
            sortQuery = { like_count: -1, createdAt: -1 };
        } else if (sort === "oldest") {
            sortQuery = { createdAt: 1 };
        }

        const posts = await Post.find(query)
            .populate("author", "username")
            .sort(sortQuery)
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        // Get all unique tags for the sidebar
        const allTags = await Post.distinct("tags", { state: "published" });

        res.render("index", { 
            posts, 
            query: req.query,
            pagination: {
                page,
                totalPages,
                total
            },
            allTags: allTags.slice(0, 10) // Show top 10 tags
        });
    } catch (err) {
        console.error(err);
        res.render("index", { 
            posts: [],
            query: req.query,
            pagination: { page: 1, totalPages: 0, total: 0 },
            allTags: [],
            error: "Failed to load posts"
        });
    }
});

// Single post view
router.get("/posts/:id", async (req, res) => {
    try {
        const post = await Post.findOne({
            _id: req.params.id,
            state: "published"
        }).populate("author", "username");

        if (!post) {
            return res.status(404).render("error", { message: "Post not found" });
        }

        res.render("post", { post });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", { message: "Internal server error" });
    }
});

// User profile view
router.get("/u/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password");

        if (!user) {
            return res.status(404).render("error", { message: "User not found" });
        }

        const posts = await Post.find({ 
            author: user._id,
            state: "published"
        }).sort({ createdAt: -1 });

        res.render("profile", { profileUser: user, posts });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", { message: "Internal server error" });
    }
});

// Login page
router.get("/login", (req, res) => {
    res.render("login");
});

// Register page
router.get("/register", (req, res) => {
    res.render("register");
});

export default router;
