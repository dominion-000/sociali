import Follow from "../models/Follow.js";
import User from "../models/User.js";
import { paginate, getPaginationData } from "../utils/pagination.js";

export const followUser = async (req, res, next) => {
    try {
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({
                success: false,
                message: "Cannot follow yourself"
            });
        }

        const exists = await Follow.findOne({
            follower: req.user._id,
            following: req.params.id
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Already following"
            });
        }

        await Follow.create({
            follower: req.user._id,
            following: req.params.id
        });

        await User.findByIdAndUpdate(req.user._id, {
            $inc: { following_count: 1 }
        });

        await User.findByIdAndUpdate(req.params.id, {
            $inc: { followers_count: 1 }
        });

        res.json({
            success: true,
            message: "Followed user"
        });
    } catch (err) {
        next(err);
    }
};

export const unfollowUser = async (req, res, next) => {
    try {
        const relation = await Follow.findOneAndDelete({
            follower: req.user._id,
            following: req.params.id
        });

        if (!relation) {
            return res.status(404).json({
                success: false,
                message: "Not following user"
            });
        }

        await User.findByIdAndUpdate(req.user._id, {
            $inc: { following_count: -1 }
        });

        await User.findByIdAndUpdate(req.params.id, {
            $inc: { followers_count: -1 }
        });

        res.json({
            success: true,
            message: "Unfollowed user"
        });
    } catch (err) {
        next(err);
    }
};

export const getFollowers = async (req, res, next) => {
    try {
        const { page, limit, skip } = paginate(req);

        const followers = await Follow.find({
            following: req.user._id
        })
            .populate("follower", "username first_name last_name")
            .skip(skip)
            .limit(limit);

        const total = await Follow.countDocuments({
            following: req.user._id
        });

        res.json({
            success: true,
            data: followers,
            pagination: getPaginationData(total, page, limit)
        });
    } catch (err) {
        next(err);
    }
};

export const getFollowing = async (req, res, next) => {
    try {
        const { page, limit, skip } = paginate(req);

        const following = await Follow.find({
            follower: req.user._id
        })
            .populate("following", "username first_name last_name")
            .skip(skip)
            .limit(limit);

        const total = await Follow.countDocuments({
            follower: req.user._id
        });

        res.json({
            success: true,
            data: following,
            pagination: getPaginationData(total, page, limit)
        });
    } catch (err) {
        next(err);
    }
};
