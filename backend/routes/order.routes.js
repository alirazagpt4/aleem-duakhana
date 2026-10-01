import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import auth from '../middleware/auth.js';
import * as orderController from '../controllers/order.controller.js';

const router = Router();

// Spam se bachne ke liye: ek IP se ghante mein 20 orders
const orderLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: { message: 'Too many orders from this connection, try again later' },
});


router.post('/', orderLimiter, orderController.create);   // public
router.get('/', auth, orderController.getAll);            // admin
router.get('/:id', auth, orderController.getOne);         // admin
router.patch('/:id', auth, orderController.update);       // admin

export default router;