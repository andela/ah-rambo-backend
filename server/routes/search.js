import express from 'express';
import Search from '../controllers/Search';
import middlewares from '../middlewares';

<<<<<<< HEAD
const { validateSearch } = middlewares;

const route = express.Router();

route.get('/', validateSearch, Search.findQuery);
=======
const { validatePagination } = middlewares;

const route = express.Router();

route.get('/', validatePagination, Search.findQuery);
>>>>>>> feature=[167190545]: Add search functionality

export default route;
