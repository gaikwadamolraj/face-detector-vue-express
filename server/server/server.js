import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import usersRoute from './routes/users.js';
import requestsRoute from './routes/requests.js';
import { authenticate } from './middleware/authenticate.js';

const app = express();
const port = process.env.PORT || 5000;

global.__basedir = process.cwd();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// static file server
app.use('/api/static', express.static(__basedir));

//Routes
app.use('/api/requests', authenticate, requestsRoute);
app.use('/api/users', usersRoute);

// Return not implemented method
app.use(function (req, res) {
  res.status(501).json({
    error: 'Method not implemented',
  });
});

// Catch unhandled error
app.use(function (err, req, res, next) {
  if (!err) {
    next();
  }
  res.status(500).json({ error: 'Internal server error' });
});

// Application start
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
