import vision from '@google-cloud/vision';

const KEY_FILE =
  process.env['KEY_FILE'] || '../../application_default_credentials.json';

const getClient = () => {
  return new vision.ImageAnnotatorClient({
    keyFilename: KEY_FILE,
  });
};

export const fetchFacesFromVision = async ({ imagePath }) => {
  const client = getClient();

  console.log(`Fetching the faces from vision for image`);
  const [response] = await client.faceDetection(imagePath);
  if (process.env['LOG_LEVEL'] === 'debug') {
    const faces = response.faceAnnotations;
    console.log('Faces:', faces.length);
    faces.forEach((face, i) => {
      console.log(`Face #${i + 1}:`);
      console.log(`Joy: ${face.joyLikelihood}`);
      console.log(`Anger: ${face.angerLikelihood}`);
      console.log(`Sorrow: ${face.sorrowLikelihood}`);
      console.log(`Surprise: ${face.surpriseLikelihood}`);
    });
  }

  return response;
};
