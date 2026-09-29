import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/auth.controller.js';
import auth from '../middleware/auth.js';
const router = Router();

// Ek IP se 15 minute mein sirf 10 login koshishein
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many attempts, try again later' },
});

router.post('/login', loginLimiter, authController.login);



router.get('/me', auth, authController.me);   // login route ke neeche

export default router;