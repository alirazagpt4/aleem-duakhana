import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

const auth = (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
        throw new AppError('Login required', 401);
    }

    try {
        req.admin = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        throw new AppError('Session expired, please login again', 401);
    }
};

export default auth;