import { detectAllFaces } from '../utils/index.js';

export const REQUEST_STATUS = {
  COMPLETED: 'Completed',
  PROCESS: 'Processing',
  QUEUED: 'Queued',
};

let requests = [
  {
    id: '12321-sdfs',
    name: 'sample',
    status: REQUEST_STATUS.COMPLETED,
    path: '/api/static/resources/static/uploads/amol.jpg',
    faces: 1,
    userEmail: 'a@a.com',
  },
];

const getFaces = (imagePath) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ id: 1 }, { id: 2 }]);
    }, 5000);
  });
};

export const updateStatusRequestById = (id, reqObj) => {
  requests = requests.map((ele) => {
    if (ele.id === id) {
      ele = { ...ele, ...reqObj };
    }
    return ele;
  });
};
export const updateRequestsWithFaces = async (data) => {
  // Actual Google Cloud Vision method
  const faces = await detectAllFaces({ imagePath: data.imagePath });

  updateStatusRequestById(data.id, { status: REQUEST_STATUS.PROCESS });
  // As of now working with mock method
  // const faces = await getFaces(data.imagePath);
  const numFaces = faces.length;
  console.log(`Found ${numFaces} faces`);
  updateStatusRequestById(data.id, {
    faces: numFaces,
    status: REQUEST_STATUS.COMPLETED,
  });
};

export const fetchRequestsByUser = (req) => {
  if (req.user.isAdmin) {
    return requests;
  } else {
    return requests.filter((userReq) => userReq.userEmail === req.user.email);
  }
};

export const fetchReqByIdByUser = (id, userEmail) =>
  requests.find(
    (request) => request.id === id && request.userEmail === userEmail
  );

export const saveRequest = (request) => requests.push(request);
