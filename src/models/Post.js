import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            required: true
        },

        tags: [
            {
                type: String
            }
        ],

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        state: {
            type: String,
            enum: [
                "draft",
                "published"
            ],
            default: "draft"
        },

        like_count: {
            type: Number,
            default: 0
        },

        comment_count: {
            type: Number,
            default: 0
        }

    },
    {
        timestamps: true
    }
);

postSchema.index({
    title: "text",
    tags: "text"
});

export default mongoose.model(
    "Post",
    postSchema
);
