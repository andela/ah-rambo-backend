import express from 'express';
import Users from '../controllers/Users';

const route = express.Router();

route.post('/users/create', Users.create);

export default route;
