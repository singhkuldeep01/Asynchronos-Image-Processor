import express from 'express';
import  uploadImageController  from '../../controller/image.controller.js';
const router = express.Router();
import upload from '../../config/multer.config.js';

router.post('/', upload.single('image'), uploadImageController);

export default router;