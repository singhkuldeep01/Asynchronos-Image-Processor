import express from 'express';
import uploadImageRoutes from './uploadImage.route.js';
const router = express.Router();

router.use('/upload', uploadImageRoutes);

export default router;