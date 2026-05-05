import express from "express";
import protect from "../middleware/auth.js";

import {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
}
    from "../controllers/follow.controller.js";

import { getProfile, updateProfile, getUserProfile }
    from "../controllers/user.controller.js";

const router =
    express.Router();

router.get("/profile/:username", getUserProfile);

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

router.get(
    "/me",
    protect,
    getProfile
);

router.patch(
    "/me",
    protect,
    updateProfile
);

export default router;
