import axios from "axios";

export const STORE_KEY = {
  TOKEN: "token",
  USER: "user",
};
export const login = async (data) => await axios.post("/api/users/login", data);
export const register = async (data) =>
  await axios.post("/api/users/register", data);

const getStorageType = () => localStorage;

export const setStoreData = (key, value) =>
  getStorageType().setItem(key, value);
export const getStoreData = (key) => getStorageType().getItem(key);
export const clearStoreData = (key) => getStorageType().removeItem(key);

export const clearAllStoreData = () =>
  Object.values(STORE_KEY)?.forEach((key) => getStorageType().removeItem(key));

export const isAdmin = () => {
  try {
    let user = getStoreData(STORE_KEY.USER);
    user = JSON.parse(user);
    if (user?.access_level) {
      return parseInt(user.access_level) === 1 ? true : false;
    }
    return false;
  } catch (error) {
    return false;
  }
};
