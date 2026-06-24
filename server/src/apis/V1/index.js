import express from 'express';
const router = express.Router();
import imageRoutes from './image.route.js';

router.use('/image', imageRoutes);

export default router;