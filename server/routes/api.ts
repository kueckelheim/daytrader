import { Router } from 'express';
import { search } from '../controllers/searchSymbol';
import { getMarketData } from '../controllers/marketData';

const router = Router();

router.get('/search', search);
router.get('/marketData', getMarketData);

export default router;
