import User from "../models/User.js";

export const getProfile = async (req, res, next) => {
    try {
        res.json({
            success: true,
            data: req.user
        });
    } catch (err) {
        next(err);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, {
            new: true
        });

        res.json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password -email");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};
