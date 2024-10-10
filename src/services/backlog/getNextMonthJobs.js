import api from '../../api/api';

const getNextMonthJobs = async () => {
  const res = await api.get('/backlog/getNextMonthJobs');
  return res.data
};

export default getNextMonthJobs;