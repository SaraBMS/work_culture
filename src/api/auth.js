import axios from 'axios';
import mockAdapter from './mockAdapter';

// No backend: auth is mocked locally (any credentials return a token).
const API_URL = 'http://localhost:3200/api/auth';

export const register = async (email, password) => {
    return await axios.post(`${API_URL}/register`, { email, password }, { adapter: mockAdapter });
};

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password }, { adapter: mockAdapter });
    return response.data.token;
};
