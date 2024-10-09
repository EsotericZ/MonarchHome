import api from '../../api/api';

const getTBRJobs = async () => {
  const res = await api.get('/slaser/getTBRJobs');
  return res.data
};

export default getTBRJobs;