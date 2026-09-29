import AppError from '../utils/AppError.js';

export const notFound = (req, res, next) => {
    next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // Jo error humne khud nahi banaya (bug, DB crash), uski detail bahar nahi jayegi
    if (!err.isOperational) {
        console.error(err);
    }

    res.status(statusCode).json({
        message: err.isOperational ? err.message : 'Something went wrong',
    });
};