import express from 'express';
import session from './session';

const router = express.Router();

router.use('/', session);

export default router;
