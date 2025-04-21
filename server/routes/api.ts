import { Router } from 'express';
import { search } from '../controllers/searchSymbol';
import { getMarketData } from '../controllers/marketData';
import { placeOrder } from '../controllers/order';

const router = Router();

router.get('/search', search);
router.get('/marketData', getMarketData);
router.post('/order', placeOrder);

export default router;
