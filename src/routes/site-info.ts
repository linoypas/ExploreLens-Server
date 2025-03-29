import express from 'express';
const router = express.Router();
import { upload } from '../middlewares/uploader';
import siteInformation  from '../site-detection/service/detection-service';
router.post('/mock-data', upload.single('image'), siteInformation);

export default router;
