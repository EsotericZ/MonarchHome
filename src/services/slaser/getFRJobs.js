import api from '../../api/api';

const getFRJobs = async () => {
  const res = await api.get('/slaser/getFRJobs');
  return res.data
};

export default getFRJobs;