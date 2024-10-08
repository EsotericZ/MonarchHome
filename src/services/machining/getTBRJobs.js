import api from '../../api/api';

const getTBRJobs = async () => {
  const res = await api.get('/machining/getTBRJobs');
  return res.data
};

export default getTBRJobs;