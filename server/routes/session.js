import express from 'express';
import Sessions from '../controllers/Sessions';

const router = express.Router();

router.post('/sessions/create', Sessions.create);

export default router;
