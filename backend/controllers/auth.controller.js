import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import * as authService from '../services/auth.service.js';

export const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body ?? {};

    if (!username || !password) {
        throw new AppError('Username and password required', 400);
    }

    const result = await authService.login(username, password);
    res.json(result);
});


export const me = (req, res) => {
    res.json({ username: req.admin.username });
};