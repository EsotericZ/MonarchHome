import api from '../../api/api';

const getAllRequests = async () => {
  const res = await api.get('/maintenance/getAllRequests');
  return res.data
};

export default getAllRequests;