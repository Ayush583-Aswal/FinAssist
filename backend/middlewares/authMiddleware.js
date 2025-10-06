import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            return res.status(401).json(new ApiResponse(401, null, 'Not authorized, token failed'));
        }
    }

    if (!token) {
        return res.status(401).json(new ApiResponse(401, null, 'Not authorized, no token'));
    }
};