import axios from 'axios';

export const login = async (data) => await axios.post('/api/users/login', data)
export const register = async (data) => await axios.post('/api/users/register', data)
