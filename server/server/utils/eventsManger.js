import EventEmitter from 'events';
import { updateRequestsWithFaces } from '../models/request.js';

export const EVENT_TYPES = {
  DETECT_FACES: 'detectFaces',
};

const myEmitter = new EventEmitter();

export const emitEvent = (eventName, payload) => {
  myEmitter.emit(eventName, payload);
};

myEmitter.on(EVENT_TYPES.DETECT_FACES, updateRequestsWithFaces);
