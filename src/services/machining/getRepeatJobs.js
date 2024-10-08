import api from '../../api/api';

const getRepeatJobs = async () => {
  const res = await api.get('/machining/getRepeatJobs');
  return res.data
};

export default getRepeatJobs;