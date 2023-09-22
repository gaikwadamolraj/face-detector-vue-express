import express from 'express';
import multer from 'multer';
import path from 'path';
import { v1 } from 'uuid';
import { detectAllFaces } from '../utils/index.js';
import EventEmitter from 'events';

const REQUEST_STATUS = {
  COMPLETED: 'Completed',
  PROCESS: 'Processing',
  QUEUED: 'Queued',
};
const router = express.Router();

const myEmitter = new EventEmitter();

let requests = [
  {
    id: '12321-sdfs',
    name: 'sample',
    status: REQUEST_STATUS.COMPLETED,
    path: '/api/static/resources/static/uploads/amol.jpg',
    faces: 1,
  },
];
const getFaces = (imagePath) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ id: 1 }, { id: 2 }]);
    }, 5000);
  });
};

const updateStatusRequestById = (id, reqObj) => {
  requests = requests.map((ele) => {
    if (ele.id === id) {
      ele = { ...ele, ...reqObj };
    }
    return ele;
  });
};
const updateRequestsWithFaces = async (data) => {
  // Actual Google Cloud Vision method
  // const faces = await detectAllFaces(imagePath);

  updateStatusRequestById(data.id, { status: REQUEST_STATUS.PROCESS });
  // As of now working with mock method
  const faces = await getFaces(data.imagePath);
  updateStatusRequestById(data.id, {
    faces: faces.length,
    status: REQUEST_STATUS.COMPLETED,
  });
};

// Register the function
myEmitter.on('detectFaces', updateRequestsWithFaces);

router.get('/', async (req, res) => {
  try {
    res.json(requests);
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
});

router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const request = requests.find((request) => request.id === id);
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
});

router.post('/', async (req, res) => {
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

      const { filename, originalname } = req.files[0];
      const imagePath = resourcePath + filename;
      const urlPath = `/api/static/${imagePath}`;
      const reqResponse = {
        mediaName: filename,
        origMediaName: originalname,
        mediaSource: `http://${req.headers.host}${urlPath}`,
      };

      const request = {
        id: v1(),
        name: req.body.text,
        status: REQUEST_STATUS.QUEUED,
        faces: 0,
        path: urlPath,
      };

      requests.push(request);

      // Emitter will do our job in backend.
      // Future we will move to MQ system
      myEmitter.emit('detectFaces', {
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
});

export default router;
