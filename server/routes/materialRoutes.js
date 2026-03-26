import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  createMaterial,
  deleteMaterial,
  getMaterials,
  updateMaterial,
} from '../controllers/materialController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

router.get('/materials', getMaterials);
router.post('/materials', protect, adminOnly, upload.single('image'), createMaterial);
router.put('/materials/:id', protect, adminOnly, upload.single('image'), updateMaterial);
router.delete('/materials/:id', protect, adminOnly, deleteMaterial);

export default router;
