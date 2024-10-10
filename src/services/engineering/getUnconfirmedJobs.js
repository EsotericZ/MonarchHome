import api from '../../api/api';

const getUnconfirmedJobs = async () => {
  const res = await api.get('/engineering/getUnconfirmedJobs');
  return res.data
};

export default getUnconfirmedJobs;