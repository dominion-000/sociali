import Like from "../models/Like.js";
import Post from "../models/Post.js";

export const likePost = async (req, res, next) => {
    try {
        const exists = await Like.findOne({
            user: req.user._id,
            post: req.params.id
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Post already liked"
            });
        }

        await Like.create({
            user: req.user._id,
            post: req.params.id
        });

        await Post.findByIdAndUpdate(req.params.id, {
            $inc: { like_count: 1 }
        });

        res.json({
            success: true,
            message: "Post liked"
        });
    } catch (err) {
        next(err);
    }
};

export const unlikePost = async (req, res, next) => {
    try {
        const like = await Like.findOneAndDelete({
            user: req.user._id,
            post: req.params.id
        });

        if (!like) {
            return res.status(404).json({
                success: false,
                message: "Like not found"
            });
        }

        await Post.findByIdAndUpdate(req.params.id, {
            $inc: { like_count: -1 }
        });

        res.json({
            success: true,
            message: "Post unliked"
        });
    } catch (err) {
        next(err);
    }
};
