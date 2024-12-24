import api from '../../api/api';

const createRequest = async (newRequest) => {
  const res = await api.post('/maintenance/createRequest', newRequest);
  return res.data;
}

export default createRequest;