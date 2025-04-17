import { Router } from 'express';
import { hello } from '../controllers/example';

const router = Router();
router.get('/hello', hello);

export default router;
