import api from '../../api/api';

const getFRJobs = async () => {
  const res = await api.get('/shear/getFRJobs');
  return res.data
};

export default getFRJobs;