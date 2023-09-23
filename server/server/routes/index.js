import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import usersRoutes from './userRoutes.js';
import requestsRoutes from './requestRoutes.js';

const apiRoutes = express.Router();

apiRoutes.use('/users', usersRoutes);
apiRoutes.use('/requests', authenticate, requestsRoutes);

export default apiRoutes;
