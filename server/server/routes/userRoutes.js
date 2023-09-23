import express from 'express';
import { register, login } from '../controller/UserController.js';
const userRoutes = express.Router();

userRoutes.route('/register').post(register);
userRoutes.route('/login').post(login);

export default userRoutes;
