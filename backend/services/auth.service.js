import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/index.js';
import AppError from '../utils/AppError.js';

export const login = async (username, password) => {
    const admin = await Admin.findOne({ where: { username } });
    const isMatch = admin && (await bcrypt.compare(password, admin.password_hash));

    // Galat username ya galat password, dono par ek hi message
    if (!isMatch) {
        throw new AppError('Invalid username or password', 401);
    }

    const token = jwt.sign(
        { id: admin.id, username: admin.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return { token, username: admin.username };
};