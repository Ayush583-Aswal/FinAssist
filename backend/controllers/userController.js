import User from '../models/userModel.js';
import { ApiResponse } from '../utils/apiResponse.js';

// Register a new user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({ name, email, password });
        const token = user.getJwtToken();
        res.status(201).json(new ApiResponse(201, { user, token }, 'User registered successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json(new ApiResponse(400, null, 'Please provide email and password'));
    }

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json(new ApiResponse(401, null, 'Invalid credentials'));
        }

        const token = user.getJwtToken();
        res.status(200).json(new ApiResponse(200, { user, token }, 'Login successful'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, error.message));
    }
};