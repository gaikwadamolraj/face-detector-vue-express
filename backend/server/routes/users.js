import express from 'express';
import {
  compareHash,
  createToken,
  createHash,
  isEmail,
} from '../utils/index.js';

const router = express.Router();

const users = [];
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!isEmail(email)) {
      throw new Error('Email must be a valid email address.');
    }
    if (typeof password !== 'string') {
      throw new Error('Password must be a string.');
    }
    const hash = await createHash(password);
    const user = users.find((user) => user.email === email);
    if (user) {
      throw new Error('username already registerd.');
    }

    users.push({ email, password: hash });

    res.status(201).json({
      title: 'User Registration Successful',
      detail: 'Successfully registered new user',
    });
  } catch (err) {
    res.status(400).json({
      errors: [
        {
          title: 'Registration Error',
          detail: err.message,
        },
      ],
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!isEmail(email)) {
      return res.status(400).json({
        errors: [
          {
            title: 'Bad Request',
            detail: 'Email must be a valid email address',
          },
        ],
      });
    }
    if (typeof password !== 'string') {
      return res.status(400).json({
        errors: [
          {
            title: 'Bad Request',
            detail: 'Password must be a string',
          },
        ],
      });
    }

    const user = users.find((user) => user.email === email);

    if (!user || !(await compareHash(user.password, password))) {
      return res.status(401).json({
        errors: [
          {
            title: 'Unauthorized',
            detail: 'Invalid email or password',
          },
        ],
      });
    }

    res.json({
      title: 'Login Successful',
      detail: 'Successfully validated user credentials',
      token: createToken({ email }),
    });
  } catch (err) {
    console.error(`Error occured while user login `, err);
    res.status(401).json({
      errors: [
        {
          title: 'Invalid Credentials',
          detail: 'Check email and password combination',
          errorMessage: err.message,
        },
      ],
    });
  }
});

export default router;
