import Post from "../models/Post.js";
import Follow from "../models/Follow.js";
import { paginate, getPaginationData } from "../utils/pagination.js";

// create post
export const createPost = async (req, res, next) => {
    try {
        const { title, content, tags } = req.body;

        const post = await Post.create({
            title,
            content,
            tags,
            author: req.user._id
        });

        res.status(201).json({
            success: true,
            data: post
        });
    } catch (err) {
        next(err);
    }
};

// get posts
export const getMyPosts = async (req, res, next) => {
    try {
        const { page, limit, skip } = paginate(req);

        let filter = {
            author: req.user._id
        };

        if (req.query.state) {
            filter.state = req.query.state;
        }

        const posts = await Post.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments(filter);

        res.json({
            success: true,
            data: posts,
            pagination: getPaginationData(total, page, limit)
        });
    } catch (err) {
        next(err);
    }
};

// publish post
export const publishPost = async (req, res, next) => {
    try {
        const post = await Post.findOne({
            _id: req.params.id,
            author: req.user._id
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        post.state = "published";
        await post.save();

        res.json({
            success: true,
            message: "Post published",
            data: post
        });
    } catch (err) {
        next(err);
    }
};

// edit post
export const updatePost = async (req, res, next) => {
    try {
        const post = await Post.findOneAndUpdate(
            {
                _id: req.params.id,
                author: req.user._id
            },
            req.body,
            {
                new: true
            }
        );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.json({
            success: true,
            data: post
        });
    } catch (err) {
        next(err);
    }
};

// delete post
export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findOneAndDelete({
            _id: req.params.id,
            author: req.user._id
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.json({
            success: true,
            message: "Post deleted"
        });
    } catch (err) {
        next(err);
    }
};

// public/published post
export const getPublishedPosts = async (req, res, next) => {
    try {
        const { page, limit, skip } = paginate(req);

        let query = {
            state: "published"
        };

        if (req.query.search) {
            query.$or = [
                {
                    title: {
                        $regex: req.query.search,
                        $options: "i"
                    }
                },
                {
                    tags: {
                        $regex: req.query.search,
                        $options: "i"
                    }
                }
            ];
        }

        let sort = { createdAt: -1 };

        if (req.query.sort) {
            sort[req.query.sort] = -1;
        }

        const posts = await Post.find(query)
            .populate("author", "username first_name last_name")
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments(query);

        res.json({
            success: true,
            data: posts,
            pagination: getPaginationData(total, page, limit)
        });
    } catch (err) {
        next(err);
    }
};

// single published post
export const getSinglePost = async (req, res, next) => {
    try {
        const post = await Post.findOne({
            _id: req.params.id,
            state: "published"
        }).populate("author", "username first_name last_name");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.json({
            success: true,
            data: post
        });
    } catch (err) {
        next(err);
    }
};

export const getFeed = async (req, res, next) => {
    try {
        const { page, limit, skip } = paginate(req);

        // get users I follow
        const following = await Follow.find({
            follower: req.user._id
        }).select("following");

        // extract IDs
        const followingIds = following.map((f) => f.following);

        // include myself (optional but good UX)
        followingIds.push(req.user._id);

        // base query
        const query = {
            author: { $in: followingIds },
            state: "published"
        };

        // sorting
        let sort = { createdAt: -1 };

        if (req.query.sort) {
            sort[req.query.sort] = -1;
        }

        const posts = await Post.find(query)
            .populate("author", "username first_name last_name")
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments(query);

        res.json({
            success: true,
            data: posts,
            pagination: getPaginationData(total, page, limit)
        });
    } catch (err) {
        next(err);
    }
};
