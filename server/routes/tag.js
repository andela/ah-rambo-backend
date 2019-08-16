import express from 'express';
import Tags from '../controllers/Tags';

const route = express.Router();

route.get('/', Tags.getAll);

export default route;
