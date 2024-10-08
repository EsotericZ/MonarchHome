import api from '../../api/api';

const getFutureJobs = async () => {
  const res = await api.get('/machining/getFutureJobs');
  return res.data
};

export default getFutureJobs;