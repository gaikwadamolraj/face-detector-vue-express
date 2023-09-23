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
  // const faces = await detectAllFaces(imagePath);

  updateStatusRequestById(data.id, { status: REQUEST_STATUS.PROCESS });
  // As of now working with mock method
  const faces = await getFaces(data.imagePath);
  updateStatusRequestById(data.id, {
    faces: faces.length,
    status: REQUEST_STATUS.COMPLETED,
  });
};

export const fetchRequests = () => requests;

export const fetchReqById = (id) =>
  requests.find((request) => request.id === id);

export const saveRequest = (request) => requests.push(request);
