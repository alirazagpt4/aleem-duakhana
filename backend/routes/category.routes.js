import { Router } from 'express';
import auth from '../middleware/auth.js';
import * as categoryController from '../controllers/category.controller.js';

const router = Router();

router.get('/', categoryController.getAll);                    // public
router.post('/', auth, categoryController.create);             // admin
router.put('/:id', auth, categoryController.update);           // admin
router.delete('/:id', auth, categoryController.remove);        // admin

export default router;