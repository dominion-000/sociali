import express from "express";
import protect from "../middleware/auth.js";

import {
 createPost
}
from "../controllers/post.controller.js";

const router=
express.Router();

router.post(
 "/",
 protect,
 createPost
);

export default router;
