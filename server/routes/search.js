import express from 'express';
import Search from '../controllers/Search';
import middlewares from '../middlewares';

const { validateSearch } = middlewares;

const route = express.Router();

route.get('/', validateSearch, Search.findQuery);

export default route;
