import { getUserByEmail, isAdmin } from '../models/user.js';
import { decodeToken, verifyToken } from '../utils/index.js';

export const authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [, token] = authorization?.split('Bearer ');

    if (typeof token !== 'string' || !verifyToken(token)) {
      throw new Error('Invalid token');
    }

    const tokenData = decodeToken(token);
    const user = getUserByEmail(tokenData.email);
    if (!user) {
      throw new Error('Invalid token');
    }

    req.user = { id: user.id, email: user.email, isAdmin: isAdmin(user) };
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
