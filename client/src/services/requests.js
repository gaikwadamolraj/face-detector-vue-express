import axios from "axios";

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchRequests = async () =>
  await axios.get("/api/requests", { headers: getAuthHeader() });
export const createRequest = async (formdata) => {
  return await axios.post("/api/requests", formdata, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeader(),
    },
  });
};
