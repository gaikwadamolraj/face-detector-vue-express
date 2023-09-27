import axios from "axios";

const PROGRESS_STATUS = ["Processing", "Queued"];
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchRequests = async () => {
  const res = await axios.get("/api/requests", { headers: getAuthHeader() });
  return res.data;
};

export const createRequest = async (formdata) => {
  return await axios.post("/api/requests", formdata, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeader(),
    },
  });
};

export const isReqInProcess = (requests) =>
  requests?.some((req) => PROGRESS_STATUS.includes(req.status));
