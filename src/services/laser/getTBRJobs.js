import api from '../../api/api';

const getTBRJobs = async () => {
  const res = await api.get('/laser/getTBRJobs');
  return res.data
};

export default getTBRJobs;