import api from '../../api/api';

const getAllTLJobs = async () => {
  const res = await api.get('/tlaser/getAllJobs');
  return res.data
};

export default getAllTLJobs;