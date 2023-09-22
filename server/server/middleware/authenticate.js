import { verifyToken } from '../utils/index.js';

export const authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [, token] = authorization?.split('Bearer ');

    if (typeof token !== 'string' || !verifyToken(token)) {
      throw new Error('Invalid token');
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({
      errors: [
        {
          title: 'Unauthorized',
          detail: 'Authentication credentials invalid',
          errorMessage: err.message,
        },
      ],
    });
  }
};
