import express from 'express';
import {
  getRequests,
  patchRequest,
  createNew,
} from '../controller/RequestController.js';

const requestRoutes = express.Router();

requestRoutes.route('/').get(getRequests).post(createNew);
requestRoutes.route('/:id').patch(patchRequest);

export default requestRoutes;
