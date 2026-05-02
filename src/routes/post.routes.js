import express from "express";
import protect from "../middleware/auth.js";

import {
    createPost,
    getMyPosts,
    publishPost,
    updatePost,
    deletePost,
    getPublishedPosts,
    getSinglePost,
    getFeed
}
    from "../controllers/post.controller.js";

import {
    likePost,
    unlikePost
}
    from "../controllers/like.controller.js";

const router =
    express.Router();

// personal
router.get(
    "/me",
    protect,
    getMyPosts
);
router.get(
    "/feed",
    protect,
    getFeed
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

// like post
router.post(
    "/:id/like",
    protect,
    likePost
);

// unlike post
router.delete(
    "/:id/like",
    protect,
    unlikePost
);

export default router;

