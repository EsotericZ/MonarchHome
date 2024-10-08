import api from '../../api/api';

const getAllFormJobs = async () => {
  const res = await api.get('/forming/getAllJobs');
  return res.data
};

export default getAllFormJobs;