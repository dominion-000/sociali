import User from "../models/User.js";
import generateToken from "../config/jwt.js";

export const signup = async (req, res, next) => {
    try {
        const {
            first_name,
            last_name,
            username,
            email,
            password,
            date_of_birth
        } = req.body;

        const exists = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (exists) {
            return res.status(409).json({
                success: false,
                message: "User exists"
            });
        }

        const user = await User.create({
            first_name,
            last_name,
            username,
            email,
            password,
            date_of_birth
        });

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    email: user.email,
                    date_of_birth: user.date_of_birth
                },
                token: generateToken(user._id)
            }
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    email: user.email,
                    date_of_birth: user.date_of_birth
                },
                token: generateToken(user._id)
            }
        });
    } catch (err) {
        next(err);
    }
};
