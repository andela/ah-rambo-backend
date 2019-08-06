import express from 'express';
import Sessions from '../controllers/Sessions';

const router = express.Router();

router.post('/create', Sessions.create);
router.get('/destroy', Sessions.destroy);

export default router;
