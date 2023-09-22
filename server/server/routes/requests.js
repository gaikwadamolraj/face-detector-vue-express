import express from 'express';
import multer from 'multer';
import path from 'path';
import { v1 } from 'uuid';
import { detectAllFaces } from '../utils/index.js';

const router = express.Router();

let requests = [
    {
        id: 1,
        name: 'sample',
        status: 'queued',
        path: '/api/resources/static/uploads/1695373591098-Amol_Profile.jpg',
        faces: 1,
    },
    {
        id: 2,
        name: 'snehal',
        status: 'completed',
        path: '/api/resources/static/uploads/1695373591098-Amol_Profile.jpg',
        faces: 1,
    },
];
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

            requests.push({
                id: v1(),
                name: req.body.text,
                status: 'queued',
                faces: 0
            });
            const { filename, originalname } = req.files[0]
            const request = {
                mediaName: filename,
                origMediaName: originalname,
                mediaSource:
                    `http://${req.headers.host}/api/static/resources/static/uploads/${filename}`,
            }
            const imagePath = path.join(
                __basedir,
                `/resources/static/uploads/${request.mediaName}`
            );
            // detectAllFaces(imagePath).then(faces => {
            //     return res.status(201).json({...request, ...{faces: faces.length}});
            // })

            return res.status(201).json({ ...request, ...{ faces: 0 } });
        });
        // from here we can call the gcloud function. Tested and code is working for the same
        //await detectAllFaces(imagePath);
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
