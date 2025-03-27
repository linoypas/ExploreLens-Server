import express from 'express';
const router = express.Router();
import { upload } from '../middlewares/uploader';
import uploadImage  from '../site-detection/service/image-analyzer';
router.post('/', upload.single('image'), uploadImage);

export default router;
