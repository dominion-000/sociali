import express from "express";
import protect from "../middleware/auth.js";

import {
    createPost,
    getMyPosts,
    publishPost,
    updatePost,
    deletePost,
    getPublishedPosts,
    getSinglePost
}
    from "../controllers/post.controller.js";

const router =
    express.Router();

// me
router.get(
    "/me",
    protect,
    getMyPosts
);

// create post
router.post(
    "/",
    protect,
    createPost
);

// public posts
router.get(
    "/",
    getPublishedPosts
);

// publish
router.patch(
    "/:id/publish",
    protect,
    publishPost
);

// edit
router.patch(
    "/:id",
    protect,
    updatePost
);

// delete
router.delete(
    "/:id",
    protect,
    deletePost
);

// get a post(public)
router.get(
    "/:id",
    getSinglePost
);

export default router;
