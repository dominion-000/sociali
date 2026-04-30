import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true
        },

        last_name: {
            type: String,
            required: true
        },

        username: {
            type: String,
            unique: true,
            required: true,
            lowercase: true
        },

        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true
        },

        date_of_birth: {
            type: Date
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false
        },

        bio: {
            type: String,
            default: ""
        },

        followers_count: {
            type: Number,
            default: 0
        },

        following_count: {
            type: Number,
            default: 0
        }

    },
    { timestamps: true }
);

// password hashing
userSchema.pre("save", async function() {
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(
        this.password,
        salt
    );
});

// compare method
userSchema.methods.matchPassword =
    async function(password) {

        return await bcrypt.compare(
            password,
            this.password
        );

    };

export default mongoose.model(
    "User",
    userSchema
);
