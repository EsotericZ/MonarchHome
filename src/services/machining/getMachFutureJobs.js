import api from '../../api/api';

const getMachFutureJobs = async () => {
  const res = await api.get('/machining/getFutureJobs');
  return res.data
};

export default getMachFutureJobs;