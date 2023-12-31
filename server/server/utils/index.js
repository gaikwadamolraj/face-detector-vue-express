import jwt from 'jsonwebtoken';
import { genSalt, hash, compare } from 'bcrypt';
import { v1 } from 'uuid';
import { fetchFacesFromVision } from './googleVision.js';

//Key should not pass as hard coded. It should come from runtime env
const KEY = process.env.TOKEN_KEY || '$@mp1e';
const saltRound = process.env.SALT_ROUND || 10;

export const getUUID = () => v1();
export const isEmail = (email) => {
  if (typeof email !== 'string') {
    return false;
  }
  const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return emailRegex.test(email);
};

export const createToken = (user) => {
  const data = { email: user.email, id: user.id };
  return jwt.sign(data, KEY, {
    expiresIn: process.env.TOKEN_EXPIRY || '30m',
  });
};

export const verifyToken = (token) => jwt.verify(token, KEY);

export const decodeToken = (token) => jwt.decode(token, KEY);

export const createHash = async (data) =>
  await hash(data, await genSalt(parseInt(saltRound)));

export const compareHash = async (hash, plainText) =>
  await compare(plainText, hash);

export const detectAllFaces = async ({ imagePath }) => {
  try {
    const result = await fetchFacesFromVision({ imagePath });
    return result.faceAnnotations;
  } catch (err) {
    console.error('Failed to detect the faces with error ', err);
    return [];
  }
};
