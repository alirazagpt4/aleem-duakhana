import { Router } from 'express';
import auth from '../middleware/auth.js';
import * as productController from '../controllers/product.controller.js';
import uploadImage from '../middleware/upload.js';


const router = Router();

router.get('/', productController.getAll);                        // public
router.get('/admin/all', auth, productController.getAllAdmin);    // admin
router.get('/:id', productController.getOne);                     // public
router.post('/', auth, uploadImage, productController.create);
router.put('/:id', auth, uploadImage, productController.update);
router.delete('/:id', auth, productController.remove);            // admin

export default router;