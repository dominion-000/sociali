import express from "express";
import protect from "../middleware/auth.js";

import {
 createPost,
 getMyPosts,
 publishPost,
 updatePost,
 deletePost
}
from "../controllers/post.controller.js";

const router=
express.Router();

// create post
router.post(
 "/",
 protect,
 createPost
);

// me
router.get(
 "/me",
 protect,
 getMyPosts
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

export default router;
