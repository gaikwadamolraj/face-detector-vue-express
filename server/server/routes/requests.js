import express from 'express';
import multer from 'multer';
import path from 'path';
import { v1 } from 'uuid';
import { detectAllFaces } from '../utils/index.js';
import EventEmitter from 'events';

const router = express.Router();

const myEmitter = new EventEmitter();

let requests = [
    {
        id: 1,
        name: 'sample',
        status: 'queued',
        path: '/api/resources/static/uploads/1695373591098-Amol_Profile.jpg',
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

const updateRequestsWithFaces = async (data) => {
    // Actual Google Cloud Vision method
    // const faces = await detectAllFaces(imagePath);

    // As of now working with mock method
    const faces = await getFaces(data.imagePath);
    requests = requests.map((ele) => {
        if (ele.id === data.id) {
            ele.faces = faces.length;
            ele.status = 'completed';
        }
        return ele;
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

        const request = requests.find((request) => request.id === parseInt(id));
        if (!request) {
            throw new Error('Request not found');
        }
        requests = requests.map((ele) => {
            if (ele.id === parseInt(id)) {
                ele.status = status;
            }
            return ele;
        });

        res.status(204).json({});
    } catch (err) {
        console.error(`Error occured while path the request `, err);
        res.status(404).json({
            errors: [
                {
                    title: 'Bad request',
                    detail: 'Request validation failed',
                    errorMessage: error.message,
                },
            ],
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const storage = multer.diskStorage({
            destination: (req, file, callback) => {
                callback(null, path.join(__basedir, '/resources/static/uploads/'));
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
            const request = {
                id: v1(),
                name: req.body.text,
                status: 'queued',
                faces: 0,
            };

            requests.push(request);
            const { filename, originalname } = req.files[0];
            const reqResponse = {
                mediaName: filename,
                origMediaName: originalname,
                mediaSource: `http://${req.headers.host}/api/static/resources/static/uploads/${filename}`,
            };
            const imagePath = path.join(
                __basedir,
                `/resources/static/uploads/${request.mediaName}`
            );

            // Emitter will do our job in backend.
            // Future we will move to MQ system
            myEmitter.emit('detectFaces', { id: request.id, imagePath });

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
