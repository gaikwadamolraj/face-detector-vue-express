import { getUserByEmail, saveUser } from '../models/user.js';
import {
  compareHash,
  createToken,
  createHash,
  isEmail,
} from '../utils/index.js';

export const register = async (req, res) => {
  try {
    const { email, password, access_level } = req.body;
    if (!isEmail(email)) {
      throw new Error('Email must be a valid email address.');
    }
    if (typeof password !== 'string') {
      throw new Error('Password must be a string.');
    }
    const hash = await createHash(password);
    const user = getUserByEmail(email);
    if (user) {
      throw new Error('username already registerd.');
    }

    saveUser({ email, password: hash, access_level });
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
};

export const login = async (req, res) => {
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

    const user = getUserByEmail(email);

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
      token: createToken(user),
      user: { email: user.email, access_level: user.access_level, id: user.id },
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
};
