import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import AppError from '../utils/AppError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'products');

// Extension file ke naam se nahi, type se banti hai (naam par bharosa nahi)
const EXTENSIONS = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const name = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
        cb(null, name + EXTENSIONS[file.mimetype]);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        if (!EXTENSIONS[file.mimetype]) {
            return cb(new AppError('Only JPG, PNG or WEBP images are allowed', 400));
        }
        cb(null, true);
    },
});

// Multer ke errors ko apne AppError mein badalta hai
const uploadImage = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (!err) return next();

        if (err instanceof multer.MulterError) {
            const message =
                err.code === 'LIMIT_FILE_SIZE' ? 'Image must be under 2MB' : 'Invalid file upload';
            return next(new AppError(message, 400));
        }
        next(err);
    });
};

export default uploadImage;