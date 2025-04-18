import { Router } from 'express';
import { search } from '../controllers/searchSymbol';

const router = Router();

router.get('/search', search);

export default router;
