import Follow from "../models/Follow.js";
import User from "../models/User.js";

export const followUser =
    async (req, res) => {

        try {

            if (
                req.user._id.toString() ===
                req.params.id
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot follow yourself"
                });
            }

            const exists =
                await Follow.findOne({
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

            await User.findByIdAndUpdate(
                req.user._id,
                { $inc: { following_count: 1 } }
            );

            await User.findByIdAndUpdate(
                req.params.id,
                { $inc: { followers_count: 1 } }
            );

            res.json({
                success: true,
                message: "Followed user"
            });

        }
        catch (err) {

            res.status(500).json({
                success: false,
                message: err.message
            });

        }

    };

// unfollow
export const unfollowUser =
    async (req, res) => {

        const relation =
            await Follow.findOneAndDelete({
                follower: req.user._id,
                following: req.params.id
            });

        if (!relation) {
            return res.status(404).json({
                success: false,
                message: "Not following user"
            });
        }

        await User.findByIdAndUpdate(
            req.user._id,
            { $inc: { following_count: -1 } }
        );

        await User.findByIdAndUpdate(
            req.params.id,
            { $inc: { followers_count: -1 } }
        );

        res.json({
            success: true,
            message: "Unfollowed user"
        });

    };

// list followers
export const getFollowers =
    async (req, res) => {

        const followers =
            await Follow.find({
                following: req.user._id
            }).populate(
                "follower",
                "username first_name last_name"
            );

        res.json({
            success: true,
            data: followers
        });

    };

