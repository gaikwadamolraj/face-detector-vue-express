import multer from 'multer';
import path from 'path';
import { EVENT_TYPES, emitEvent } from '../utils/eventsManger.js';
import {
  REQUEST_STATUS,
  fetchReqByIdByUser,
  fetchRequestsByUser,
  saveRequest,
  updateStatusRequestById,
} from '../models/request.js';
import { getUUID } from '../utils/index.js';

export const getRequests = async (req, res) => {
  try {
    res.json(fetchRequestsByUser(req));
  } catch (err) {
    console.error(`Error occured while getting all the requests `, err);
    res.status(500).json({
      errors: [
        {
          title: 'Internal server error',
        },
      ],
    });
  }
};

export const patchRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const request = fetchReqByIdByUser(id, req.user.email);
    if (!request) {
      throw new Error('Request not found');
    }

    updateStatusRequestById(request.id, { status });

    res.status(204).send();
  } catch (err) {
    console.error(`Error occured while patch the request `, err);
    res.status(404).json({
      errors: [
        {
          title: 'Bad request',
          detail: 'Request validation failed',
          errorMessage: err.message,
        },
      ],
    });
  }
};

export const createNew = async (req, res) => {
  try {
    const resourcePath = '/resources/static/uploads/';
    const storage = multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, path.join(__basedir, resourcePath));
      },
      filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`);
      },
    });

    const upload = multer({ storage: storage }).any('file');
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).send({
          message: err,
        });
      }

      // let results = req.files.map((file) => {
      //     return {
      //         mediaName: file.filename,
      //         origMediaName: file.originalname,
      //         mediaSource:
      //             'http://' +
      //             req.headers.host +
      //             '/api/static/resources/static/uploads/' +
      //             file.filename,
      //     };
      // });

      if (!req?.files?.[0]) {
        throw new Error('Upload file not found');
      }

      const { filename, originalname } = req.files[0];
      const imagePath = resourcePath + filename;
      const urlPath = `/api/static/${imagePath}`;
      const reqResponse = {
        mediaName: filename,
        origMediaName: originalname,
        mediaSource: `http://${req.headers.host}${urlPath}`,
      };

      const request = {
        id: getUUID(),
        name: req.body.text,
        status: REQUEST_STATUS.QUEUED,
        faces: 0,
        path: urlPath,
        userEmail: req.user.email,
      };
      saveRequest(request);

      // Emitter will do our job in backend.
      // Future we will move to MQ system
      emitEvent(EVENT_TYPES.DETECT_FACES, {
        id: request.id,
        imagePath: path.join(__basedir, imagePath),
      });

      return res.status(201).json(reqResponse);
    });
  } catch (err) {
    console.error(
      `Error occured while getting creating the request with file upload `,
      err
    );
    res.status(400).json({
      errors: [
        {
          title: 'File upload failed',
          detail: 'Check email and password combination',
          errorMessage: err.message,
        },
      ],
    });
  }
};
