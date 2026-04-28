import express from "express";
import protect from "../middleware/auth.js";

import {
 createPost,
 getMyPosts
}
from "../controllers/post.controller.js";

const router=
express.Router();

router.post(
 "/",
 protect,
 createPost
);

router.get(
 "/me",
 protect,
 getMyPosts
);

export default router;
