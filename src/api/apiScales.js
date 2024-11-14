import axios from 'axios';

const apiScales = axios.create({
  withCredentials: false,
  baseURL: 'http://10.0.1.78:8080',
});

export default apiScales;