import api from '../../api/api';

const getMachTBRJobs = async () => {
  const res = await api.get('/machining/getTBRJobs');
  return res.data
};

export default getMachTBRJobs;