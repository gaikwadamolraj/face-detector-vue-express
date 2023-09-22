import jwt from 'jsonwebtoken';
import { genSalt, hash, compare } from 'bcrypt';
import vision from '@google-cloud/vision';

const KEY = process.env.TOKEN_KEY || '$@mp1e';
const saltRound = process.env.SALT_ROUND || 10;

export const isEmail = (email) => {
  if (typeof email !== 'string') {
    return false;
  }
  const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return emailRegex.test(email);
};

export const createToken = (data) =>
  jwt.sign(data, KEY, {
    expiresIn: process.env.TOKEN_EXPIRY || '30m',
  });

export const verifyToken = (token) => jwt.verify(token, KEY);

export const createHash = async (data) => await hash(data, await genSalt(parseInt(saltRound)));
export const compareHash = async (hash, plainText) =>
  await compare(plainText, hash);

export const detectAllFaces = async (imagePath) => {
  try {
    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.faceDetection(imagePath);
    const faces = result.faceAnnotations;
    console.log('Faces:', faces.length);
    faces.forEach((face, i) => {
      console.log(`  Face #${i + 1}:`);
      console.log(`    Joy: ${face.joyLikelihood}`);
      console.log(`    Anger: ${face.angerLikelihood}`);
      console.log(`    Sorrow: ${face.sorrowLikelihood}`);
      console.log(`    Surprise: ${face.surpriseLikelihood}`);
    });

    return faces;
  } catch (err) {
    console.error('Failed to detect the faces with error ', err);
    return [];
  }
};
