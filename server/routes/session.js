import express from 'express';
import Sessions from '../controllers/Sessions';

const router = express.Router();

router.post('/sessions/create', Sessions.create);
router.patch('/sessions/:token/destroy', Sessions.destroy);

export default router;
