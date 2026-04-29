import express from "express";
import protect from "../middleware/auth.js";

import {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
}
    from "../controllers/follow.controller.js";

const router =
    express.Router();

router.post(
    "/:id/follow",
    protect,
    followUser
);

router.delete(
    "/:id/follow",
    protect,
    unfollowUser
);

router.get(
    "/me/followers",
    protect,
    getFollowers
);

router.get(
    "/me/following",
    protect,
    getFollowing
);

export default router;
