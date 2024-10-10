import api from '../../api/api';

const getTBRJobs = async () => {
  const res = await api.get('/engineering/getTBRJobs');
  return res.data
};

export default getTBRJobs;