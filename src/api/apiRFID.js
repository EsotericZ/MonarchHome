import axios from 'axios';

const apiRFID = axios.create({
    baseURL: 'http://10.0.1.45:3001'
});

export default apiRFID;