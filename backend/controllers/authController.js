import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        const user = await User.findOne({ email });

        if (user) {
            console.log(`User found: ${user.email}, Role: ${user.role}`);
            const isMatch = await user.matchPassword(password);
            console.log(`Password match result: ${isMatch}`);

            if (isMatch) {
                res.json({
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id, user.role),
                });
                return;
            }
        } else {
            console.log(`User NOT found: ${email}`);
        }

        res.status(401);
        throw new Error('Invalid email or password');
    } catch (error) {
        console.error(`Login error for ${req.body.email}:`, error.message);
        next(error);
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        next(error);
    }
};
